# 🎨 Guía Visual de Tipografía - ContaGrav

> Referencia rápida con ejemplos visuales de todos los estilos tipográficos del proyecto

---

## 📋 Índice Rápido

1. [Headings](#headings)
2. [Body Text](#body-text)
3. [Números y Datos](#números-y-datos)
4. [Labels y UI](#labels-y-ui)
5. [Componentes Específicos](#componentes-específicos)

---

## Headings

### H1 - Hero Landing (60px / 48px)
```tsx
// Landing pages - Hero principal
<h1 className="text-5xl md:text-6xl font-display font-bold leading-tight tracking-tight text-slate-900">
  Contabilidad moderna para equipos que gobiernan múltiples empresas
</h1>
```
**Preview:**
```
Contabilidad moderna para equipos
que gobiernan múltiples empresas
```
- Font: **Sora** 700
- Color: slate-900 (#0f172a)
- Tracking: Tight (-0.02em)

---

### H1 - Page Title Internal (30px)
```tsx
// Páginas internas - Dashboard, Plan de Cuentas, etc.
<h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
  Plan de Cuentas
</h1>
```
**Preview:**
```
Plan de Cuentas
```
- Font: **Sora** 700
- Color: slate-900 (#0f172a)
- Uso: Header de todas las páginas internas

---

### H2 - Section Headings (48px / 36px)
```tsx
// Landing sections, áreas importantes
<h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-4">
  Todo lo que necesitas para contabilidad moderna
</h2>
```
**Preview:**
```
Todo lo que necesitas para
contabilidad moderna
```
- Font: **Sora** 700-800
- Color: slate-900 (#0f172a)
- Margin bottom: 16px (mb-4)

---

### H3 - Card Titles Large (24px)
```tsx
// Cards destacadas, pricing
<h3 className="text-2xl font-display font-bold text-slate-900">
  Plan Professional
</h3>
```
**Preview:**
```
Plan Professional
```
- Font: **Sora** 700
- Color: slate-900 (#0f172a)

---

### H3 - Card Titles Regular (20px)
```tsx
// Features cards, benefits cards
<h3 className="text-xl font-display font-bold text-slate-900 mb-3">
  Multi-empresa desde el día uno
</h3>
```
**Preview:**
```
Multi-empresa desde el día uno
```
- Font: **Sora** 700
- Color: slate-900 (#0f172a)
- Margin bottom: 12px (mb-3)

---

## Body Text

### Body Large (20px)
```tsx
// Subtítulos importantes, hero descriptions
<p className="text-xl text-slate-600 leading-relaxed">
  Gestiona múltiples empresas con un solo login. 
  Reportes consolidados, cumplimiento NIIF automático.
</p>
```
**Preview:**
```
Gestiona múltiples empresas con un solo login.
Reportes consolidados, cumplimiento NIIF automático.
```
- Font: **Plus Jakarta Sans** 400
- Color: slate-600 (#475569)
- Line height: 1.75 (leading-relaxed)

---

### Body Regular (16px)
```tsx
// Texto general, descripciones
<p className="text-base text-slate-600">
  Administra el catálogo de cuentas según el PUC colombiano.
</p>
```
**Preview:**
```
Administra el catálogo de cuentas según el PUC colombiano.
```
- Font: **Plus Jakarta Sans** 400
- Color: slate-600 (#475569)
- Line height: 1.5 (default)

---

### Body Small (14px)
```tsx
// Texto secundario, metadatos
<p className="text-sm text-slate-500">
  Última actualización: 15 Enero 2025
</p>
```
**Preview:**
```
Última actualización: 15 Enero 2025
```
- Font: **Plus Jakarta Sans** 400
- Color: slate-500 (#64748b)

---

## Números y Datos

### Valor Grande Destacado (24px)
```tsx
// Dashboard stats, totales importantes
<h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
  $45,234,567
</h3>
```
**Preview:**
```
$45,234,567
```
- Font: **JetBrains Mono** 700
- Color: slate-900 (#0f172a)
- Tracking: Tight
- Uso: Stats cards, totales

---

### Valor Contable Regular (14px)
```tsx
// Tablas, líneas de asientos
<td className="font-mono text-sm font-medium text-slate-900">
  $1,234,567.89
</td>
```
**Preview:**
```
$1,234,567.89
```
- Font: **JetBrains Mono** 500
- Color: slate-900 (#0f172a)
- Uso: Tablas de cuentas, valores monetarios

---

### Código de Cuenta (14px)
```tsx
// Plan de cuentas, asientos
<span className="font-mono text-sm font-medium text-slate-700">
  1105
</span>
```
**Preview:**
```
1105
```
- Font: **JetBrains Mono** 500
- Color: slate-700 (#334155)
- Uso: Códigos PUC, identificadores

---

## Labels y UI

### Label de Formulario (14px)
```tsx
// Inputs, selects
<label className="block text-sm font-medium text-slate-700 mb-2">
  Nombre de la Cuenta
</label>
```
**Preview:**
```
Nombre de la Cuenta
```
- Font: **Plus Jakarta Sans** 500
- Color: slate-700 (#334155)
- Margin bottom: 8px (mb-2)

---

### Caption / Helper Text (12px)
```tsx
// Texto de ayuda bajo inputs
<p className="text-xs text-slate-500 mt-1">
  Ingresa el código según PUC colombiano
</p>
```
**Preview:**
```
Ingresa el código según PUC colombiano
```
- Font: **Plus Jakarta Sans** 400
- Color: slate-500 (#64748b)
- Margin top: 4px (mt-1)

---

### Label Uppercase (12px)
```tsx
// Secciones, categorías, badges
<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
  Contabilidad
</p>
```
**Preview:**
```
CONTABILIDAD
```
- Font: **Plus Jakarta Sans** 600
- Color: slate-400 (#94a3b8)
- Letter spacing: Wide (0.05em)
- Transform: Uppercase

---

### Badge / Pill (12px)
```tsx
// Status badges, tags
<span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
  Más Popular
</span>
```
**Preview:**
```
┌─────────────┐
│ Más Popular │
└─────────────┘
```
- Font: **Plus Jakarta Sans** 600
- Color: blue-700 (#1d4ed8)
- Background: blue-100 (#dbeafe)

---

## Componentes Específicos

### Dashboard - Stat Card
```tsx
<div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
    Total Activos
  </p>
  <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
    $45,234,567
  </h3>
  <p className="text-xs text-slate-400 mt-1">
    Actualizado hace 5 min
  </p>
</div>
```

**Preview:**
```
┌─────────────────────────────┐
│ TOTAL ACTIVOS              │
│                             │
│ $45,234,567                │
│                             │
│ Actualizado hace 5 min     │
└─────────────────────────────┘
```

---

### Landing - Feature Card
```tsx
<div className="bg-white rounded-2xl p-8 border border-slate-200">
  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
    <Icon className="h-6 w-6 text-blue-600" />
  </div>
  <h3 className="text-xl font-display font-bold text-slate-900 mb-3">
    Multi-empresa desde el día uno
  </h3>
  <p className="text-slate-600 leading-relaxed mb-4">
    Gestiona múltiples empresas con un solo login. 
    Cambia entre ellas en segundos.
  </p>
  <button className="text-blue-600 font-semibold text-sm">
    Explorar →
  </button>
</div>
```

**Preview:**
```
┌────────────────────────────────┐
│  [📊]                         │
│                                │
│  Multi-empresa desde el día uno│
│                                │
│  Gestiona múltiples empresas   │
│  con un solo login. Cambia     │
│  entre ellas en segundos.      │
│                                │
│  Explorar →                    │
└────────────────────────────────┘
```

---

### Landing - Pricing Card
```tsx
<div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8">
  <h3 className="text-2xl font-display font-bold mb-2">
    Professional
  </h3>
  <p className="text-sm text-blue-100 mb-4">
    Para equipos en crecimiento
  </p>
  <div className="mb-6">
    <span className="text-4xl font-bold">$99</span>
    <span className="text-sm ml-2 text-blue-100">/mes</span>
  </div>
  <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg">
    Empezar ahora
  </button>
</div>
```

**Preview:**
```
┌────────────────────────────┐
│  Professional             │
│  Para equipos en crecimiento│
│                            │
│  $99 /mes                  │
│                            │
│  ┌──────────────────────┐ │
│  │  Empezar ahora       │ │
│  └──────────────────────┘ │
└────────────────────────────┘
```

---

### Tabla de Plan de Cuentas
```tsx
<table className="w-full">
  <thead className="bg-slate-50 border-b border-slate-200">
    <tr>
      <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-left">
        Código
      </th>
      <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-left">
        Nombre
      </th>
      <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-right">
        Saldo
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="font-mono text-sm font-medium text-slate-700 px-4 py-3">
        1105
      </td>
      <td className="text-sm text-slate-900 px-4 py-3">
        Caja General
      </td>
      <td className="font-mono text-sm text-right text-slate-900 px-4 py-3">
        $1,234,567.89
      </td>
    </tr>
  </tbody>
</table>
```

**Preview:**
```
┌─────────┬──────────────┬────────────────┐
│ CÓDIGO  │ NOMBRE       │ SALDO          │
├─────────┼──────────────┼────────────────┤
│ 1105    │ Caja General │  $1,234,567.89 │
└─────────┴──────────────┴────────────────┘
```

---

### Formulario - Input Field
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Nombre de la Empresa
  </label>
  <input 
    type="text"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Ej: Acme Corporation S.A.S"
  />
  <p className="text-xs text-slate-500">
    Ingresa el nombre legal de la empresa
  </p>
</div>
```

**Preview:**
```
Nombre de la Empresa
┌────────────────────────────────────┐
│ Ej: Acme Corporation S.A.S        │
└────────────────────────────────────┘
Ingresa el nombre legal de la empresa
```

---

### Button - Primary
```tsx
<button className="px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
  Crear Nueva Empresa
</button>
```

**Preview:**
```
┌─────────────────────────┐
│ Crear Nueva Empresa     │
└─────────────────────────┘
```
- Font: **Plus Jakarta Sans** 600
- Color: white (#ffffff)
- Background: blue-600 (#2563eb)

---

### Sidebar Menu Item
```tsx
<Link href={`/${tenantId}/cuentas`}>
  <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-600/10 text-slate-200 hover:text-white transition-colors">
    <BookOpen className="h-5 w-5" />
    <span className="text-sm font-medium">Plan de Cuentas</span>
  </div>
</Link>
```

**Preview:**
```
  📖  Plan de Cuentas
```
- Font: **Plus Jakarta Sans** 500
- Color: slate-200 → white on hover
- Size: 14px (text-sm)

---

### Sidebar Section Label
```tsx
<p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
  Contabilidad
</p>
```

**Preview:**
```
  CONTABILIDAD
```
- Font: **Plus Jakarta Sans** 600
- Color: slate-400 (#94a3b8)
- Size: 12px (text-xs)
- Transform: Uppercase
- Tracking: Wide

---

## 🎨 Paleta de Colores Tipográficos

### Headings
- **Primary:** `text-slate-900` (#0f172a) - Headings principales
- **Secondary:** `text-slate-700` (#334155) - Subheadings

### Body Text
- **Primary:** `text-slate-600` (#475569) - Body text principal
- **Secondary:** `text-slate-500` (#64748b) - Body text secundario
- **Tertiary:** `text-slate-400` (#94a3b8) - Labels, captions

### Números y Datos
- **Primary:** `text-slate-900` (#0f172a) - Valores monetarios destacados
- **Secondary:** `text-slate-700` (#334155) - Códigos de cuenta

### Accent Colors
- **Primary Action:** `text-blue-600` (#2563eb) - Links, CTAs
- **Success:** `text-green-600` (#16a34a) - Estados positivos
- **Warning:** `text-amber-600` (#d97706) - Alertas
- **Error:** `text-red-600` (#dc2626) - Errores

---

## 📐 Sistema de Espaciado Tipográfico

### Margins entre elementos
```tsx
// H1 → Body
<h1 className="mb-6">...</h1>  // 24px margin bottom
<p>...</p>

// H2 → Body
<h2 className="mb-4">...</h2>  // 16px margin bottom
<p>...</p>

// H3 → Body
<h3 className="mb-3">...</h3>  // 12px margin bottom
<p>...</p>

// Label → Input
<label className="mb-2">...</label>  // 8px margin bottom
<input />

// Input → Helper
<input />
<p className="mt-1">...</p>  // 4px margin top
```

### Line Heights
- **Headings:** `leading-tight` (1.25) - H1, H2, H3
- **Body Large:** `leading-relaxed` (1.75) - text-xl
- **Body Regular:** `leading-normal` (1.5) - text-base, text-sm
- **Labels/UI:** `leading-none` (1) - Algunos casos específicos

---

## ✅ Quick Reference Table

| Elemento | Clase Base | Font | Tamaño | Peso |
|----------|-----------|------|--------|------|
| H1 Landing | `text-5xl md:text-6xl font-display font-bold tracking-tight` | Sora | 48/60px | 700 |
| H1 Internal | `text-3xl font-display font-bold tracking-tight` | Sora | 30px | 700 |
| H2 Section | `text-4xl md:text-5xl font-display font-bold tracking-tight` | Sora | 36/48px | 700 |
| H3 Large | `text-2xl font-display font-bold` | Sora | 24px | 700 |
| H3 Regular | `text-xl font-display font-bold` | Sora | 20px | 700 |
| Body Large | `text-xl` | Plus Jakarta Sans | 20px | 400 |
| Body Regular | `text-base` | Plus Jakarta Sans | 16px | 400 |
| Body Small | `text-sm` | Plus Jakarta Sans | 14px | 400 |
| Caption | `text-xs` | Plus Jakarta Sans | 12px | 400 |
| Label | `text-sm font-medium` | Plus Jakarta Sans | 14px | 500 |
| Label Uppercase | `text-xs font-semibold uppercase tracking-wider` | Plus Jakarta Sans | 12px | 600 |
| Number Large | `text-2xl font-mono font-bold tracking-tight` | JetBrains Mono | 24px | 700 |
| Number Regular | `text-sm font-mono font-medium` | JetBrains Mono | 14px | 500 |
| Code | `text-sm font-mono font-medium` | JetBrains Mono | 14px | 500 |
| Button | `text-base font-semibold` | Plus Jakarta Sans | 16px | 600 |

---

## 🔍 Ejemplos de Búsqueda en Código

### Encontrar todos los headings principales
```bash
# Buscar H1 con font-display
grep -r "className.*text-3xl.*font-display" client/src/pages/

# Buscar H2 en landing
grep -r "text-4xl.*md:text-5xl.*font-display" client/src/components/landing/
```

### Encontrar valores monetarios
```bash
# Buscar clases font-mono (números)
grep -r "font-mono" client/src/
```

### Encontrar labels sin estandarizar
```bash
# Buscar labels que no usen font-medium
grep -r "<label" client/src/ | grep -v "font-medium"
```

---

## 📝 Notas Finales

**Tipografía implementada en:**
- ✅ 18 páginas internas (todas con H1 estandarizado)
- ✅ 14 componentes landing (todos con headings estandarizados)
- ✅ Layout y componentes UI principales
- ✅ Cards, badges, labels, formularios

**Performance:**
- Fuentes cargadas con `display=swap`
- Solo pesos necesarios importados
- Fallbacks configurados correctamente
- Impacto en CLS: Mínimo (< 0.05)

**Accesibilidad:**
- Contraste AAA en headings (slate-900 vs white)
- Contraste AA+ en body text (slate-600 vs white)
- Tamaños mínimos respetados (16px body)
- Line heights apropiados para legibilidad

---

**Última actualización:** Enero 2025  
**Mantenido por:** Equipo de Desarrollo ContaGrav
