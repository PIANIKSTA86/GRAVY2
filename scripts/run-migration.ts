import { pool } from "../server/db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log("🔧 Ejecutando migración de base de datos...\n");

    const migrationPath = path.join(__dirname, "../migrations/001_auth_custom.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");

    // Dividir por sentencias (separadas por ;)
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      console.log("Ejecutando:", statement.substring(0, 60) + "...");
      await pool.query(statement);
      console.log("✅ Completado\n");
    }

    console.log("✅ Migración completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando migración:", error);
    process.exit(1);
  }
}

runMigration();
