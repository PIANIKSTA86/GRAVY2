# 🔐 Sistema de Autenticación Personalizado - Implementado

He completado la migración de Replit Auth a un **sistema de autenticación personalizado** con email, ID de suscriptor y contraseña.

## 📋 Cambios Realizados

### Backend
1. **Nuevo archivo** `server/auth.ts`
   - Endpoints: `POST /api/auth/login`, `GET /api/auth/user`, `POST /api/auth/logout`
   - Seguridad: PBKDF2 con crypto nativo de Node.js
   - Sesiones en MySQL

2. **Actualizado** `server/routes.ts`
   - Usa el nuevo sistema de autenticación
   - Reemplazó Replit Auth

3. **Actualizado** `shared/schema.ts`
   - Agregados campos a tabla `users`: `subscriberId`, `passwordHash`

### Frontend
1. **Nueva página** `client/src/pages/LoginPage.tsx`
   - Formulario con email, ID suscriptor, contraseña
   - Validación en cliente
   - Manejo de errores

2. **Actualizado** `client/src/App.tsx`
   - Nuevo flujo: Landing → Login → TenantSelection → Dashboard
   - Protección de rutas autenticadas

3. **Actualizado** `client/src/hooks/use-auth.ts`
   - Adaptado al nuevo endpoint de login

4. **Actualizado** `client/src/pages/LandingPage.tsx`
   - Botón "Iniciar sesión" ahora va a `/login`

## 🚀 Instrucciones de Setup

### 1. Actualizar la Base de Datos
```bash
npm run db:push
```

### 2. Agregar Usuario de Prueba
```bash
npm run db:seed-users
```

**Credenciales de prueba:**
- Email: `demo@gravy.local`
- ID Suscriptor: `SUB001`
- Contraseña: `demo123`

### 3. Iniciar la Aplicación
```bash
npm run dev
# o en Windows
npm run dev:win
```

## 🔄 Flujo de Autenticación

```
Landing Page (/)
    ↓ Click "Iniciar sesión"
Login Page (/login)
    ↓ Ingresar credenciales
POST /api/auth/login
    ↓ Si es válido
Sesión creada → Redirige a /app
    ↓
Tenant Selection (/app)
    ↓ Click en empresa
Dashboard (/:tenantId/dashboard)
    ↓ Logout
POST /api/auth/logout → Redirige a /
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con PBKDF2 (100,000 iteraciones)
- ✅ Sesiones almacenadas en MySQL
- ✅ Cookies HttpOnly + Secure (en producción)
- ✅ Validación en servidor
- ✅ Protección de rutas

## 📝 Endpoints de Autenticación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login con email, subscriberId, password |
| `/api/auth/user` | GET | Obtener usuario autenticado |
| `/api/auth/logout` | POST | Cerrar sesión |

### POST /api/auth/login
```json
{
  "email": "demo@gravy.local",
  "subscriberId": "SUB001",
  "password": "demo123"
}
```

Respuesta:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "demo@gravy.local",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

## 🧪 Testing

1. Abre `http://localhost:5000`
2. Haz click en "Iniciar sesión"
3. Usa las credenciales de prueba
4. Deberías llegar a Tenant Selection
5. Selecciona una empresa
6. Prueba los logout

## 🔧 Agregar Nuevos Usuarios

Para agregar usuarios en producción, ejecuta:
```bash
npm run db:seed-users
```

O modifica `scripts/seed-users.ts` para agregar más usuarios:

```typescript
await db.insert(users).values({
  email: "usuario@empresa.com",
  subscriberId: "SUB002",
  passwordHash: hashPassword("contraseña_segura"),
  firstName: "Nombre",
  lastName: "Apellido",
}).ignore();
```

## 📚 Archivos Modificados

- ✅ `server/auth.ts` (nuevo)
- ✅ `server/routes.ts`
- ✅ `client/src/pages/LoginPage.tsx` (nuevo)
- ✅ `client/src/App.tsx`
- ✅ `client/src/hooks/use-auth.ts`
- ✅ `client/src/pages/LandingPage.tsx`
- ✅ `shared/schema.ts`
- ✅ `scripts/seed-users.ts` (nuevo)
- ✅ `package.json`

## ⚠️ Próximos Pasos

1. **Crear endpoint de registro** (opcional)
2. **Implementar recuperación de contraseña** (opcional)
3. **Agregar 2FA** (opcional)
4. **Validación de email** (opcional)

---

**Status**: ✅ Listo para testing

El sistema de autenticación personalizado está completamente implementado.
