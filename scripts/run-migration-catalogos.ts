import mysql from 'mysql2/promise';

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gravy2',
  });

  try {
    console.log('📋 Ejecutando migración de catálogos geográficos...\n');

    // Create paises table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS paises (
        codigo VARCHAR(2) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        INDEX idx_paises_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla paises creada');

    // Create departamentos table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departamentos (
        codigo VARCHAR(2) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        pais_codigo VARCHAR(2) NOT NULL DEFAULT 'CO',
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        INDEX idx_departamentos_pais (pais_codigo),
        INDEX idx_departamentos_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla departamentos creada');

    // Add FK for departamentos
    try {
      await connection.query(`
        ALTER TABLE departamentos 
        ADD CONSTRAINT fk_departamentos_pais 
        FOREIGN KEY (pais_codigo) REFERENCES paises(codigo)
      `);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    // Create municipios table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS municipios (
        codigo VARCHAR(5) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        departamento_codigo VARCHAR(2) NOT NULL,
        codigo_postal VARCHAR(10),
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        INDEX idx_municipios_dpto (departamento_codigo),
        INDEX idx_municipios_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla municipios creada');

    // Add FK for municipios
    try {
      await connection.query(`
        ALTER TABLE municipios 
        ADD CONSTRAINT fk_municipios_dpto 
        FOREIGN KEY (departamento_codigo) REFERENCES departamentos(codigo)
      `);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    // Update terceros table
    try {
      await connection.query(`
        ALTER TABLE terceros
        ADD COLUMN pais_codigo VARCHAR(2) DEFAULT 'CO' AFTER direccion
      `);
      console.log('✅ Campo pais_codigo agregado a terceros');
    } catch (e: any) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('⚠️  Campo pais_codigo ya existe');
    }

    try {
      await connection.query(`
        ALTER TABLE terceros
        ADD COLUMN departamento_codigo VARCHAR(2) AFTER pais_codigo
      `);
      console.log('✅ Campo departamento_codigo agregado a terceros');
    } catch (e: any) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('⚠️  Campo departamento_codigo ya existe');
    }

    try {
      await connection.query(`
        ALTER TABLE terceros
        ADD COLUMN municipio_codigo VARCHAR(5) AFTER departamento_codigo
      `);
      console.log('✅ Campo municipio_codigo agregado a terceros');
    } catch (e: any) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('⚠️  Campo municipio_codigo ya existe');
    }

    // Add foreign keys for terceros
    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_pais 
        FOREIGN KEY (pais_codigo) REFERENCES paises(codigo)
      `);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_dpto 
        FOREIGN KEY (departamento_codigo) REFERENCES departamentos(codigo)
      `);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_mpio 
        FOREIGN KEY (municipio_codigo) REFERENCES municipios(codigo)
      `);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    // Add indexes
    try {
      await connection.query(`ALTER TABLE terceros ADD INDEX idx_terceros_pais (pais_codigo)`);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    try {
      await connection.query(`ALTER TABLE terceros ADD INDEX idx_terceros_dpto (departamento_codigo)`);
    } catch (e: any) {
      if (!e.message.includes('Duplicate')) throw e;
    }

    console.log('\n✅ Migración completada exitosamente!\n');
    console.log('📦 Tablas creadas:');
    console.log('  - paises');
    console.log('  - departamentos');
    console.log('  - municipios');
    console.log('  - terceros (campos actualizados)\n');
    console.log('🚀 Siguiente paso: npx tsx scripts/seed-catalogos.ts');

  } catch (error) {
    console.error('❌ Error en migración:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
