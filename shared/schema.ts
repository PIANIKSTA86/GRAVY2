import { pgTable, text, serial, integer, boolean, timestamp, numeric, date, index, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";

// 1. Tenants (Empresas)
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  tipoEmpresa: text("tipo_empresa").notNull(), // S.A.S, Ltda, etc.
  grupoNiif: text("grupo_niif").notNull(), // 1, 2, 3
  monedaFuncional: text("moneda_funcional").default("COP").notNull(),
  responsableContable: text("responsable_contable"),
  ownerId: varchar("owner_id").references(() => users.id), // Usuario que creó la empresa
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

// Tabla para asociar usuarios a empresas (Suscripciones/Acceso)
export const tenantUsers = pgTable("tenant_users", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("viewer").notNull(), // admin, editor, viewer
  fechaAsociacion: timestamp("fecha_asociacion").defaultNow(),
}, (table) => ({
  tenantUserIdx: index("idx_tenant_user").on(table.tenantId, table.userId),
}));

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  planCuentas: many(planCuentas),
  terceros: many(terceros),
  asientos: many(asientos),
  usuarios: many(tenantUsers),
  owner: one(users, {
    fields: [tenants.ownerId],
    references: [users.id],
  }),
}));

export const tenantUsersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantUsers.userId],
    references: [users.id],
  }),
}));

// 2. Plan de Cuentas
export const planCuentas = pgTable("plan_cuentas", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  codigo: text("codigo").notNull(),
  nombre: text("nombre").notNull(),
  nivel: integer("nivel").notNull(),
  padreId: integer("padre_id"), // Auto-referencia
  naturaleza: text("naturaleza").notNull(), // 'D' o 'C'
  permiteTercero: boolean("permite_tercero").default(false),
  permiteCentroCosto: boolean("permite_centro_costo").default(false),
  // Campos NIIF futuros
  categoriaNiif: text("categoria_niif"),
  metodoMedicion: text("metodo_medicion"),
  requiereDeterioro: boolean("requiere_deterioro").default(false),
}, (table) => ({
  tenantIdx: index("idx_plan_cuentas_tenant").on(table.tenantId),
  codigoIdx: index("idx_plan_cuentas_codigo").on(table.codigo),
}));

export const planCuentasRelations = relations(planCuentas, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [planCuentas.tenantId],
    references: [tenants.id],
  }),
  padre: one(planCuentas, {
    fields: [planCuentas.padreId],
    references: [planCuentas.id],
    relationName: "padreHijo",
  }),
  hijos: many(planCuentas, {
    relationName: "padreHijo",
  }),
}));

// 3. Terceros
export const terceros = pgTable("terceros", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  identificacion: text("identificacion").notNull(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull(), // Cliente, Proveedor, Empleado, Otro
  // NIIF
  vinculoEconomico: text("vinculo_economico"),
  parteRelacionada: boolean("parte_relacionada").default(false),
}, (table) => ({
  tenantIdx: index("idx_terceros_tenant").on(table.tenantId),
}));

// 4. Centros de Costo
export const centrosCosto = pgTable("centros_costo", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  codigo: text("codigo").notNull(),
  nombre: text("nombre").notNull(),
  categoriaDistribucion: text("categoria_distribucion"),
}, (table) => ({
  tenantIdx: index("idx_cc_tenant").on(table.tenantId),
}));

// 5. Periodos Contables
export const periodosContables = pgTable("periodos_contables", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  cerrado: boolean("cerrado").default(false),
  cierreNiifRealizado: boolean("cierre_niif_realizado").default(false),
}, (table) => ({
  tenantIdx: index("idx_periodos_tenant").on(table.tenantId),
}));

// 6. Asientos (Cabecera)
export const asientos = pgTable("asientos", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  fecha: date("fecha").notNull(),
  tipoComprobante: text("tipo_comprobante").notNull(), // Ingreso, Egreso, Diario, etc.
  numero: text("numero").notNull(),
  descripcion: text("descripcion").notNull(),
  terceroId: integer("tercero_id").references(() => terceros.id),
  periodoId: integer("periodo_id").references(() => periodosContables.id),
  estado: text("estado").default("Borrador").notNull(), // Borrador, Aprobado, Anulado
  // NIIF
  eventoNiif: text("evento_niif"),
  moduloOrigen: text("modulo_origen").default("CONTABILIDAD"),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  usuarioCreacion: text("usuario_creacion"),
}, (table) => ({
  tenantIdx: index("idx_asientos_tenant").on(table.tenantId),
  fechaIdx: index("idx_asientos_fecha").on(table.fecha),
}));

// 7. Líneas de Asiento (Detalle)
export const lineasAsiento = pgTable("lineas_asiento", {
  id: serial("id").primaryKey(),
  asientoId: integer("asiento_id").references(() => asientos.id).notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  cuentaId: integer("cuenta_id").references(() => planCuentas.id).notNull(),
  debito: numeric("debito", { precision: 15, scale: 2 }).default("0").notNull(),
  credito: numeric("credito", { precision: 15, scale: 2 }).default("0").notNull(),
  centroCostoId: integer("centro_costo_id").references(() => centrosCosto.id),
  terceroId: integer("tercero_id").references(() => terceros.id),
  referenciaDoc: text("referencia_doc"),
  detalle: text("detalle"),
  // Inventario (futuro)
  productoId: integer("producto_id"), // Opcional por ahora
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }),
  costoUnitario: numeric("costo_unitario", { precision: 15, scale: 2 }),
}, (table) => ({
  asientoIdx: index("idx_lineas_asiento").on(table.asientoId),
  tenantCuentaIdx: index("idx_lineas_tenant_cuenta").on(table.tenantId, table.cuentaId),
}));

export const lineasAsientoRelations = relations(lineasAsiento, ({ one }) => ({
  asiento: one(asientos, {
    fields: [lineasAsiento.asientoId],
    references: [asientos.id],
  }),
  cuenta: one(planCuentas, {
    fields: [lineasAsiento.cuentaId],
    references: [planCuentas.id],
  }),
  tercero: one(terceros, {
    fields: [lineasAsiento.terceroId],
    references: [terceros.id],
  }),
  centroCosto: one(centrosCosto, {
    fields: [lineasAsiento.centroCostoId],
    references: [centrosCosto.id],
  }),
}));

export const asientosRelations = relations(asientos, ({ many, one }) => ({
  lineas: many(lineasAsiento),
  tercero: one(terceros, {
    fields: [asientos.terceroId],
    references: [terceros.id],
  }),
}));

// 8. Políticas NIIF
export const niifPoliticas = pgTable("niif_politicas", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  modulo: text("modulo").notNull(), // Activos Fijos, Inventarios, CxC
  metodoMedicion: text("metodo_medicion").notNull(),
  cuentasAsociadas: text("cuentas_asociadas"), // JSON o lista separada por comas
});

// Esquemas de inserción
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, fechaCreacion: true });
export const insertPlanCuentasSchema = createInsertSchema(planCuentas).omit({ id: true });
export const insertTerceroSchema = createInsertSchema(terceros).omit({ id: true });
export const insertCentroCostoSchema = createInsertSchema(centrosCosto).omit({ id: true });
export const insertPeriodoContableSchema = createInsertSchema(periodosContables).omit({ id: true });
export const insertAsientoSchema = createInsertSchema(asientos).omit({ id: true, fechaCreacion: true });
export const insertLineaAsientoSchema = createInsertSchema(lineasAsiento).omit({ id: true });
export const insertNiifPoliticaSchema = createInsertSchema(niifPoliticas).omit({ id: true });

// Tipos exportados
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type PlanCuenta = typeof planCuentas.$inferSelect;
export type InsertPlanCuenta = z.infer<typeof insertPlanCuentasSchema>;

export type Tercero = typeof terceros.$inferSelect;
export type InsertTercero = z.infer<typeof insertTerceroSchema>;

export type CentroCosto = typeof centrosCosto.$inferSelect;
export type InsertCentroCosto = z.infer<typeof insertCentroCostoSchema>;

export type PeriodoContable = typeof periodosContables.$inferSelect;
export type InsertPeriodoContable = z.infer<typeof insertPeriodoContableSchema>;

export type Asiento = typeof asientos.$inferSelect;
export type InsertAsiento = z.infer<typeof insertAsientoSchema>;

export type LineaAsiento = typeof lineasAsiento.$inferSelect;
export type InsertLineaAsiento = z.infer<typeof insertLineaAsientoSchema>;

export type NiifPolitica = typeof niifPoliticas.$inferSelect;
export type InsertNiifPolitica = z.infer<typeof insertNiifPoliticaSchema>;

// Tipo compuesto para crear asiento con líneas
export const createAsientoCompletoSchema = insertAsientoSchema.extend({
  lineas: z.array(insertLineaAsientoSchema.omit({ asientoId: true, tenantId: true })),
});

export type CreateAsientoCompleto = z.infer<typeof createAsientoCompletoSchema>;
