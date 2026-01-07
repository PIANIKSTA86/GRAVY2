import { mysqlTable, text, int, boolean, timestamp, decimal, date, index, varchar, bigint } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// (IMPORTANT) Mandatory for Replit Auth
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: text("sess").notNull(),
    expire: bigint("expire", { mode: "number" }).notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// (IMPORTANT) Mandatory for Replit Auth
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// 1. Tenants (Empresas)
export const tenants = mysqlTable("tenants", {
  id: int("id").autoincrement().primaryKey(),
  nombre: text("nombre").notNull(),
  tipoEmpresa: text("tipo_empresa").notNull(),
  grupoNiif: text("grupo_niif").notNull(),
  monedaFuncional: text("moneda_funcional").default("COP").notNull(),
  responsableContable: text("responsable_contable"),
  ownerId: varchar("owner_id", { length: 255 }).references(() => users.id),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

// Tabla para asociar usuarios a empresas
export const tenantUsers = mysqlTable(
  "tenant_users",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
    role: text("role").default("viewer").notNull(),
    fechaAsociacion: timestamp("fecha_asociacion").defaultNow(),
  },
  (table) => ({
    tenantUserIdx: index("idx_tenant_user").on(table.tenantId, table.userId),
  }),
);

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
export const planCuentas = mysqlTable(
  "plan_cuentas",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    codigo: text("codigo").notNull(),
    nombre: text("nombre").notNull(),
    nivel: int("nivel").notNull(),
    padreId: int("padre_id"),
    naturaleza: text("naturaleza").notNull(),
    permiteTercero: boolean("permite_tercero").default(false),
    permiteCentroCosto: boolean("permite_centro_costo").default(false),
    categoriaNiif: text("categoria_niif"),
    metodoMedicion: text("metodo_medicion"),
    requiereDeterioro: boolean("requiere_deterioro").default(false),
  },
  (table) => ({
    tenantIdx: index("idx_plan_cuentas_tenant").on(table.tenantId),
    codigoIdx: index("idx_plan_cuentas_codigo").on(table.codigo),
  }),
);

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
export const terceros = mysqlTable(
  "terceros",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    identificacion: text("identificacion").notNull(),
    nombre: text("nombre").notNull(),
    tipo: text("tipo").notNull(),
    vinculoEconomico: text("vinculo_economico"),
    parteRelacionada: boolean("parte_relacionada").default(false),
  },
  (table) => ({
    tenantIdx: index("idx_terceros_tenant").on(table.tenantId),
  }),
);

// 4. Centros de Costo
export const centrosCosto = mysqlTable(
  "centros_costo",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    codigo: text("codigo").notNull(),
    nombre: text("nombre").notNull(),
    categoriaDistribucion: text("categoria_distribucion"),
  },
  (table) => ({
    tenantIdx: index("idx_cc_tenant").on(table.tenantId),
  }),
);

// 5. Periodos Contables
export const periodosContables = mysqlTable(
  "periodos_contables",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    fechaInicio: date("fecha_inicio").notNull(),
    fechaFin: date("fecha_fin").notNull(),
    cerrado: boolean("cerrado").default(false),
    cierreNiifRealizado: boolean("cierre_niif_realizado").default(false),
  },
  (table) => ({
    tenantIdx: index("idx_periodos_tenant").on(table.tenantId),
  }),
);

// 6. Asientos (Cabecera)
export const asientos = mysqlTable(
  "asientos",
  {
    id: int("id").autoincrement().primaryKey(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    fecha: date("fecha").notNull(),
    tipoComprobante: text("tipo_comprobante").notNull(),
    numero: text("numero").notNull(),
    descripcion: text("descripcion").notNull(),
    terceroId: int("tercero_id").references(() => terceros.id),
    periodoId: int("periodo_id").references(() => periodosContables.id),
    estado: text("estado").default("Borrador").notNull(),
    eventoNiif: text("evento_niif"),
    moduloOrigen: text("modulo_origen").default("CONTABILIDAD"),
    fechaCreacion: timestamp("fecha_creacion").defaultNow(),
    usuarioCreacion: text("usuario_creacion"),
  },
  (table) => ({
    tenantIdx: index("idx_asientos_tenant").on(table.tenantId),
    fechaIdx: index("idx_asientos_fecha").on(table.fecha),
  }),
);

// 7. Líneas de Asiento (Detalle)
export const lineasAsiento = mysqlTable(
  "lineas_asiento",
  {
    id: int("id").autoincrement().primaryKey(),
    asientoId: int("asiento_id").references(() => asientos.id).notNull(),
    tenantId: int("tenant_id").references(() => tenants.id).notNull(),
    cuentaId: int("cuenta_id").references(() => planCuentas.id).notNull(),
    debito: decimal("debito", { precision: 15, scale: 2 }).default("0").notNull(),
    credito: decimal("credito", { precision: 15, scale: 2 }).default("0").notNull(),
    centroCostoId: int("centro_costo_id").references(() => centrosCosto.id),
    terceroId: int("tercero_id").references(() => terceros.id),
    referenciaDoc: text("referencia_doc"),
    detalle: text("detalle"),
    productoId: int("producto_id"),
    cantidad: decimal("cantidad", { precision: 10, scale: 2 }),
    costoUnitario: decimal("costo_unitario", { precision: 15, scale: 2 }),
  },
  (table) => ({
    asientoIdx: index("idx_lineas_asiento").on(table.asientoId),
    tenantCuentaIdx: index("idx_lineas_tenant_cuenta").on(table.tenantId, table.cuentaId),
  }),
);

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
export const niifPoliticas = mysqlTable("niif_politicas", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenant_id").references(() => tenants.id).notNull(),
  modulo: text("modulo").notNull(),
  metodoMedicion: text("metodo_medicion").notNull(),
  cuentasAsociadas: text("cuentas_asociadas"),
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
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export const createAsientoCompletoSchema = insertAsientoSchema.extend({
  lineas: z.array(insertLineaAsientoSchema.omit({ asientoId: true, tenantId: true })),
});

export type CreateAsientoCompleto = z.infer<typeof createAsientoCompletoSchema>;
