import { db } from "../server/db";
import { users } from "@shared/schema";
import crypto from "crypto";

// Helper para hashear contraseña
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function seedUsers() {
  try {
    console.log("🌱 Agregando usuarios de prueba...");

    // Usuario de prueba con NIT válido
    try {
      await db.insert(users).values({
        email: "demo@gravy.local",
        subscriberId: "900123456", // NIT válido de 9 dígitos
        passwordHash: hashPassword("demo123"),
        firstName: "Demo",
        lastName: "User",
      });
      console.log("✅ Usuario demo@gravy.local creado");
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log("ℹ️  Usuario demo@gravy.local ya existe");
      } else {
        throw e;
      }
    }

    // Usuario adicional para testing
    try {
      await db.insert(users).values({
        email: "admin@gravy.local",
        subscriberId: "9001234561", // NIT con dígito de verificación
        passwordHash: hashPassword("admin123"),
        firstName: "Admin",
        lastName: "Gravy",
      });
      console.log("✅ Usuario admin@gravy.local creado");
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log("ℹ️  Usuario admin@gravy.local ya existe");
      } else {
        throw e;
      }
    }

    console.log("\n✅ Proceso completado");
    console.log("\n📋 Credenciales de prueba:");
    console.log("   Email: demo@gravy.local");
    console.log("   NIT: 900123456 o 900-123-456");
    console.log("   Password: demo123");
    console.log("\n   Email: admin@gravy.local");
    console.log("   NIT: 9001234561");
    console.log("   Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al agregar usuarios:", error);
    process.exit(1);
  }
}

seedUsers();
