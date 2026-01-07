# Guía de Setup Local - ContaGrav2 con MySQL

## Requisitos Previos
- Node.js v20+ o v22+
- MySQL 8.0+ (servidor ejecutándose localmente o en red)
- npm o yarn

## Paso 1: Configurar Base de Datos MySQL

### Opción A: MySQL Local (Windows)
```bash
# Descargar e instalar MySQL desde: https://dev.mysql.com/downloads/mysql/

# Iniciar servicio MySQL (PowerShell como Admin)
net start MySQL80

# Conectarse a MySQL y crear base de datos
mysql -u root -p
# Introducir contraseña del root

# En el cliente MySQL:
CREATE DATABASE contograv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'contograv'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON contograv2.* TO 'contograv'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Opción B: Docker MySQL
```bash
# Crear contenedor MySQL
docker run --name mysql-contograv -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=contograv2 \
  -e MYSQL_USER=contograv \
  -e MYSQL_PASSWORD=tu_contraseña \
  -p 3306:3306 -d mysql:8.0

# Verificar que está corriendo
docker ps | grep mysql-contograv
```

## Paso 2: Configurar Variables de Entorno

```bash
# Copiar template de ejemplo
cp .env.example .env

# Editar .env con tus valores
# Windows: notepad .env
# Linux/Mac: nano .env
```

**Contenido de .env:**
```
DATABASE_URL=mysql://contograv:tu_contraseña_segura@localhost:3306/contograv2
SESSION_SECRET=your_generated_secret_32_characters_minimum
REPL_ID=your_repl_id_if_using_replit_auth
NODE_ENV=development
```

### Generar SESSION_SECRET seguro:
```bash
# Windows PowerShell
[Convert]::ToHexString((Get-Random -Count 16 -Maximum 256 -InputObject (0..255)))

# Linux/Mac
openssl rand -hex 32
```

## Paso 3: Instalar Dependencias

```bash
cd d:\Proyectos\ContaGrav2
npm install
```

Esto descargará:
- `mysql2`: Cliente MySQL para Node.js
- `express-mysql-session`: Almacenamiento de sesiones en MySQL
- Todas las demás dependencias del proyecto

## Paso 4: Generar Esquema de Base de Datos

```bash
# Ejecutar migraciones de Drizzle para crear tablas
npm run db:push

# Salida esperada:
# ✓ Pushed 1 migrations successfully (logs should show tables created)
```

### Opción A: Usar script SQL directo (Recomendado para reset completo)
```bash
# Ejecutar script de inicialización (limpia y prepara BD)
mysql -u contograv -p contograv2 < scripts/init-db.sql

# Luego ejecutar Drizzle para crear estructura
npm run db:push
```

### Si todo va bien, se crearán estas tablas:
- `sessions` - Almacenamiento de sesiones
- `users` - Usuarios del sistema
- `tenants` - Empresas/tenants
- `tenant_users` - Asociaciones usuario-empresa
- `plan_cuentas` - Plan contable
- `terceros` - Clientes/Proveedores
- `centros_costo` - Centros de costo
- `periodos_contables` - Períodos fiscales
- `asientos` - Asientos contables
- `lineas_asiento` - Líneas de detalle
- `niif_politicas` - Políticas NIIF

## Paso 5: Cargar Datos Iniciales (Seed)

```bash
# Cargar datos de ejemplo (Plan de cuentas, terceros, asientos demo)
npm run db:seed

# Salida esperada:
# 🌱 Iniciando seed de base de datos...
# ✓ 69 cuentas creadas
# ✓ 6 terceros creados
# ✓ 3 centros de costo creados
# ✓ Asientos contables creados
# ✅ SEED COMPLETADO EXITOSAMENTE!
```

**Datos que se crean:**
- 1 Empresa demo: "Comercializadora ABC S.A.S."
- Plan de Cuentas PUC Colombia completo (69 cuentas)
- 6 Terceros (clientes y proveedores)
- 3 Centros de costo
- 1 Período contable 2026
- 3 Políticas NIIF
- 6 Asientos contables de ejemplo:
  - Asiento de apertura (aporte capital)
  - Compra de inventario a crédito
  - Venta con IVA y costo
  - Gastos administrativos

## Paso 6: Ejecutar en Desarrollo

```bash
npm run dev

# Output esperado:
# HH:MM:SS AM [express] serving on port 5000
```

Abrir navegador: http://localhost:5000

## Paso 7: Compilar para Producción

```bash
npm run build

# Genera:
# dist/index.cjs - Servidor Node compilado
# dist/client/ - Cliente React optimizado
```

## Verificación: Conexión a Base de Datos

Si tienes problemas de conexión:

```bash
# 1. Verificar que MySQL está corriendo
mysql -u contograv -p -e "SELECT 1;"

# 2. Probar conexión con el string DATABASE_URL
npm run db:push

# 3. Si falla, revisar:
# - Usuario/contraseña en DATABASE_URL
# - Puerto MySQL (por defecto 3306)
# - Nombre de la base de datos
# - Que el usuario tiene permisos suficientes
```

## Comandos Útiles

```bash
# Limpiar dependencias
npm ci --omit=optional

# Ver migraciones aplicadas
npm run db:push -- --verbose

# Resetear BD y volver a cargar datos
mysql -u contograv -p contograv2 < scripts/init-db.sql
npm run db:push
npm run db:seed

# Cargar datos de nuevo (sin resetear estructura)
npm run db:seed

# Validar tipos TypeScript
npm run check

# Build de cliente React
npm run build

# Iniciar servidor en producción
npm start
```

## Troubleshooting

### Error: "DATABASE_URL must be set"
- Verificar que el archivo `.env` existe en la raíz del proyecto
- Verificar sintaxis: `mysql://user:pass@host:port/database`

### Error: "Access denied for user"
- Usuario o contraseña incorrectos
- Usuario no tiene permisos en esa base de datos
- Comando correcto: `GRANT ALL PRIVILEGES ON contograv2.* TO 'user'@'localhost';`

### Error: "Can't connect to MySQL server"
- MySQL no está corriendo
- Puerto 3306 no es accesible
- Firewall bloqueando conexión

### Error de migraciones
- Eliminar carpeta `migrations/` y volver a ejecutar `npm run db:push`
- Verificar que las tablas no existen: `SHOW TABLES;` en MySQL

## Notas de Desarrollo

- **Backend**: Express + TypeScript en `server/`
- **Frontend**: React + Vite en `client/`
- **Base de datos**: Drizzle ORM con MySQL2
- **Autenticación**: Replit Auth (OpenID Connect)
- **Validación**: Zod schemas compartidos

Cualquier cambio en `shared/schema.ts` requiere:
```bash
npm run db:push   # Para actualizar BD
npm run dev       # Para reiniciar servidor
```

---
**Última actualización**: Enero 2026
**Stack**: Node.js + Express + React + MySQL + Drizzle ORM
