# Scripts de Base de Datos - ContaGrav2

## Scripts Disponibles

### 1. `init-db.sql`
Script SQL para inicializar la base de datos MySQL.

**Uso:**
```bash
mysql -u contograv -p contograv2 < scripts/init-db.sql
```

**Qué hace:**
- Crea la base de datos `contograv2` si no existe
- Elimina todas las tablas existentes (limpieza completa)
- Prepara la BD para recibir el esquema de Drizzle

**⚠️ ADVERTENCIA:** Este script elimina TODOS los datos. Solo usar en desarrollo.

---

### 2. `seed-data.ts`
Script TypeScript para cargar datos de ejemplo en la base de datos.

**Uso:**
```bash
npm run db:seed
```

**Qué crea:**
- ✅ 1 Empresa: "Comercializadora ABC S.A.S."
- ✅ 69 Cuentas contables (Plan Único de Cuentas Colombia)
- ✅ 6 Terceros (clientes y proveedores)
- ✅ 3 Centros de costo
- ✅ 1 Período contable 2026
- ✅ 3 Políticas NIIF
- ✅ 6 Asientos contables completos

**Plan de Cuentas incluido:**
- Clase 1: ACTIVO (Disponible, Deudores, Inventarios, PPE)
- Clase 2: PASIVO (Cuentas por pagar, Impuestos)
- Clase 3: PATRIMONIO (Capital, Resultados)
- Clase 4: INGRESOS (Operacionales, No operacionales)
- Clase 5: GASTOS (Administración, Ventas, Financieros)
- Clase 6: COSTO DE VENTAS

**Asientos de ejemplo:**
1. **AP-001** - Apertura: Aporte inicial de capital ($50M)
2. **COM-001** - Compra: Adquisición de inventario a crédito ($10M)
3. **ING-001** - Venta: Venta de mercancía con IVA ($5.95M)
4. **COS-001** - Costo: Reconocimiento de costo de venta ($3M)
5. **EGR-001** - Gastos: Pago de servicios del mes ($2.45M)

---

## Flujo de Trabajo Completo

### Primera vez (Setup inicial)
```bash
# 1. Crear BD y usuario
mysql -u root -p < scripts/init-db.sql

# 2. Crear estructura de tablas
npm run db:push

# 3. Cargar datos de ejemplo
npm run db:seed

# 4. Iniciar servidor
npm run dev
```

### Reset completo (borrar todo y empezar de nuevo)
```bash
# 1. Limpiar y preparar BD
mysql -u contograv -p contograv2 < scripts/init-db.sql

# 2. Recrear estructura
npm run db:push

# 3. Cargar datos nuevamente
npm run db:seed
```

### Solo recargar datos (mantener estructura)
```bash
# Primero, eliminar datos manualmente en MySQL:
mysql -u contograv -p contograv2 -e "
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE lineas_asiento;
  TRUNCATE asientos;
  TRUNCATE niif_politicas;
  TRUNCATE periodos_contables;
  TRUNCATE centros_costo;
  TRUNCATE terceros;
  TRUNCATE plan_cuentas;
  TRUNCATE tenants;
  SET FOREIGN_KEY_CHECKS = 1;
"

# Luego ejecutar seed
npm run db:seed
```

---

## Notas Importantes

1. **El seed es idempotente parcialmente**: No verifica si los datos ya existen, los inserta directamente.
   
2. **Prerequisitos antes de ejecutar seed:**
   - Base de datos creada
   - Tablas creadas con `npm run db:push`
   - `DATABASE_URL` correctamente configurada en `.env`

3. **El seed NO crea usuarios de autenticación**: Solo crea datos contables. Los usuarios se manejan por Replit Auth.

4. **Los IDs son auto-incrementales**: El seed usa los IDs generados por MySQL para relacionar las líneas de asiento con sus cabeceras.

5. **Datos realistas**: Los datos incluyen ejemplos de:
   - Transacciones con terceros
   - Manejo de IVA y retenciones
   - Costeo de inventarios
   - Centros de costo
   - Políticas NIIF
   - Estados financieros completos

---

## Solución de Problemas

### Error: "Failed to create..."
- Verificar que las tablas existen: `SHOW TABLES;`
- Ejecutar `npm run db:push` primero

### Error: "Duplicate entry"
- La BD ya tiene datos
- Ejecutar script de reset completo

### Error: "Cannot add foreign key constraint"
- Las tablas padre no existen
- Ejecutar `npm run db:push` antes del seed

### Seed se ejecuta pero no veo datos
- Verificar que estás consultando el tenant correcto (ID 1)
- Verificar en MySQL: `SELECT * FROM tenants;`

---

**Última actualización**: Enero 6, 2026
