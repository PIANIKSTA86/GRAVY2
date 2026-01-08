import mysql from 'mysql2/promise';

async function addForeignKeys() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gravy2',
  });

  try {
    console.log('🔗 Agregando foreign keys...\n');

    // Add foreign keys for terceros
    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_pais 
        FOREIGN KEY (pais_codigo) REFERENCES paises(codigo)
      `);
      console.log('✅ FK fk_terceros_pais agregado');
    } catch (e: any) {
      console.log('⚠️  FK fk_terceros_pais ya existe');
    }

    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_dpto 
        FOREIGN KEY (departamento_codigo) REFERENCES departamentos(codigo)
      `);
      console.log('✅ FK fk_terceros_dpto agregado');
    } catch (e: any) {
      console.log('⚠️  FK fk_terceros_dpto ya existe');
    }

    try {
      await connection.query(`
        ALTER TABLE terceros 
        ADD CONSTRAINT fk_terceros_mpio 
        FOREIGN KEY (municipio_codigo) REFERENCES municipios(codigo)
      `);
      console.log('✅ FK fk_terceros_mpio agregado');
    } catch (e: any) {
      console.log('⚠️  FK fk_terceros_mpio ya existe');
    }

    // Add indexes
    try {
      await connection.query(`ALTER TABLE terceros ADD INDEX idx_terceros_pais (pais_codigo)`);
      console.log('✅ Índice idx_terceros_pais agregado');
    } catch (e: any) {
      console.log('⚠️  Índice idx_terceros_pais ya existe');
    }

    try {
      await connection.query(`ALTER TABLE terceros ADD INDEX idx_terceros_dpto (departamento_codigo)`);
      console.log('✅ Índice idx_terceros_dpto agregado');
    } catch (e: any) {
      console.log('⚠️  Índice idx_terceros_dpto ya existe');
    }

    console.log('\n✅ Foreign keys e índices agregados exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

addForeignKeys()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
