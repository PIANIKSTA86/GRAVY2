# 🎯 Flujo de Autenticación - Antes vs Después

## 📊 Diagrama de Flujo Anterior (CON ERRORES)

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                      │
│                  (Accesible sin auth)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Click "Iniciar sesión"
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   /api/login                             │
│              (Autenticación Replit/Dev)                  │
└──────────────────────┬──────────────────────────────────┘
                       │ Callback → successReturnToOrRedirect
                       ▼
┌─────────────────────────────────────────────────────────┐
│            TENANT SELECTION (/app)                       │
│     (Sin protección - accesible sin auth ❌)            │
│     (Sin redirección automática ❌)                     │
└──────────────────────┬──────────────────────────────────┘
                       │ Click en empresa
                       │ href="/:tenantId/dashboard" ❌ ROTA
                       ▼
┌─────────────────────────────────────────────────────────┐
│       DASHBOARD (/:tenantId/dashboard) ❌               │
│     ❌ Ruta sin prefijo /app                            │
│     ❌ Sin protección de autenticación                  │
│     ❌ Problema: No coincide con definición en Router   │
│     ❌ Link roto, no funciona                           │
│     ❌ Usuarios no autenticados pueden acceder          │
└─────────────────────────────────────────────────────────┘
```

### 🔴 Problemas Identificados

1. **Rutas inconsistentes**: Router espera `/app/:tenantId/...` pero links usan `/:tenantId/...`
2. **Sin protección**: Alguien podría ir directamente a `/:tenantId/dashboard` sin estar autenticado
3. **Sin redirección**: Usuario autenticado en `/` se queda en landing page
4. **Links rotos**: Links en TenantSelection y Layout no redirigen a ningún lado

---

## ✅ Diagrama de Flujo Nuevo (CORREGIDO)

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                      │
│                (Pública - sin protección)                │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Router Behavior:                                 │    │
│  │ • Usuario NO autenticado → Muestra landing      │    │
│  │ • Usuario autenticado → Auto-redirige a /app ✓ │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────┬───────────────┘
               │ No autenticado            │ Autenticado
               │ "Iniciar sesión"          │ Auto-redirige
               ▼                           ▼
        ┌─────────────────┐         [/app Tenant Selection]
        │  /api/login     │              │
        │  Autenticación  │              │
        └────────┬────────┘              │
                 │ Callback              │
                 │ successReturnToOrRedirect: /app
                 └──────────────┬────────┘
                                ▼
        ┌───────────────────────────────────────────────────┐
        │       TENANT SELECTION (/app) ✓                   │
        │                                                    │
        │  ┌────────────────────────────────────────────┐   │
        │  │ Protección Implementada:                   │   │
        │  │ • Requiere autenticación                   │   │
        │  │ • Muestra empresas del usuario             │   │
        │  │ • Links correctos a /app/:id/dashboard ✓  │   │
        │  └────────────────────────────────────────────┘   │
        │                                                    │
        └───────────────┬─────────────────────────────────┘
                        │ Click en empresa
                        │ href="/app/:tenantId/dashboard" ✓
                        ▼
        ┌───────────────────────────────────────────────────┐
        │      DASHBOARD (/app/:tenantId/dashboard) ✓       │
        │                                                    │
        │  ┌────────────────────────────────────────────┐   │
        │  │ Protecciones Implementadas:                │   │
        │  │ • Requiere autenticación                   │   │
        │  │ • Valida tenantId de la URL                │   │
        │  │ • Layout con navegación correcta ✓         │   │
        │  │ • Links a otras secciones funcionan ✓      │   │
        │  │ • Link "Cambiar Empresa" → /app ✓          │   │
        │  └────────────────────────────────────────────┘   │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐ │
        │  │ Navegación Lateral:                          │ │
        │  │ • Plan de Cuentas: /app/:id/cuentas ✓       │ │
        │  │ • Terceros: /app/:id/terceros ✓             │ │
        │  │ • Asientos: /app/:id/asientos ✓             │ │
        │  │ • NIIF Políticas: /app/:id/niif ✓           │ │
        │  └──────────────────────────────────────────────┘ │
        │                                                    │
        └────────────────────────┬───────────────────────────┘
                                 │ Logout
                                 ▼
                        ┌──────────────────┐
                        │ /api/logout      │
                        │ → Redirige a / ✓ │
                        └──────────────────┘
```

---

## 🔐 Matriz de Protecciones

| Ruta | Autenticación | Validación | Estado |
|------|---------------|-----------|--------|
| `/` | ❌ No requerida | N/A | ✅ Pública |
| `/api/login` | ❌ No requerida | N/A | ✅ Pública |
| `/api/logout` | ❌ No requerida | N/A | ✅ Pública |
| `/app` | ✅ Requerida | N/A | ✅ Protegida |
| `/app/:tenantId/*` | ✅ Requerida | ✅ tenantId válido | ✅ Protegida |

### Redirecciones Inteligentes

| Escenario | Acción |
|-----------|--------|
| Usuario NO autenticado accede a `/app` | ➡️ Redirige a `/` |
| Usuario NO autenticado accede a `/app/:id/*` | ➡️ Redirige a `/` |
| Usuario autenticado abre `/` | ➡️ Redirige a `/app` |
| Usuario autenticado abre `/app` | ✓ Muestra TenantSelection |
| Usuario autenticado abre `/app/:id/dashboard` | ✓ Muestra Dashboard |

---

## 🔍 Cambios Específicos en Código

### App.tsx - Router

**ANTES** (❌ Incorrecto):
```tsx
<Route path="/" component={LandingPage} />
<Route path="/app" component={TenantSelection} />
<Route path=":tenantId/dashboard" component={Dashboard} />
<Route path=":tenantId/cuentas" component={PlanCuentas} />
```

**DESPUÉS** (✅ Correcto):
```tsx
const [location, setLocation] = useLocation();

// Redirect logic
if (!user && location !== "/" && !location.startsWith("/api")) {
  setLocation("/");
  return null;
}

if (user && location === "/") {
  setLocation("/app");
  return null;
}

<Route path="/" component={LandingPage} />
<Route path="/app" component={TenantSelection} />
<Route path="/app/:tenantId/dashboard" component={Dashboard} />
<Route path="/app/:tenantId/cuentas" component={PlanCuentas} />
```

### TenantSelection.tsx - Link de Empresa

**ANTES** (❌ Rota):
```tsx
<Link href={`/${tenant.id}/dashboard`} className="block">
```

**DESPUÉS** (✅ Funciona):
```tsx
<Link href={`/app/${tenant.id}/dashboard`} className="block">
```

### Layout.tsx - Navegación

**ANTES** (❌ Links rotos):
```tsx
const navigation = [
  { name: "Dashboard", href: `/${tenantId}/dashboard`, ... },
  { name: "Plan de Cuentas", href: `/${tenantId}/cuentas`, ... },
];
```

**DESPUÉS** (✅ Links funcionan):
```tsx
const navigation = [
  { name: "Dashboard", href: `/app/${tenantId}/dashboard`, ... },
  { name: "Plan de Cuentas", href: `/app/${tenantId}/cuentas`, ... },
];
```

---

## 🧪 Testing Checklist

Para verificar que el flujo está funcionando correctamente:

- [ ] Abrir app en incógnito (sin autenticación)
  - [ ] Landing page se carga
  - [ ] Click en "Iniciar sesión" → `/api/login`
  
- [ ] Después de login
  - [ ] Auto-redirige a `/app`
  - [ ] TenantSelection se carga
  - [ ] Se muestran empresas
  
- [ ] Click en empresa
  - [ ] Navega a `/app/:id/dashboard`
  - [ ] Dashboard se carga correctamente
  - [ ] Datos de la empresa se muestran
  
- [ ] Navegación lateral
  - [ ] Todos los links funcionan
  - [ ] Las páginas se cargan correctamente
  - [ ] Parámetro `:tenantId` se pasa correctamente
  
- [ ] Logout
  - [ ] Click en "Cerrar Sesión"
  - [ ] Navega a `/`
  - [ ] Se muestra Landing Page

- [ ] Intentar acceso directo
  - [ ] Abrir `/app/1/dashboard` sin autenticación
  - [ ] Se debe redirigir a `/`

---

## 💡 Beneficios de las Correcciones

1. ✅ **UX Fluida** - Los usuarios no pueden perderse en el flujo
2. ✅ **Seguridad** - Rutas protegidas no son accesibles sin autenticación
3. ✅ **Mantenibilidad** - Convención consistente `/app/*` para rutas autenticadas
4. ✅ **Debugging** - Es más fácil rastrear problemas con rutas consistentes
5. ✅ **Escalabilidad** - Nuevas rutas pueden seguir el mismo patrón

