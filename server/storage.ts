import { db } from "./db";
import { 
  tenants, planCuentas, terceros, centrosCosto, periodosContables, asientos, lineasAsiento, niifPoliticas, tenantUsers,
  type InsertTenant, type InsertPlanCuenta, type InsertTercero, type CreateAsientoCompleto, type InsertNiifPolitica,
  type Tenant, type PlanCuenta, type Tercero, type Asiento, type LineaAsiento, type NiifPolitica
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Tenants
  getTenants(userId?: string): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;

  // Terceros
  getTerceros(tenantId: number): Promise<Tercero[]>;
  createTercero(tercero: InsertTercero): Promise<Tercero>;

  // Plan Cuentas
  getPlanCuentas(tenantId: number): Promise<PlanCuenta[]>;
  createPlanCuenta(cuenta: InsertPlanCuenta): Promise<PlanCuenta>;

  // Asientos
  getAsientos(tenantId: number): Promise<Asiento[]>;
  createAsiento(asientoCompleto: CreateAsientoCompleto): Promise<Asiento>;

  // NIIF
  getNiifPoliticas(tenantId: number): Promise<NiifPolitica[]>;
  createNiifPolitica(politica: InsertNiifPolitica): Promise<NiifPolitica>;

  // User-Tenant Associations
  getTenantsForUser(userId: string): Promise<Tenant[]>;
  associateUserToTenant(tenantId: number, userId: string, role: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTenantsForUser(userId: string): Promise<Tenant[]> {
    const results = await db
      .select({
        tenant: tenants
      })
      .from(tenantUsers)
      .innerJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .where(eq(tenantUsers.userId, userId));
    
    return results.map(r => r.tenant);
  }

  async associateUserToTenant(tenantId: number, userId: string, role: string): Promise<void> {
    await db.insert(tenantUsers).values({
      tenantId,
      userId,
      role
    });
  }

  async getTenants(userId?: string): Promise<Tenant[]> {
    if (userId) {
      // Return tenants where the user is an owner or has an association
      const owned = await db.select().from(tenants).where(eq(tenants.ownerId, userId));
      const associated = await this.getTenantsForUser(userId);
      
      // Merge and remove duplicates by ID
      const all = [...owned, ...associated];
      const seen = new Set();
      return all.filter(t => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
    }
    return await db.select().from(tenants);
  }

  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async getTerceros(tenantId: number): Promise<Tercero[]> {
    return await db.select().from(terceros).where(eq(terceros.tenantId, tenantId));
  }

  async createTercero(tercero: InsertTercero): Promise<Tercero> {
    const [newTercero] = await db.insert(terceros).values(tercero).returning();
    return newTercero;
  }

  async getPlanCuentas(tenantId: number): Promise<PlanCuenta[]> {
    return await db.select().from(planCuentas).where(eq(planCuentas.tenantId, tenantId));
  }

  async createPlanCuenta(cuenta: InsertPlanCuenta): Promise<PlanCuenta> {
    const [newCuenta] = await db.insert(planCuentas).values(cuenta).returning();
    return newCuenta;
  }

  async getAsientos(tenantId: number): Promise<Asiento[]> {
    return await db.select().from(asientos).where(eq(asientos.tenantId, tenantId));
  }

  async createAsiento(asientoCompleto: CreateAsientoCompleto): Promise<Asiento> {
    return await db.transaction(async (tx) => {
      // 1. Insert header
      const { lineas, ...headerData } = asientoCompleto;
      const [newAsiento] = await tx.insert(asientos).values(headerData).returning();

      // 2. Insert lines
      if (lineas && lineas.length > 0) {
        const lineasWithIds = lineas.map(linea => ({
          ...linea,
          asientoId: newAsiento.id,
          tenantId: headerData.tenantId,
        }));
        await tx.insert(lineasAsiento).values(lineasWithIds);
      }

      return newAsiento;
    });
  }

  async getNiifPoliticas(tenantId: number): Promise<NiifPolitica[]> {
    return await db.select().from(niifPoliticas).where(eq(niifPoliticas.tenantId, tenantId));
  }

  async createNiifPolitica(politica: InsertNiifPolitica): Promise<NiifPolitica> {
    const [newPolitica] = await db.insert(niifPoliticas).values(politica).returning();
    return newPolitica;
  }
}

export const storage = new DatabaseStorage();
