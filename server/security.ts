import { db } from "./db";
import { loginAttempts } from "@shared/schema";

// Rate Limiting en memoria (simple Map)
// En producción, considera usar Redis
const loginAttemptStore = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos

/**
 * Validación de formato NIT colombiano
 * Formato: 123456789-0 (9 dígitos + dígito de verificación)
 */
export function validateNIT(nit: string): boolean {
  // Remover espacios y guiones
  const cleanNIT = nit.replace(/[\s-]/g, '');
  
  // Debe tener entre 9 y 10 dígitos (algunos NITs tienen 10)
  if (!/^\d{9,10}$/.test(cleanNIT)) {
    return false;
  }

  // Validar dígito de verificación si tiene 10 dígitos
  if (cleanNIT.length === 10) {
    const nitNumber = cleanNIT.substring(0, 9);
    const verificationDigit = parseInt(cleanNIT.charAt(9));
    const calculatedDigit = calculateNITVerificationDigit(nitNumber);
    return calculatedDigit === verificationDigit;
  }

  return true; // Si tiene 9 dígitos, es válido (sin verificación)
}

/**
 * Calcula el dígito de verificación del NIT
 */
function calculateNITVerificationDigit(nit: string): number {
  const weights = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
  const nitDigits = nit.split('').reverse();
  
  let sum = 0;
  for (let i = 0; i < nitDigits.length; i++) {
    sum += parseInt(nitDigits[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  
  if (remainder === 0 || remainder === 1) {
    return remainder;
  }
  
  return 11 - remainder;
}

/**
 * Normaliza el NIT para almacenamiento (sin guiones ni espacios)
 */
export function normalizeNIT(nit: string): string {
  return nit.replace(/[\s-]/g, '');
}

/**
 * Rate Limiting: Verifica si una IP está bloqueada
 */
export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; lockoutEndsAt?: Date } {
  const key = `ip:${ip}`;
  const record = loginAttemptStore.get(key);
  
  if (!record) {
    return { allowed: true };
  }

  const now = Date.now();
  const timeSinceLastAttempt = now - record.lastAttempt;

  // Si pasaron más de 15 minutos, resetear
  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttemptStore.delete(key);
    return { allowed: true };
  }

  // Si tiene menos de MAX_ATTEMPTS, permitir
  if (record.attempts < MAX_ATTEMPTS) {
    return { 
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - record.attempts
    };
  }

  // Bloqueado
  const lockoutEndsAt = new Date(record.lastAttempt + LOCKOUT_DURATION);
  return { 
    allowed: false, 
    lockoutEndsAt 
  };
}

/**
 * Rate Limiting: Registra un intento de login
 */
export function recordLoginAttempt(ip: string, success: boolean): void {
  const key = `ip:${ip}`;
  const record = loginAttemptStore.get(key);
  
  if (success) {
    // Si fue exitoso, limpiar el contador
    loginAttemptStore.delete(key);
    return;
  }

  // Incrementar intentos fallidos
  if (!record) {
    loginAttemptStore.set(key, {
      attempts: 1,
      lastAttempt: Date.now()
    });
  } else {
    record.attempts += 1;
    record.lastAttempt = Date.now();
  }
}

/**
 * Auditoría: Registra un intento de login en la BD
 */
export async function auditLoginAttempt(params: {
  email: string;
  subscriberId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}): Promise<void> {
  try {
    await db.insert(loginAttempts).values({
      email: params.email,
      subscriberId: params.subscriberId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      success: params.success,
      failureReason: params.failureReason || null,
    });
  } catch (error) {
    console.error("Error al registrar auditoría de login:", error);
    // No lanzar error para no interrumpir el flujo de login
  }
}

/**
 * Obtiene la IP real del cliente (considerando proxies)
 */
export function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
