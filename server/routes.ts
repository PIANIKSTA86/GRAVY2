import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuthRoutes, isAuthenticated } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Setup
  setupAuthRoutes(app);

  // Tenants
  app.get(api.tenants.list.path, isAuthenticated, async (req: any, res) => {
    const userId = (req.session as any).userId;
    const items = await storage.getTenants(userId);
    res.json(items);
  });

  app.post(api.tenants.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
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

  app.get(api.tenants.get.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de tenant inválido" });
    }
    const item = await storage.getTenant(id);
    if (!item) return res.status(404).json({ message: "Tenant no encontrado" });
    res.json(item);
  });

  app.get(api.tenants.listByOwner.path, isAuthenticated, async (req: any, res) => {
    const userId = (req.session as any).userId;
    const items = await storage.getTenantsForUser(userId);
    res.json(items);
  });

  // Terceros
  app.get(api.terceros.list.path, isAuthenticated, async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getTerceros(tenantId);
    res.json(items);
  });

  app.post(api.terceros.create.path, isAuthenticated, async (req, res) => {
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
  app.get(api.planCuentas.list.path, isAuthenticated, async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getPlanCuentas(tenantId);
    res.json(items);
  });

  app.post(api.planCuentas.create.path, isAuthenticated, async (req, res) => {
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
  app.get(api.asientos.list.path, isAuthenticated, async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getAsientos(tenantId);
    res.json(items);
  });

  app.post(api.asientos.create.path, isAuthenticated, async (req, res) => {
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
  app.get(api.niif.politicas.list.path, isAuthenticated, async (req, res) => {
    const tenantId = Number(req.params.tenantId);
    const items = await storage.getNiifPoliticas(tenantId);
    res.json(items);
  });

  app.post(api.niif.politicas.create.path, isAuthenticated, async (req, res) => {
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

  // Catálogos Geográficos (públicos - no requieren autenticación)
  app.get(api.catalogos.paises.path, async (_req, res) => {
    const items = await storage.getPaises();
    res.json(items);
  });

  app.get(api.catalogos.departamentos.path, async (req, res) => {
    const paisCodigo = req.query.pais as string | undefined;
    const items = await storage.getDepartamentos(paisCodigo);
    res.json(items);
  });

  app.get(api.catalogos.municipios.path, async (req, res) => {
    const departamentoCodigo = req.query.departamento as string | undefined;
    const items = await storage.getMunicipios(departamentoCodigo);
    res.json(items);
  });

  // Nota: Los datos de seed ahora se cargan con el script: npm run db:seed
  // Ya no se cargan automáticamente al iniciar el servidor

  return httpServer;
}
