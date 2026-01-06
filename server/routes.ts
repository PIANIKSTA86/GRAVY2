import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Tenants
  app.get(api.tenants.list.path, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const items = await storage.getTenants(userId);
    res.json(items);
  });

  app.post(api.tenants.create.path, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const input = api.tenants.create.input.parse(req.body);
      const item = await storage.createTenant({ ...input, ownerId: userId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.get(api.tenants.get.path, async (req, res) => {
    const item = await storage.getTenant(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Tenant no encontrado" });
    res.json(item);
  });

  app.get(api.tenants.listByOwner.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const items = await storage.getTenantsForUser(userId);
    res.json(items);
  });

  // Terceros
  app.get(api.terceros.list.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getTerceros(tenantId);
    res.json(items);
  });

  app.post(api.terceros.create.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    try {
      const tenantId = Number(req.params.tenantId);
      const input = api.terceros.create.input.parse(req.body);
      const item = await storage.createTercero({ ...input, tenantId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Plan Cuentas
  app.get(api.planCuentas.list.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getPlanCuentas(tenantId);
    res.json(items);
  });

  app.post(api.planCuentas.create.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    try {
      const tenantId = Number(req.params.tenantId);
      const input = api.planCuentas.create.input.parse(req.body);
      const item = await storage.createPlanCuenta({ ...input, tenantId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Asientos
  app.get(api.asientos.list.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getAsientos(tenantId);
    res.json(items);
  });

  app.post(api.asientos.create.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    try {
      const tenantId = Number(req.params.tenantId);
      const input = api.asientos.create.input.parse(req.body);
      const item = await storage.createAsiento({ ...input, tenantId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // NIIF Políticas
  app.get(api.niif.politicas.list.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getNiifPoliticas(tenantId);
    res.json(items);
  });

  app.post(api.niif.politicas.create.path.replace(':tenantId', ':tenantId'), async (req, res) => {
    try {
      const tenantId = Number(req.params.tenantId);
      const input = api.niif.politicas.create.input.parse(req.body);
      const item = await storage.createNiifPolitica({ ...input, tenantId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Seed Data (if empty)
  const existingTenants = await storage.getTenants();
  if (existingTenants.length === 0) {
    const tenant = await storage.createTenant({
      nombre: "Empresa Demo S.A.S.",
      tipoEmpresa: "S.A.S.",
      grupoNiif: "2",
      monedaFuncional: "COP",
      responsableContable: "Juan Perez",
    });

    // Asociar usuario demo si existe (o simplemente crear la relación para futuros usuarios)
    // En un entorno real, esto se haría tras la creación del primer usuario o registro.
  }
      tenantId: tenant.id,
      codigo: "1105",
      nombre: "Caja",
      nivel: 4,
      naturaleza: "D",
      permiteTercero: false,
      permiteCentroCosto: false
    });

    await storage.createPlanCuenta({
      tenantId: tenant.id,
      codigo: "1110",
      nombre: "Bancos",
      nivel: 4,
      naturaleza: "D",
      permiteTercero: false,
      permiteCentroCosto: false
    });
    
    await storage.createTercero({
      tenantId: tenant.id,
      identificacion: "900123456",
      nombre: "Proveedor Ejemplo Ltda",
      tipo: "Proveedor",
      parteRelacionada: false
    });
  }

  return httpServer;
}
