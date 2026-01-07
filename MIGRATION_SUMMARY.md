# Resumen de Cambios: Migración PostgreSQL → MySQL

## Cambios Realizados

### 1. **Dependencias (package.json)**
- ✅ Reemplazado: `pg` → `mysql2`
- ✅ Reemplazado: `connect-pg-simple` → `express-mysql-session`
- ✅ Reemplazado: `@types/connect-pg-simple` → `@types/express-mysql-session`

### 2. **Configuración Drizzle (drizzle.config.ts)**
- ✅ Cambiado: `dialect: "postgresql"` → `dialect: "mysql"`
- ✅ Actualizado mensaje de error para mostrar formato MySQL correcto

### 3. **Conexión Base de Datos (server/db.ts)**
- ✅ Driver: `drizzle-orm/node-postgres` → `drizzle-orm/mysql2`
- ✅ Pool: `pg.Pool` → `mysql.createPool()`
- ✅ Agregado: `mode: "default"` requerido por mysql2 driver

### 4. **Esquemas de Base de Datos (shared/schema.ts)**
- ✅ Tipos: `pgTable` → `mysqlTable`
- ✅ Tipos de columnas:
  - `serial` → `int().autoincrement()`
  - `varchar` sin length → `varchar(..., { length: 255 })`
  - `numeric` → `decimal`
  - `timestamp` → adaptado a MySQL
  - `jsonb` → `text` (MySQL no tiene jsonb nativo)
  - Para `expire` en sesiones: `timestamp` → `bigint(..., { mode: "number" })` (unix timestamp)
- ✅ UUID: `gen_random_uuid()` → `UUID()`

### 5. **Modelo de Autenticación (shared/models/auth.ts)**
- ✅ Migrado a tipos mysql-core
- ✅ Actualizado esquema sessions

### 6. **Almacenamiento (server/storage.ts)**
- ✅ Adaptado: Sin soporte `.returning()` en MySQL
  - Ahora: Insert → Lee insertId → Select row → Return
  - Agregadas validaciones de seguridad post-insert

### 7. **Autenticación (server/replit_integrations/auth/storage.ts)**
- ✅ Cambio: `.onConflictDoUpdate()` → `.onDuplicateKeyUpdate()`
- ✅ Adaptado: Upsert para MySQL

### 8. **Sesiones (server/replit_integrations/auth/replitAuth.ts)**
- ✅ Driver: `connect-pg-simple` → `express-mysql-session`
- ✅ Pool: Adaptado a mysql2 pool
- ✅ TTL: Convertido de milisegundos a segundos
- ✅ Opciones: Removidas `clearExpired` y `checkExpirationInterval`

### 9. **Build (script/build.ts)**
- ✅ Actualizado allowlist para dependencias MySQL

### 10. **Documentación (replit.md)**
- ✅ Actualizado: PostgreSQL → MySQL
- ✅ Actualizado: connect-pg-simple → express-mysql-session

### 11. **Validación de Tipos (client/src/pages/Asientos.tsx)**
- ✅ Corregido: `fecha` de string a Date
- ✅ Corregido: Líneas de asiento con `cuentaId` requerido

### 12. **Archivos de Configuración**
- ✅ Creado: `.env.example` con template de variables
- ✅ Creado: `SETUP_LOCAL.md` con guía completa de instalación

## Verificaciones Realizadas

```bash
✅ npx tsc --noEmit           # Sin errores de tipos
✅ npm install                # Dependencias instaladas
✅ npm run db:push            # Drizzle config validado
✅ git status                 # Cambios preparados
```

## Próximos Pasos para Desarrollo Local

1. **Crear archivo .env:**
   ```bash
   cp .env.example .env
   # Editar con credenciales MySQL locales
   ```

2. **Instalar y configurar MySQL:**
   ```bash
   # Ver SETUP_LOCAL.md para instrucciones detalladas
   mysql -u root -p < scripts/init.sql
   npm run db:push
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   # Acceder a http://localhost:5000
   ```

## Compatibilidad

| Aspecto | Anterior (PG) | Nuevo (MySQL) |
|--------|--------------|--------------|
| DB | PostgreSQL 12+ | MySQL 8.0+ |
| Driver | node-postgres | mysql2 |
| Sessions | connect-pg-simple | express-mysql-session |
| Decimal | numeric | decimal |
| UUID | gen_random_uuid() | UUID() |
| JSON | jsonb | text |
| Auto ID | serial | int autoincrement |

## Notas Importantes

- Las migraciones antiguas de PostgreSQL (en `/migrations`) deben ser descartadas
- La primera ejecución de `npm run db:push` creará el esquema completo
- No hay cambios en la API REST - la interfaz sigue siendo igual
- Frontend no requiere cambios - solo backend y BD

---
**Estado**: ✅ Completado  
**Última actualización**: Enero 6, 2026
