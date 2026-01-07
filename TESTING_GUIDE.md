# 🧪 Guía de Testing - Flujo de Autenticación Corregido

## 🚀 Cómo Correr la Aplicación

### Opción 1: Con DEV_AUTH_BYPASS (Recomendado para Testing)

```bash
# En tu .env local, asegúrate que tienes:
DEV_AUTH_BYPASS=true

# Luego corre el dev server
npm run dev
# o
yarn dev
```

**Ventajas**: No requiere Replit Auth, login instantáneo
**Desventajas**: Simula el login, no es producción

### Opción 2: Con Replit Auth Real

```bash
# Asegúrate que tienes estas variables de entorno:
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-replit-id
SESSION_SECRET=your-session-secret

npm run dev
```

---

## 🧪 Casos de Testing Detallados

### Caso 1: Primer Acceso (Sin Autenticación)

**Objetivo**: Verificar que un usuario sin sesión ve el landing page

1. Abre una ventana **Incógnito/Privada**
2. Ve a `http://localhost:5000`
3. **Esperado**: 
   - ✅ Ves el Landing Page
   - ✅ Título "Gravy Contabilidad Multi-tenant"
   - ✅ Botón "Iniciar sesión" visible
   - ✅ Sin acceso a `/app`

**Verifica en la consola**:
```javascript
// En DevTools → Console
console.log(document.location.href) // debe ser http://localhost:5000/
```

---

### Caso 2: Flujo de Login

**Objetivo**: Verificar que el login redirige correctamente a TenantSelection

1. Click en botón "Iniciar sesión"
2. **Esperado con DEV_AUTH_BYPASS=true**:
   - ✅ Redirige automáticamente a `/app`
   - ✅ Muestra "Selecciona una empresa para comenzar"
   - ✅ Muestra lista de empresas (si existen) o solo botón "Nueva Empresa"

**Red**: Abre DevTools → Network tab
```
GET http://localhost:5000/api/login → Redirige a /app
GET http://localhost:5000/app → Carga TenantSelection
```

---

### Caso 3: Crear Nueva Empresa

**Objetivo**: Verificar que se puede crear una empresa y aparece en la lista

1. Estando en `/app` (TenantSelection)
2. Click en "Nueva Empresa"
3. Completa el formulario:
   ```
   Nombre: Mi Primera Empresa
   Tipo: S.A.S
   Grupo NIIF: Grupo 2 (Pymes)
   Responsable Contable: Juan Pérez
   ```
4. Click "Crear Empresa"
5. **Esperado**:
   - ✅ Notificación "Empresa creada exitosamente"
   - ✅ Nueva tarjeta aparece en la grid
   - ✅ Muestra nombre, tipo y grupo NIIF

---

### Caso 4: Navegar al Dashboard

**Objetivo**: Verificar que seleccionar una empresa lleva al dashboard

1. Estando en TenantSelection (`/app`)
2. Click en cualquier tarjeta de empresa
3. **Esperado**:
   - ✅ Navega a `/app/{id}/dashboard`
   - ✅ URL en la barra = `http://localhost:5000/app/1/dashboard` (ejemplo)
   - ✅ Muestra "Panel General"
   - ✅ Muestra el nombre de la empresa seleccionada
   - ✅ Muestra 4 stat cards (Cuentas, Terceros, Asientos, Pendientes)
   - ✅ Muestra tabla de Actividad Reciente

**Network Check**:
```
GET /api/tenants/1 → Obtiene detalles de la empresa
GET /api/1/cuentas → Obtiene cuentas
GET /api/1/terceros → Obtiene terceros
GET /api/1/asientos → Obtiene asientos
```

---

### Caso 5: Navegación Lateral (Sidebar)

**Objetivo**: Verificar que todos los links del sidebar funcionan

**En Desktop**:
1. Estando en `/app/1/dashboard`
2. Deberías ver un sidebar gris oscuro a la izquierda con opciones
3. Verifica cada link:

   **Link 1: Dashboard**
   - Click en "Dashboard"
   - Esperado: Permanece en `/app/1/dashboard` (activo)
   - ✅ Link tiene fondo azul (activo)

   **Link 2: Plan de Cuentas**
   - Click en "Plan de Cuentas"
   - Esperado: Navega a `/app/1/cuentas`
   - ✅ Link ahora está activo (azul)
   - ✅ Página carga contenido de cuentas

   **Link 3: Terceros**
   - Click en "Terceros"
   - Esperado: Navega a `/app/1/terceros`
   - ✅ Link ahora está activo
   - ✅ Página carga contenido de terceros

   **Link 4: Asientos Contables**
   - Click en "Asientos Contables"
   - Esperado: Navega a `/app/1/asientos`
   - ✅ Link ahora está activo
   - ✅ Página carga contenido de asientos

   **Link 5: Políticas NIIF**
   - Click en "Políticas NIIF"
   - Esperado: Navega a `/app/1/niif`
   - ✅ Link ahora está activo
   - ✅ Página carga contenido NIIF

4. **En Mobile**:
   - Click en ícono hamburguesa (arriba a la izquierda)
   - Deberías ver el menú expandido
   - Verifica que funciona igual que en desktop

---

### Caso 6: Cambiar de Empresa

**Objetivo**: Verificar que puedes cambiar entre empresas

1. Estando en el dashboard de una empresa
2. Busca el link "Cambiar Empresa" (en el sidebar, parte inferior)
3. Click en "Cambiar Empresa"
4. **Esperado**:
   - ✅ Redirige a `/app` (TenantSelection)
   - ✅ Muestra lista de todas tus empresas
   - ✅ Puedes hacer click en otra empresa
   - ✅ Datos del dashboard cambian según la empresa

---

### Caso 7: Logout (Cerrar Sesión)

**Objetivo**: Verificar que el logout redirige correctamente

1. Estando en cualquier página autenticada (`/app` o `/app/1/*`)
2. Busca el botón "Cerrar Sesión" (esquina superior derecha en mobile)
3. Click en "Cerrar Sesión"
4. **Esperado**:
   - ✅ Redirige a `/` (Landing Page)
   - ✅ Se muestra nuevamente el Landing Page
   - ✅ Botón "Iniciar sesión" está disponible

**Cookie Check**: DevTools → Application → Cookies
- Session cookie debe ser eliminada

---

### Caso 8: Acceso Directo sin Autenticación (Seguridad)

**Objetivo**: Verificar que no se puede acceder a rutas protegidas sin login

1. Abre una ventana Incógnito/Privada
2. Intenta acceder directamente a `http://localhost:5000/app`
3. **Esperado**:
   - ✅ Redirige automáticamente a `/` (Landing Page)
   - ✅ NO se muestra TenantSelection

4. Intenta acceder a `http://localhost:5000/app/1/dashboard`
5. **Esperado**:
   - ✅ Redirige automáticamente a `/` (Landing Page)
   - ✅ NO se muestra Dashboard

6. Intenta acceder a `http://localhost:5000/app/999/cuentas`
7. **Esperado**:
   - ✅ Redirige automáticamente a `/` (Landing Page)

---

### Caso 9: Acceso Directo CON Autenticación

**Objetivo**: Verificar que rutas protegidas funcionan directamente si estás autenticado

1. Haz login primero (ir a `/` y hacer login)
2. Una vez en `/app` o después en `/app/1/dashboard`
3. Abre una **nueva pestaña**
4. Ve directamente a `http://localhost:5000/app/1/dashboard` (usa un ID válido)
5. **Esperado**:
   - ✅ Carga directamente el dashboard
   - ✅ No redirige a `/`
   - ✅ Muestra los datos de la empresa

---

## 📊 Matriz de Testing Completa

| Caso | Ruta | Autenticado | Esperado | Estado |
|------|------|-------------|----------|--------|
| 1 | `/` | No | Landing Page | ✅ |
| 2 | `/api/login` | No | Inicia sesión | ✅ |
| 3 | `/app` | No | Redirige a `/` | ✅ |
| 4 | `/app/1/dashboard` | No | Redirige a `/` | ✅ |
| 5 | `/` | Sí | Redirige a `/app` | ✅ |
| 6 | `/app` | Sí | TenantSelection | ✅ |
| 7 | `/app/1/dashboard` | Sí | Dashboard | ✅ |
| 8 | `/app/1/cuentas` | Sí | Plan de Cuentas | ✅ |
| 9 | Sidebar Link | Sí | Navega correctamente | ✅ |
| 10 | Cambiar Empresa | Sí | Redirige a `/app` | ✅ |
| 11 | `/api/logout` | Sí | Redirige a `/` | ✅ |

---

## 🐛 Debugging Tips

### Si algo no funciona:

1. **Abre DevTools**
   ```javascript
   // Console tab - verifica la ubicación
   console.log(window.location.href)
   
   // Verifica si hay usuario autenticado
   fetch('/api/auth/user', { credentials: 'include' })
     .then(r => r.json())
     .then(console.log)
   ```

2. **Network Tab**
   - ¿Hay error en alguna petición?
   - ¿Los endpoints devuelven 200 o error?
   - ¿Hay redireccionamientos inesperados?

3. **Storage/Cookies**
   - DevTools → Application → Cookies
   - ¿Existe la cookie de sesión?
   - ¿Tiene el valor correcto?

4. **Logs del Servidor**
   - Revisa la terminal donde corre `npm run dev`
   - Busca logs de rutas HTTP
   - ¿Hay errores 401/403?

5. **React DevTools**
   - Instala React DevTools como extension
   - Inspecciona el componente Router
   - ¿`user` está null o tiene valor?
   - ¿`location` es correcto?

---

## ✨ Indicadores de Éxito

Todo funciona correctamente si:

- ✅ Landing page no autenticado
- ✅ Login redirige a `/app`
- ✅ TenantSelection muestra empresas
- ✅ Click en empresa va al dashboard
- ✅ Navegación lateral funciona
- ✅ URLs tienen formato `/app/:id/*`
- ✅ Logout redirige a `/`
- ✅ No se puede acceder a `/app/*` sin auth
- ✅ Mensaje de bienvenida muestra nombre del usuario
- ✅ Empresa actual se muestra en sidebar

---

## 📱 Testing en Móvil

Para testing en móvil o tableta:

```bash
# Usa tu dirección IP local en lugar de localhost
npm run dev # Luego navega a http://YOUR_IP:5000

# En Windows, obtén tu IP:
ipconfig | findstr "IPv4"

# En Mac/Linux:
ifconfig | grep "inet "
```

**Verifica**:
- ✅ Hamburguesa menu funciona
- ✅ Sidebar se muestra correctamente
- ✅ Links son clickeables
- ✅ Formularios son responsivos
- ✅ Stat cards se ven bien

