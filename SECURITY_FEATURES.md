# 🔒 Características de Seguridad Implementadas

## Resumen de Mejoras

He implementado 3 capas adicionales de seguridad en el sistema de autenticación:

1. ✅ **Rate Limiting** - Protección contra fuerza bruta
2. ✅ **Validación de NIT** - Formato y dígito de verificación
3. ✅ **Auditoría Completa** - Log de todos los intentos de login

---

## 1. 🚦 Rate Limiting

### Configuración
- **Máximo de intentos:** 5 intentos fallidos
- **Tiempo de bloqueo:** 15 minutos
- **Identificación:** Por dirección IP
- **Storage:** En memoria (Map en Node.js)

### Comportamiento
```
Intento 1-4: Login permitido
Intento 5: Último intento permitido
Intento 6+: Bloqueado por 15 minutos

Respuesta HTTP 429:
{
  "message": "Demasiados intentos fallidos. Intenta de nuevo en 14 minutos.",
  "lockoutEndsAt": "2026-01-07T15:30:00.000Z"
}
```

### Para Producción
Se recomienda usar Redis en lugar de Map en memoria:
```typescript
// Alternativa con Redis
import Redis from 'ioredis';
const redis = new Redis();
```

---

## 2. ✅ Validación de NIT Colombiano

### Formatos Aceptados
```
900123456        ✅ 9 dígitos
9001234561       ✅ 10 dígitos (con verificación)
900-123-456      ✅ Con guiones
900 123 456      ✅ Con espacios
900.123.456-1    ✅ Con puntos y guión
```

### Validación Implementada
1. **Limpieza:** Remueve espacios, guiones, puntos
2. **Formato:** Verifica que tenga 9-10 dígitos
3. **Dígito de verificación:** Si tiene 10 dígitos, valida el checksum
4. **Normalización:** Almacena sin caracteres especiales

### Algoritmo de Verificación
```typescript
Pesos: [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3]
Suma = Σ(dígito[i] × peso[i])
Resto = Suma % 11
DV = (Resto == 0 || Resto == 1) ? Resto : (11 - Resto)
```

### Ejemplos Válidos
```
NIT: 900123456
NIT: 900.123.456-1 (con dígito de verificación)
NIT: 830.037.800-0 (formato DIAN)
```

---

## 3. 📊 Sistema de Auditoría

### Tabla: `login_attempts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int | ID autoincremental |
| email | varchar(255) | Email del intento |
| subscriberId | varchar(255) | NIT usado |
| ipAddress | varchar(45) | IP del cliente |
| userAgent | varchar(500) | Navegador/dispositivo |
| success | boolean | Si fue exitoso |
| failureReason | varchar(255) | Razón del fallo |
| attemptedAt | timestamp | Fecha y hora |

### Razones de Fallo Registradas
- `Campos incompletos` - Falta email, NIT o contraseña
- `Rate limit excedido` - Demasiados intentos
- `NIT inválido` - Formato incorrecto
- `Usuario no encontrado` - Email no existe
- `NIT incorrecto` - NIT no coincide
- `Contraseña incorrecta` - Password inválido
- `Error del servidor` - Error técnico

### Ver Logs de Auditoría
```bash
# Endpoint para administradores
GET /api/auth/audit-logs

# Requiere autenticación
# Retorna últimos 100 intentos
```

Respuesta:
```json
[
  {
    "id": 1,
    "email": "demo@gravy.local",
    "subscriberId": "900123456",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "success": false,
    "failureReason": "Contraseña incorrecta",
    "attemptedAt": "2026-01-07T14:30:00.000Z"
  }
]
```

---

## 🚀 Comandos de Setup

### 1. Actualizar Base de Datos
```bash
npm run db:push
```
Esto creará la nueva tabla `login_attempts`.

### 2. Agregar Usuarios de Prueba
```bash
npm run db:seed-users
```

**Credenciales generadas:**
```
Usuario 1:
  Email: demo@gravy.local
  NIT: 900123456 (puedes usar: 900-123-456)
  Password: demo123

Usuario 2:
  Email: admin@gravy.local
  NIT: 9001234561
  Password: admin123
```

### 3. Iniciar Aplicación
```bash
npm run dev
```

---

## 🧪 Testing de Seguridad

### Test 1: Rate Limiting
```bash
# Hacer 6 intentos con contraseña incorrecta
# El 6to debe devolver HTTP 429
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"demo@gravy.local","subscriberId":"900123456","password":"wrong"}'
done
```

### Test 2: Validación de NIT
```bash
# NIT válido con guiones
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"demo@gravy.local","subscriberId":"900-123-456","password":"demo123"}'

# NIT inválido
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"demo@gravy.local","subscriberId":"abc123","password":"demo123"}'
# Debe devolver: "El formato del NIT es inválido"
```

### Test 3: Auditoría
```bash
# Hacer login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@gravy.local","subscriberId":"900123456","password":"demo123"}' \
  -c cookies.txt

# Ver logs (requiere sesión)
curl -X GET http://localhost:5000/api/auth/audit-logs \
  -b cookies.txt
```

---

## 📈 Métricas de Seguridad

### Protecciones Activas
- ✅ Contraseñas hasheadas (PBKDF2, 100k iteraciones)
- ✅ Sesiones seguras (HttpOnly, Secure en prod)
- ✅ Rate limiting por IP (5 intentos / 15min)
- ✅ Validación de formato NIT
- ✅ Auditoría completa de intentos
- ✅ Normalización de datos

### Próximas Mejoras Sugeridas
- [ ] **2FA/MFA** - Autenticación de dos factores
- [ ] **Captcha** - Después de 3 intentos fallidos
- [ ] **Email alerts** - Notificar intentos sospechosos
- [ ] **Geolocalización** - Detectar accesos desde IPs extrañas
- [ ] **Device fingerprinting** - Reconocer dispositivos
- [ ] **Password reset** - Recuperación de contraseña

---

## 🔍 Monitoreo

### Ver Estadísticas de Seguridad
```sql
-- Intentos fallidos en las últimas 24h
SELECT 
  COUNT(*) as total_attempts,
  SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed
FROM login_attempts
WHERE attempted_at > DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- IPs con más intentos fallidos
SELECT 
  ip_address,
  COUNT(*) as attempts,
  MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE success = 0
GROUP BY ip_address
ORDER BY attempts DESC
LIMIT 10;

-- Usuarios más atacados
SELECT 
  email,
  COUNT(*) as failed_attempts,
  MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE success = 0
GROUP BY email
ORDER BY failed_attempts DESC
LIMIT 10;
```

---

## 📝 Archivos Modificados

- ✅ `server/security.ts` (nuevo) - Funciones de validación y rate limiting
- ✅ `server/auth.ts` - Integración de seguridad en login
- ✅ `shared/schema.ts` - Tabla `login_attempts`
- ✅ `scripts/seed-users.ts` - NITs válidos de prueba
- ✅ `client/src/pages/LoginPage.tsx` - Manejo de rate limiting

---

**Status**: ✅ Listo para implementar

Ejecuta los comandos de setup y prueba el sistema de seguridad.
