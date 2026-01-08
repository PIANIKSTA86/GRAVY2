# Guía de Migración: Tabla Terceros Restructurada

## 📋 Resumen de Cambios

Se ha reestructurado completamente la tabla `terceros` para soportar gestión integral de terceros con información completa, validación tributaria y auditoría.

### Campos Agregados (18 nuevos campos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `tipo_identificacion` | ENUM | CC, NIT, CE, PA, PT, PN, XX |
| `dv` | CHAR(1) | Dígito de verificación |
| `tipo_persona` | ENUM | persona_natural \| persona_juridica |
| `nombre` | VARCHAR(100) | Nombre (solo personas naturales) |
| `apellidos` | VARCHAR(100) | Apellidos (solo personas naturales) |
| `nombre_completo` | VARCHAR(255) | Campo consolidado requerido |
| `razon_social` | VARCHAR(255) | Razón social (solo empresas) |
| `tipo_regimen` | ENUM | ordinario \| simplificado \| tributario_especial |
| `es_autorretenedor` | BOOLEAN | Indica si es autorretenedor |
| `retefuente` | BOOLEAN | Indicador de retención fuente |
| `tarifa_retefuente` | DECIMAL(5,2) | Tarifa % de retefuente |
| `direccion` | VARCHAR(255) | Dirección fiscal/comercial |
| `email` | VARCHAR(255) | Email de contacto |
| `telefono1` | VARCHAR(20) | Teléfono principal |
| `telefono2` | VARCHAR(20) | Teléfono secundario |
| `estado` | ENUM | activo \| inactivo \| suspendido |
| `fecha_creacion` | TIMESTAMP | Auditoría |
| `fecha_actualizacion` | TIMESTAMP | Auditoría |

### Campos Modificados

- `nombre` → Ahora es opcional, solo para personas naturales
- Se agregan nuevos índices para optimizar búsquedas por estado, email y tipo

## 🚀 Pasos de Ejecución

### Paso 1: Respaldar Datos Actuales
```bash
npm run db:backup  # Si existe script de backup
# O ejecutar manualmente:
# CREATE TABLE terceros_backup AS SELECT * FROM terceros;
```

### Paso 2: Ejecutar Script de Migración
```bash
# En terminal MySQL/Workbench, ejecutar:
mysql -u root -p gravy2 < scripts/migrate-terceros.sql
```

O copiar y ejecutar el contenido de `scripts/migrate-terceros.sql` en tu cliente MySQL.

### Paso 3: Verificar Migración
```sql
-- Verificar integridad de datos
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos
FROM terceros;

-- Mostrar primeros registros
SELECT id, tipo_identificacion, identificacion, nombre_completo, tipo_persona, estado
FROM terceros LIMIT 5;
```

### Paso 4: Actualizar Frontend
- Los componentes React no necesitan cambios inmediatos
- Las nuevas columnas serán NULL hasta poblarse
- Gradualmente se agregarán campos al formulario de creación

### Paso 5: Ejecutar Build y Test
```bash
npm run build
npm run dev
```

## 📊 Cambios de API

### GET `/api/:tenantId/terceros` (Sin cambios)
Sigue retornando la misma estructura, pero con campos adicionales

### POST `/api/:tenantId/terceros` (Actualizado)
**Request Body Mejorado:**
```json
{
  "tipoIdentificacion": "NIT",
  "identificacion": "123456789",
  "dv": "0",
  "tipoPersona": "persona_juridica",
  "nombreCompleto": "ACME Corporation S.A.S.",
  "razonSocial": "ACME Corporation S.A.S.",
  "tipoRegimen": "ordinario",
  "esAutorretenedor": false,
  "retefuente": true,
  "tarifaRetefuente": 2.5,
  "tipo": "Proveedor",
  "vinculoEconomico": "Proveedor Habitual",
  "parteRelacionada": false,
  "direccion": "Calle 10 #20-30, Bogotá",
  "email": "contacto@acme.com",
  "telefono1": "+57 1 3421000",
  "telefono2": "+57 1 3421001",
  "estado": "activo"
}
```

## ⚠️ Consideraciones Importantes

1. **Duplicado de Identificación**
   - La columna `identificacion` ahora es UNIQUE en el contexto del tenant
   - Previene registros duplicados por empresa

2. **Datos Legados**
   - Campo `nombre` antiguo se migra a `nombre_completo`
   - `tipo_persona` se asume como `persona_juridica` por defecto
   - `estado` se marca como `activo` automáticamente

3. **Campos NULL**
   - Nuevos campos como `dv`, `apellidos`, `razon_social`, `direccion`, `email`, `telefono1`, `telefono2`, `tarifa_retefuente` pueden ser NULL
   - Se llenarán con actualizaciones posteriores

4. **Índices Agregados**
   - `idx_terceros_tenant_estado` → Optimiza filtros por estado
   - `idx_terceros_email` → Busca por email
   - `idx_terceros_tipo` → Clasificación

## 🔄 Revertir Migración (Si es Necesario)

```sql
-- En caso de necesitar volver a la estructura antigua:
DROP TABLE terceros;
RENAME TABLE terceros_backup TO terceros;
```

## 📝 Próximos Pasos

1. **Formulario de Creación Mejorado**
   - Agregar campos condicionales según `tipo_persona`
   - Validación de dígito de verificación (Luhn para NIT)

2. **Métodos de Backend Adicionales**
   - `searchTerceros()` - búsqueda flexible
   - `findByEmail()` - prevención de duplicados
   - `validateDV()` - validación de dígito

3. **Página Terceros Actualizada**
   - Mostrar tipo_regimen en tabla
   - Indicadores visuales para autorretenedor/retefuente
   - Filtros avanzados por estado, régimen, tipo

4. **Auditoría y Reportes**
   - Tracking de cambios
   - Reportes tributarios (autorretenedores, retefuente)
   - Historial de modificaciones

## 🔧 Troubleshooting

**Error: "La tabla 'terceros' ya existe"**
- Asegúrate de ejecutar primero: `DROP TABLE terceros;`
- O usa el script de migración que crea `terceros_new` y luego renombra

**Error: "Violación de restricción UNIQUE"**
- Significa que hay duplicados de `identificacion` + `tenant_id`
- Revisar script de migración para manejar duplicados

**¿Dónde está el backup?**
- Está en tabla `terceros_backup`
- No se borra automáticamente
- Puedes eliminarla después de validar: `DROP TABLE terceros_backup;`

