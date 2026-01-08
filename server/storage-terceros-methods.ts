// Métodos mejorados para gestión de Terceros
// Agregar estos métodos a server/storage.ts

import { terceros, type InsertTercero, type Tercero } from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or } from "drizzle-orm";

/**
 * Obtener terceros con filtros opcionales
 * @param tenantId - ID del tenant
 * @param filters - Filtros opcionales (estado, tipoPersona, tipoRegimen)
 */
export async function getTercerosFiltrados(
  tenantId: number,
  filters?: {
    estado?: 'activo' | 'inactivo' | 'suspendido';
    tipoPersona?: 'persona_natural' | 'persona_juridica';
    tipoRegimen?: string;
  }
): Promise<Tercero[]> {
  let query = db
    .select()
    .from(terceros)
    .where(eq(terceros.tenantId, tenantId));

  if (filters?.estado) {
    query = query.where(eq(terceros.estado, filters.estado));
  }
  if (filters?.tipoPersona) {
    query = query.where(eq(terceros.tipoPersona, filters.tipoPersona));
  }
  if (filters?.tipoRegimen) {
    query = query.where(eq(terceros.tipoRegimen, filters.tipoRegimen));
  }

  return query;
}

/**
 * Buscar terceros por identificación, nombre o email
 * Búsqueda flexible que incluye múltiples campos
 */
export async function searchTerceros(
  tenantId: number,
  query: string
): Promise<Tercero[]> {
  const searchTerm = `%${query}%`;
  
  return db
    .select()
    .from(terceros)
    .where(
      and(
        eq(terceros.tenantId, tenantId),
        or(
          like(terceros.identificacion, searchTerm),
          like(terceros.nombreCompleto, searchTerm),
          like(terceros.email, searchTerm),
          like(terceros.razonSocial, searchTerm)
        )
      )
    );
}

/**
 * Buscar tercero por email dentro de un tenant
 * Previene duplicados de email
 */
export async function findTerceroByEmail(
  tenantId: number,
  email: string
): Promise<Tercero | undefined> {
  const result = await db
    .select()
    .from(terceros)
    .where(
      and(
        eq(terceros.tenantId, tenantId),
        eq(terceros.email, email)
      )
    )
    .limit(1);

  return result[0];
}

/**
 * Buscar tercero por identificación dentro de un tenant
 * Previene duplicados de identificación
 */
export async function findTerceroByIdentificacion(
  tenantId: number,
  identificacion: string
): Promise<Tercero | undefined> {
  const result = await db
    .select()
    .from(terceros)
    .where(
      and(
        eq(terceros.tenantId, tenantId),
        eq(terceros.identificacion, identificacion)
      )
    )
    .limit(1);

  return result[0];
}

/**
 * Validar formato del dígito de verificación para NIT (Algoritmo Luhn)
 * @param nit - Número de NIT (sin DV)
 * @param dv - Dígito de verificación proporcionado
 * @returns boolean - true si es válido
 */
export function validateDVNIT(nit: string, dv: string): boolean {
  const sequence = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  
  const digits = nit.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * sequence[digits.length - 1 - i];
  }
  
  const remainder = sum % 11;
  const calculatedDV = remainder === 0 ? '0' : remainder === 1 ? '9' : String(11 - remainder);
  
  return calculatedDV === dv;
}

/**
 * Obtener estadísticas de terceros por tenant
 */
export async function getTercerosStats(tenantId: number) {
  // Este es un ejemplo básico - puede expandirse
  const allTerceros = await db
    .select()
    .from(terceros)
    .where(eq(terceros.tenantId, tenantId));

  return {
    total: allTerceros.length,
    activos: allTerceros.filter(t => t.estado === 'activo').length,
    inactivos: allTerceros.filter(t => t.estado === 'inactivo').length,
    suspendidos: allTerceros.filter(t => t.estado === 'suspendido').length,
    personasNaturales: allTerceros.filter(t => t.tipoPersona === 'persona_natural').length,
    personasJuridicas: allTerceros.filter(t => t.tipoPersona === 'persona_juridica').length,
    autorretenedores: allTerceros.filter(t => t.esAutorretenedor).length,
    conRetefuente: allTerceros.filter(t => t.retefuente).length,
  };
}

/**
 * Actualizar tercero (método mejorado)
 */
export async function updateTercero(
  id: number,
  data: Partial<InsertTercero>
): Promise<Tercero | undefined> {
  const result = await db
    .update(terceros)
    .set({
      ...data,
      fechaActualizacion: new Date(),
    })
    .where(eq(terceros.id, id));

  if (result.rowsAffected === 0) return undefined;

  const updated = await db
    .select()
    .from(terceros)
    .where(eq(terceros.id, id))
    .limit(1);

  return updated[0];
}

/**
 * Cambiar estado de tercero (activo -> inactivo, etc.)
 */
export async function changeTerceroStatus(
  id: number,
  nuevoEstado: 'activo' | 'inactivo' | 'suspendido'
): Promise<boolean> {
  const result = await db
    .update(terceros)
    .set({
      estado: nuevoEstado,
      fechaActualizacion: new Date(),
    })
    .where(eq(terceros.id, id));

  return result.rowsAffected > 0;
}

/**
 * Obtener tercero por ID con validación de tenant
 */
export async function getTerceroById(
  id: number,
  tenantId: number
): Promise<Tercero | undefined> {
  const result = await db
    .select()
    .from(terceros)
    .where(
      and(
        eq(terceros.id, id),
        eq(terceros.tenantId, tenantId)
      )
    )
    .limit(1);

  return result[0];
}

/**
 * Exportar terceros a formato (para reportes)
 */
export async function exportarTerceros(tenantId: number): Promise<Tercero[]> {
  return db
    .select()
    .from(terceros)
    .where(eq(terceros.tenantId, tenantId))
    .orderBy(terceros.nombreCompleto);
}
