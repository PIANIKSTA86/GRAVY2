import { db } from "./db";
import { 
  tenants, planCuentas, terceros, centrosCosto, periodosContables, asientos, lineasAsiento, niifPoliticas, tenantUsers,
  paises, departamentos, municipios,
  type InsertTenant, type InsertPlanCuenta, type InsertTercero, type CreateAsientoCompleto, type InsertNiifPolitica,
  type Tenant, type PlanCuenta, type Tercero, type Asiento, type LineaAsiento, type NiifPolitica,
  type Pais, type Departamento, type Municipio
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
  updateTercero(id: number, tenantId: number, tercero: InsertTercero): Promise<Tercero>;
  deleteTercero(id: number, tenantId: number): Promise<void>;

  // Plan Cuentas
  getPlanCuentas(tenantId: number): Promise<PlanCuenta[]>;
  createPlanCuenta(cuenta: InsertPlanCuenta): Promise<PlanCuenta>;

  // Asientos
  getAsientos(tenantId: number): Promise<Asiento[]>;
  createAsiento(asientoCompleto: CreateAsientoCompleto): Promise<Asiento>;

  // NIIF
  getNiifPoliticas(tenantId: number): Promise<NiifPolitica[]>;
  createNiifPolitica(politica: InsertNiifPolitica): Promise<NiifPolitica>;

  // Catálogos Geográficos
  getPaises(): Promise<Pais[]>;
  getDepartamentos(paisCodigo?: string): Promise<Departamento[]>;
  getMunicipios(departamentoCodigo?: string): Promise<Municipio[]>;

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
    const result = await db.insert(tenants).values(tenant);
    const insertedId = Number((result as any).insertId);
    const [newTenant] = await db.select().from(tenants).where(eq(tenants.id, insertedId));
    if (!newTenant) throw new Error("Failed to create tenant");
    return newTenant;
  }

  async getTerceros(tenantId: number): Promise<Tercero[]> {
    return await db.select().from(terceros).where(eq(terceros.tenantId, tenantId));
  }

  async createTercero(tercero: InsertTercero): Promise<Tercero> {
    const result = await db.insert(terceros).values(tercero);
    const insertedId = Number((result as any).insertId);
    const [newTercero] = await db.select().from(terceros).where(eq(terceros.id, insertedId));
    if (!newTercero) throw new Error("Failed to create tercero");
    return newTercero;
  }

  async updateTercero(id: number, tenantId: number, terceroInput: InsertTercero): Promise<Tercero> {
    const [existing] = await db.select().from(terceros).where(and(eq(terceros.id, id), eq(terceros.tenantId, tenantId)));
    if (!existing) throw new Error("not_found");
    await db.update(terceros).set({ ...terceroInput }).where(and(eq(terceros.id, id), eq(terceros.tenantId, tenantId)));
    const [updated] = await db.select().from(terceros).where(and(eq(terceros.id, id), eq(terceros.tenantId, tenantId)));
    if (!updated) throw new Error("Failed to update tercero");
    return updated;
  }

  async deleteTercero(id: number, tenantId: number): Promise<void> {
    const [existing] = await db.select().from(terceros).where(and(eq(terceros.id, id), eq(terceros.tenantId, tenantId)));
    if (!existing) throw new Error("not_found");
    await db.delete(terceros).where(and(eq(terceros.id, id), eq(terceros.tenantId, tenantId)));
  }

  async getPlanCuentas(tenantId: number): Promise<PlanCuenta[]> {
    return await db.select().from(planCuentas).where(eq(planCuentas.tenantId, tenantId));
  }

  async createPlanCuenta(cuenta: InsertPlanCuenta): Promise<PlanCuenta> {
    const result = await db.insert(planCuentas).values(cuenta);
    const insertedId = Number((result as any).insertId);
    const [newCuenta] = await db.select().from(planCuentas).where(eq(planCuentas.id, insertedId));
    if (!newCuenta) throw new Error("Failed to create plan de cuentas entry");
    return newCuenta;
  }

  async getAsientos(tenantId: number): Promise<Asiento[]> {
    return await db.select().from(asientos).where(eq(asientos.tenantId, tenantId));
  }

  async createAsiento(asientoCompleto: CreateAsientoCompleto): Promise<Asiento> {
    return await db.transaction(async (tx) => {
      // 1. Insert header
      const { lineas, ...headerData } = asientoCompleto;
      const asientoResult = await tx.insert(asientos).values(headerData);
      const asientoId = Number((asientoResult as any).insertId);
      const [newAsiento] = await tx
        .select()
        .from(asientos)
        .where(eq(asientos.id, asientoId));
      if (!newAsiento) throw new Error("Failed to create asiento");

      // 2. Insert lines
      if (lineas && lineas.length > 0) {
        const lineasWithIds = lineas.map(linea => ({
          ...linea,
          asientoId,
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
    const result = await db.insert(niifPoliticas).values(politica);
    const insertedId = Number((result as any).insertId);
    const [newPolitica] = await db.select().from(niifPoliticas).where(eq(niifPoliticas.id, insertedId));
    if (!newPolitica) throw new Error("Failed to create NIIF policy");
    return newPolitica;
  }

  // Catálogos Geográficos
  async getPaises(): Promise<Pais[]> {
    return await db.select().from(paises).where(eq(paises.activo, true));
  }

  async getDepartamentos(paisCodigo?: string): Promise<Departamento[]> {
    if (paisCodigo) {
      return await db.select().from(departamentos)
        .where(eq(departamentos.paisCodigo, paisCodigo));
    }
    return await db.select().from(departamentos).where(eq(departamentos.activo, true));
  }

  async getMunicipios(departamentoCodigo?: string): Promise<Municipio[]> {
    if (departamentoCodigo) {
      return await db.select().from(municipios)
        .where(eq(municipios.departamentoCodigo, departamentoCodigo));
    }
    return await db.select().from(municipios).where(eq(municipios.activo, true));
  }
}

export const storage = new DatabaseStorage();
