import { pool } from "../server/db";

async function checkAndFixSchema() {
  try {
    console.log("🔍 Verificando esquema de la tabla users...\n");

    // Verificar columnas existentes
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'gravy2' 
      AND TABLE_NAME = 'users'
    `) as any;

    console.log("Columnas actuales:");
    columns.forEach((col: any) => console.log(`  - ${col.COLUMN_NAME}`));
    console.log();

    const columnNames = columns.map((c: any) => c.COLUMN_NAME);

    // Agregar subscriber_id si no existe
    if (!columnNames.includes('subscriber_id')) {
      console.log("➕ Agregando columna subscriber_id...");
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN subscriber_id VARCHAR(255) NULL
      `);
      console.log("✅ Columna subscriber_id agregada\n");
    } else {
      console.log("✓ Columna subscriber_id ya existe\n");
    }

    // Agregar password_hash si no existe
    if (!columnNames.includes('password_hash')) {
      console.log("➕ Agregando columna password_hash...");
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN password_hash VARCHAR(255) NULL
      `);
      console.log("✅ Columna password_hash agregada\n");
    } else {
      console.log("✓ Columna password_hash ya existe\n");
    }

    // Crear índice único para subscriber_id
    try {
      console.log("➕ Creando índice único para subscriber_id...");
      await pool.query(`
        CREATE UNIQUE INDEX idx_subscriber_id ON users (subscriber_id)
      `);
      console.log("✅ Índice creado\n");
    } catch (e: any) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log("✓ Índice ya existe\n");
      } else {
        throw e;
      }
    }

    // Crear tabla login_attempts si no existe
    console.log("➕ Creando tabla login_attempts...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NULL,
        subscriber_id VARCHAR(255) NULL,
        ip_address VARCHAR(45) NULL,
        user_agent VARCHAR(500) NULL,
        success BOOLEAN DEFAULT FALSE,
        failure_reason VARCHAR(255) NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_subscriber_id_attempts (subscriber_id),
        INDEX idx_attempted_at (attempted_at),
        INDEX idx_ip_address (ip_address)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tabla login_attempts lista\n");

    console.log("✅ Esquema actualizado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkAndFixSchema();
