import express, { type RequestHandler, type Express } from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import { pool } from "./db";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { 
  validateNIT, 
  normalizeNIT, 
  checkRateLimit, 
  recordLoginAttempt,
  auditLoginAttempt,
  getClientIP
} from "./security";

const sessionTtl = 7 * 24 * 60 * 60; // 1 week in seconds
const MySQLStore = MySQLStoreFactory(session as any);
const basePool = (pool as any).pool ?? pool;

// Helper functions para hash de contraseña con PBKDF2 (nativo de Node.js)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const derivedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return derivedHash === hash;
}

export function getSession() {
  const sessionStore = new MySQLStore(
    {
      expiration: sessionTtl,
      createDatabaseTable: true,
      schema: {
        tableName: "sessions",
        columnNames: {
          session_id: "sid",
          expires: "expire",
          data: "sess",
        },
      },
    },
    basePool,
  );

  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl * 1000,
      sameSite: "lax",
    },
  });
}

export function setupAuthRoutes(app: Express) {
  // Middleware de sesión
  app.use(getSession());

  // Login - POST /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    const clientIP = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    try {
      const { email, subscriberId, password } = req.body;

      // Validar que los campos existan
      if (!email || !subscriberId || !password) {
        await auditLoginAttempt({
          email: email || 'unknown',
          subscriberId: subscriberId || 'unknown',
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'Campos incompletos'
        });
        
        return res.status(400).json({
          message: "Email, ID de suscriptor y contraseña son requeridos",
        });
      }

      // 1. RATE LIMITING - Verificar si la IP está bloqueada
      const rateLimitCheck = checkRateLimit(clientIP);
      if (!rateLimitCheck.allowed) {
        await auditLoginAttempt({
          email,
          subscriberId,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'Rate limit excedido'
        });

        const minutesRemaining = Math.ceil(
          (rateLimitCheck.lockoutEndsAt!.getTime() - Date.now()) / 60000
        );
        
        return res.status(429).json({
          message: `Demasiados intentos fallidos. Intenta de nuevo en ${minutesRemaining} minutos.`,
          lockoutEndsAt: rateLimitCheck.lockoutEndsAt
        });
      }

      // 2. VALIDACIÓN DE FORMATO NIT
      if (!validateNIT(subscriberId)) {
        recordLoginAttempt(clientIP, false);
        await auditLoginAttempt({
          email,
          subscriberId,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'NIT inválido'
        });

        return res.status(400).json({
          message: "El formato del NIT es inválido. Debe tener 9-10 dígitos.",
        });
      }

      // Normalizar NIT para búsqueda
      const normalizedNIT = normalizeNIT(subscriberId);

      // Buscar usuario por email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        recordLoginAttempt(clientIP, false);
        await auditLoginAttempt({
          email,
          subscriberId: normalizedNIT,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'Usuario no encontrado'
        });

        return res.status(401).json({
          message: "Credenciales inválidas",
        });
      }

      const userData = user[0];

      // Validar subscriber ID (NIT normalizado)
      const userNIT = normalizeNIT(userData.subscriberId || '');
      if (userNIT !== normalizedNIT) {
        recordLoginAttempt(clientIP, false);
        await auditLoginAttempt({
          email,
          subscriberId: normalizedNIT,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'NIT incorrecto'
        });

        return res.status(401).json({
          message: "Credenciales inválidas",
        });
      }

      // Validar contraseña
      if (!userData.passwordHash) {
        recordLoginAttempt(clientIP, false);
        await auditLoginAttempt({
          email,
          subscriberId: normalizedNIT,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'Usuario sin contraseña configurada'
        });

        return res.status(401).json({
          message: "Credenciales inválidas",
        });
      }

      const passwordMatch = verifyPassword(password, userData.passwordHash);
      if (!passwordMatch) {
        recordLoginAttempt(clientIP, false);
        await auditLoginAttempt({
          email,
          subscriberId: normalizedNIT,
          ipAddress: clientIP,
          userAgent,
          success: false,
          failureReason: 'Contraseña incorrecta'
        });

        return res.status(401).json({
          message: "Credenciales inválidas",
        });
      }

      // 3. LOGIN EXITOSO
      recordLoginAttempt(clientIP, true); // Limpiar rate limit
      
      // Guardar usuario en sesión
      (req.session as any).userId = userData.id;
      (req.session as any).user = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        subscriberId: userData.subscriberId,
      };

      // Auditar login exitoso
      await auditLoginAttempt({
        email,
        subscriberId: normalizedNIT,
        ipAddress: clientIP,
        userAgent,
        success: true
      });

      // Guardar sesión
      req.session.save(() => {
        res.json({
          success: true,
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      
      await auditLoginAttempt({
        email: req.body.email || 'unknown',
        subscriberId: req.body.subscriberId || 'unknown',
        ipAddress: clientIP,
        userAgent,
        success: false,
        failureReason: 'Error del servidor'
      });

      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

  // Get current user - GET /api/auth/user
  app.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.session || !(req.session as any).userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const userId = (req.session as any).userId;
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      res.json({
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });

  // Logout - POST /api/auth/logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Sesión cerrada" });
    });
  });

  // Auditoría - GET /api/auth/audit-logs (solo para admins)
  app.get("/api/auth/audit-logs", isAuthenticated, async (req, res) => {
    try {
      const { loginAttempts } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      
      // Obtener los últimos 100 intentos de login
      const logs = await db
        .select()
        .from(loginAttempts)
        .orderBy(desc(loginAttempts.attemptedAt))
        .limit(100);

      res.json(logs);
    } catch (error) {
      console.error("Error al obtener logs:", error);
      res.status(500).json({ message: "Error al obtener logs de auditoría" });
    }
  });
}

// Middleware para proteger rutas
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session || !(req.session as any).userId) {
    return res.status(401).json({ message: "No autenticado" });
  }
  next();
};
