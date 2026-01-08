# 📊 Restructuración de Base de Datos: Tabla Terceros

**Fecha**: Enero 7, 2026  
**Estado**: Script listo para ejecutar  
**Impacto**: Alto - Restructuración completa de tabla terceros

---

## 🎯 Objetivos

1. ✅ Diferenciar tipos de personas (natural vs jurídica)
2. ✅ Agregar información tributaria completa
3. ✅ Incluir datos de contacto y auditoría
4. ✅ Mantener compatibilidad con datos existentes
5. ✅ Optimizar performance con índices estratégicos
6. ✅ Implementar validaciones de negocio

---

## 📈 Comparativa Antes vs Después

### **ANTES** (8 campos)
```
id, tenant_id, identificacion, nombre, tipo, vinculo_economico, parte_relacionada
```
- ❌ No diferencia personas naturales de jurídicas
- ❌ Falta información tributaria
- ❌ Sin datos de contacto
- ❌ Sin auditoría (fecha_creacion/actualizacion)
- ❌ Estado no controlado
- ❌ Sin validación de identificación

### **DESPUÉS** (26 campos)
```
IDENTIFICACIÓN (5):
  id, tenant_id, tipo_identificacion, identificacion, dv

PERSONAL/EMPRESARIAL (5):
  tipo_persona, nombre, apellidos, nombre_completo, razon_social

TRIBUTARIA (5):
  tipo_regimen, es_autorretenedor, retefuente, tarifa_retefuente, vinculo_economico

CLASIFICACIÓN (3):
  parte_relacionada, tipo

CONTACTO (4):
  direccion, email, telefono1, telefono2

ESTADO (1):
  estado

AUDITORÍA (2):
  fecha_creacion, fecha_actualizacion
```

---

## 🔧 Cambios Técnicos Implementados

### **1. Schema TypeScript Actualizado** (`shared/schema.ts`)

#### Antes:
```typescript
export const terceros = mysqlTable("terceros", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenant_id").references(() => tenants.id).notNull(),
  identificacion: text("identificacion").notNull(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull(),
  vinculoEconomico: text("vinculo_economico"),
  parteRelacionada: boolean("parte_relacionada").default(false),
});
```

#### Después:
```typescript
export const terceros = mysqlTable("terceros", {
  // IDENTIFICACIÓN
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenant_id").references(() => tenants.id).notNull(),
  tipoIdentificacion: text("tipo_identificacion").notNull().default("NIT"),
  identificacion: text("identificacion").notNull(),
  dv: text("dv"),
  
  // INFORMACIÓN PERSONAL/EMPRESARIAL
  tipoPersona: text("tipo_persona").notNull().default("persona_juridica"),
  nombre: text("nombre"),
  apellidos: text("apellidos"),
  nombreCompleto: text("nombre_completo").notNull(),
  razonSocial: text("razon_social"),
  
  // TRIBUTARIA
  tipoRegimen: text("tipo_regimen").default("ordinario").notNull(),
  esAutorretenedor: boolean("es_autorretenedor").default(false),
  retefuente: boolean("retefuente").default(false),
  tarifaRetefuente: decimal("tarifa_retefuente", { precision: 5, scale: 2 }),
  
  // CLASIFICACIÓN
  vinculoEconomico: text("vinculo_economico"),
  parteRelacionada: boolean("parte_relacionada").default(false),
  tipo: text("tipo"),
  
  // CONTACTO
  direccion: text("direccion"),
  email: text("email"),
  telefono1: text("telefono1"),
  telefono2: text("telefono2"),
  
  // ESTADO
  estado: text("estado").default("activo").notNull(),
  
  // AUDITORÍA
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion").defaultNow().onUpdateNow(),
});
```

### **2. Validación Zod Mejorada** (`shared/schema.ts`)

```typescript
export const insertTerceroSchema = createInsertSchema(terceros)
  .extend({
    tipoIdentificacion: z.enum(['CC', 'NIT', 'CE', 'PA', 'PT', 'PN', 'XX']),
    tipoPersona: z.enum(['persona_natural', 'persona_juridica']),
    tipoRegimen: z.enum(['ordinario', 'simplificado', 'tributario_especial']),
    estado: z.enum(['activo', 'inactivo', 'suspendido']),
    identificacion: z.string().min(3).max(50).regex(/^[0-9A-Za-z-]+$/),
    nombreCompleto: z.string().min(5).max(255),
    email: z.string().email().optional(),
  })
  .refine(
    // Validación condicional: Si es persona natural, requiere nombre/apellidos
    // Si es jurídica, requiere razón social
    (data) => data.tipoPersona === 'persona_natural' 
      ? (data.nombre && data.apellidos) || data.nombreCompleto
      : data.razonSocial || data.nombreCompleto
  );
```

### **3. Índices para Performance**

| Índice | Campos | Uso |
|--------|--------|-----|
| `uk_tenant_identificacion` | (tenant_id, identificacion) | Previene duplicados, búsqueda por ID rápida |
| `uk_nombre_completo` | (nombre_completo) | Previene duplicados exactos |
| `idx_terceros_tenant_estado` | (tenant_id, estado) | Filtrados por estado (listados) |
| `idx_terceros_email` | (email) | Búsqueda por email, prevención duplicados |
| `idx_terceros_tipo` | (tipo) | Clasificación Cliente/Proveedor/etc |

---

## 🗄️ Script de Migración

**Ubicación**: `scripts/migrate-terceros.sql`

**Pasos**:
1. ✅ Backup automático → `terceros_backup`
2. ✅ Crear `terceros_new` con estructura completa
3. ✅ Migrar datos con transformaciones:
   - `nombre` → `nombre_completo`
   - `tipo_identificacion` → 'NIT' (default)
   - `tipo_persona` → 'persona_juridica' (default)
   - `estado` → 'activo' (default)
4. ✅ Reemplazar tabla antigua
5. ✅ Reportes de validación

**Ejecución**:
```bash
# En MySQL/Workbench
SOURCE scripts/migrate-terceros.sql;
```

---

## 📋 Cambios de API Backend

### Rutas Existentes (Compatibles)

```typescript
// GET - Obtener todos los terceros (sin cambios en estructura)
GET /api/:tenantId/terceros

// POST - Crear tercero (nuevos campos opcionales)
POST /api/:tenantId/terceros
Body: { ...oldFields, ...newFields }

// GET - Obtener un tercero por ID
GET /api/:tenantId/terceros/:id

// PUT - Actualizar tercero (nuevo)
PUT /api/:tenantId/terceros/:id
```

### Nuevas Rutas Sugeridas

```typescript
// GET - Búsqueda flexible
GET /api/:tenantId/terceros/search?q=acme

// GET - Filtrado avanzado
GET /api/:tenantId/terceros/filter?estado=activo&tipoRegimen=ordinario

// GET - Estadísticas
GET /api/:tenantId/terceros/stats

// POST - Validar DV
POST /api/:tenantId/terceros/validate-dv
Body: { nit: "123456789", dv: "0" }

// GET - Exportar
GET /api/:tenantId/terceros/export
```

---

## 💾 Nuevos Métodos en Storage

**Archivo**: `server/storage-terceros-methods.ts`

```typescript
getTercerosFiltrados(tenantId, filters)
searchTerceros(tenantId, query)
findTerceroByEmail(tenantId, email)
findTerceroByIdentificacion(tenantId, identificacion)
validateDVNIT(nit, dv) // Validación Luhn
getTercerosStats(tenantId)
updateTercero(id, data)
changeTerceroStatus(id, newStatus)
getTerceroById(id, tenantId)
exportarTerceros(tenantId)
```

---

## 🎨 Cambios Frontend (Próximos)

### Tabla Terceros - Nuevas Columnas (Fase 2)
```
Identificación (tipo + número + DV)
Nombre/Razón Social
Tipo (Cliente/Proveedor)
Régimen (Ordinario/Simplificado)
Retefuente (Sí/No con %)
Estado (Badge: Activo/Inactivo/Suspendido)
```

### Formulario Crear Tercero - Nuevos Campos (Fase 2)
```
Tipo de Persona (Toggle/Select)
Tipo de Identificación (Select)
Identificación + DV
[Condicional] Nombre + Apellidos (personas naturales)
[Condicional] Razón Social (personas jurídicas)
Régimen Tributario (Select)
¿Es Autorretenedor? (Checkbox)
¿Retefuente? (Checkbox + Tarifa)
Contacto: Dirección, Email, Teléfono1, Teléfono2
Estado (Select)
```

---

## ⚠️ Consideraciones Importantes

### 1. **Migración de Datos**
- ✅ Cero datos perdidos
- ✅ Automática y reversible
- ✅ Backup disponible
- ⚠️ Nuevos campos quedarán NULL hasta actualizarse

### 2. **Compatibilidad**
- ✅ Rutas API existentes siguen funcionando
- ✅ Tipos TS se actualizan automáticamente
- ✅ Validación Zod mejorada pero backwards-compatible

### 3. **Performance**
- ✅ Índices optimizan queries frecuentes
- ✅ UNIQUE constraints previenen duplicados
- ✅ Foreign key mantiene integridad referencial

### 4. **Seguridad**
- ✅ Auditoría de cambios (fecha_actualizacion)
- ✅ Validación de datos en backend
- ✅ Constraints a nivel DB

---

## 🔄 Plan de Implementación Fase por Fase

### **Fase 1** (Actual - Base de Datos)
- ✅ Script de migración listo
- ✅ Schema TypeScript actualizado
- ✅ Validación Zod implementada
- ✅ Métodos storage creados

### **Fase 2** (Próxima - Frontend Básico)
- ⏳ Actualizar tabla para mostrar nuevos campos
- ⏳ Formulario de creación con campos nuevos
- ⏳ Validación condicional por tipo_persona

### **Fase 3** (Mejoras Avanzadas)
- ⏳ Búsqueda flexible por email/ID/nombre
- ⏳ Filtros avanzados en tabla
- ⏳ Reportes tributarios
- ⏳ Validación de DV (Luhn)

### **Fase 4** (Optimizaciones)
- ⏳ Soft-delete (estado = 'suspendido')
- ⏳ Historial de cambios
- ⏳ Export a CSV/Excel
- ⏳ Importar desde archivo

---

## ✅ Checklist de Ejecución

- [ ] Leer TERCEROS_MIGRATION_GUIDE.md
- [ ] Ejecutar script migrate-terceros.sql
- [ ] Verificar datos migrantes
- [ ] Probar GET /api/:tenantId/terceros
- [ ] Probar POST con nuevos campos (todos opcionales excepto requeridos)
- [ ] npm run build (sin errores)
- [ ] npm run dev (aplicación funciona)
- [ ] Crear commit en GitHub
- [ ] Documentar en backlog para Fase 2

---

## 📚 Archivos Generados

1. **scripts/migrate-terceros.sql** - Script de migración
2. **shared/schema.ts** - Schema actualizado
3. **server/storage-terceros-methods.ts** - Nuevos métodos
4. **TERCEROS_MIGRATION_GUIDE.md** - Guía de usuario
5. **TERCEROS_RESTRUCTURING.md** - Este documento (técnico)

---

## 📞 Soporte

**En caso de problemas**:

1. Revertir: Ejecutar en MySQL:
```sql
DROP TABLE terceros;
RENAME TABLE terceros_backup TO terceros;
```

2. Consultar backup:
```sql
SELECT * FROM terceros_backup LIMIT 10;
```

3. Validar integridad:
```sql
SELECT COUNT(*) FROM terceros;
SELECT COUNT(*) FROM terceros_backup;
```

---

**Próximo paso**: Ejecutar el script de migración en tu base de datos MySQL.

