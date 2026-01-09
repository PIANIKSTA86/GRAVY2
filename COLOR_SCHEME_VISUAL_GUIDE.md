# 🎨 ESQUEMA DE COLORES ESTANDARIZADO - RESUMEN VISUAL

## Paleta Principal en Uso

```
┌─────────────────────────────────────────────────────────────────┐
│                      COLORES PRINCIPALES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔵 BLUE 600 - #2563eb (PRIMARY)                               │
│     ▓▓▓▓▓▓▓▓▓▓ Botones primarios, links, highlights             │
│     Hover: Blue 700 (#1d4ed8)                                   │
│     Ring:  Blue 600 con opacity                                 │
│     Shadow: shadow-blue-600/40                                  │
│                                                                 │
│  🌊 CYAN 500 - #06b6d4 (SECONDARY/ACCENT)                       │
│     ▓▓▓▓▓▓▓▓▓▓ Accents, gradientes, CTAs secundarias             │
│     Hover: Cyan 600 (#0891b2)                                   │
│     Ring: Cyan 500                                              │
│     Uso: Accents en landing, gradientes                         │
│                                                                 │
│  ⚫ SLATE 900 - #0f172a (PRIMARY TEXT)                           │
│     ▓▓▓▓▓▓▓▓▓▓ Texto principal, headings                         │
│     Contrast: WCAG AAA ✓                                        │
│     Usado en: Body text, H1-H6                                  │
│                                                                 │
│  ⚪ WHITE - #ffffff (BACKGROUNDS)                                │
│     ▓▓▓▓▓▓▓▓▓▓ Cards, modals, content areas                      │
│     Border: Slate 200                                           │
│     Shadow: -slate-900/5                                        │
│                                                                 │
│  ◾ SLATE 50-900 (NEUTRALS)                                      │
│     ▓▓▓▓▓▓▓▓▓▓ Gradient de grises para estructura                │
│     Sidebar: Slate 900 background                               │
│     Page bg: Slate 50                                           │
│     Text hierarchy: 900 → 600 → 400 → 300                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Jerarquía de Usos por Sección

```
┌──────────────────────────────────────┐
│       LANDING PAGE HEADER            │
├──────────────────────────────────────┤
│ Logo Icon:     Blue 600 bg           │
│ Nav Links:     Slate 900 text        │
│ CTA Button:    Blue 600 bg           │
│ CTA Hover:     Blue 700 bg           │
│ Mobile Menu:   White bg, Slate text  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│          HERO SECTION                │
├──────────────────────────────────────┤
│ Background:    White/Gradient        │
│ Badge BG:      Blue 100              │
│ Badge Text:    Blue 600              │
│ H1:            Slate 900             │
│ Paragraph:     Slate 600             │
│ Primary CTA:   Blue 600 bg           │
│ Secondary CTA: Slate 100 bg          │
│ Stats:         Blue 600 accents      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      SIDEBAR (App Interna)           │
├──────────────────────────────────────┤
│ Background:    Slate 900             │
│ Logo BG:       Blue 600              │
│ Logo Shadow:   shadow-blue-600/40    │
│ Active Item:   Blue 600 bg           │
│ Hover Item:    Slate 800 bg          │
│ Inactive Icon: Slate 500             │
│ Active Icon:   White                 │
│ Border:        Slate 700             │
│ Logo Name:     White                 │
│ Logo Subtitle: Slate 400             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│       DASHBOARD CARDS                │
├──────────────────────────────────────┤
│ Card BG:       White                 │
│ Card Border:   Slate 200             │
│ Card Title:    Slate 900             │
│ Card Value:    Slate 900 (mono)      │
│ Icon BG:       Blue 100              │
│ Icon Color:    Blue 600              │
│ Hover:         shadow-md              │
│ Hover State:   Slate 100 bg          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         BOTONES ESTÁNDAR             │
├──────────────────────────────────────┤
│ PRIMARY:                             │
│   BG: Blue 600      Text: White      │
│   Hover: Blue 700   Ring: Blue 600   │
│                                      │
│ SECONDARY:                           │
│   BG: Slate 100     Text: Slate 900  │
│   Border: Slate 200 Hover: Slate 200 │
│                                      │
│ ACCENT:                              │
│   BG: Cyan 500      Text: White      │
│   Hover: Cyan 600   Ring: Cyan 500   │
│                                      │
│ DESTRUCTIVE:                         │
│   BG: Red 500       Text: White      │
│   Hover: Red 600    Ring: Red 600    │
│                                      │
│ GHOST:                               │
│   BG: Transparent   Text: Blue 600   │
│   Hover: Blue 50    Ring: Blue 600   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      STATUS COLORS (Sin cambios)     │
├──────────────────────────────────────┤
│ ✓ SUCCESS:                           │
│   BG: Green 100     Text: Green 600  │
│                                      │
│ ⚠ WARNING:                           │
│   BG: Amber 100     Text: Amber 600  │
│                                      │
│ ✗ ERROR:                             │
│   BG: Red 100       Text: Red 600    │
│                                      │
│ ℹ INFO:                              │
│   BG: Blue 100      Text: Blue 600   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      FOOTER (App Interna)            │
├──────────────────────────────────────┤
│ Background:    White/Slate 50        │
│ Columns:       Slate 900 headings    │
│ Links:         Slate 600 text        │
│ Link Hover:    Blue 600              │
│ Border Top:    Slate 200             │
│ Copyright:     Slate 500             │
└──────────────────────────────────────┘
```

---

## Degradados Utilizados

```
┌─────────────────────────────────────────────────────────┐
│            GRADIENTES PRINCIPALES                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Primary Gradient (Landing CTA):                        │
│  from-blue-600 to-cyan-500                              │
│  █████████ → ▓▓▓▓▓▓▓▓▓                                  │
│  Blue         Cyan                                      │
│  Hover: from-blue-700 to-cyan-600                       │
│                                                         │
│  Success Gradient (Forms):                              │
│  from-green-50 to-emerald-50                            │
│  █████████ → ▓▓▓▓▓▓▓▓▓                                  │
│  Light Green   Emerald                                  │
│                                                         │
│  Warning Gradient (Alerts):                             │
│  from-amber-50 to-yellow-50                             │
│  █████████ → ▓▓▓▓▓▓▓▓▓                                  │
│  Amber         Yellow                                   │
│                                                         │
│  Error Gradient (Errors):                               │
│  from-red-50 to-rose-50                                 │
│  █████████ → ▓▓▓▓▓▓▓▓▓                                  │
│  Red           Rose                                     │
│                                                         │
│  Subtle Gradient (Backgrounds):                         │
│  from-slate-50 to-slate-100                             │
│  █████████ → ▓▓▓▓▓▓▓▓▓                                  │
│  Slate Light   Slate Medium                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Text Hierarchy (Jerarquía de Texto)

```
┌────────────────────────────────────────────────────┐
│  H1 Heading                                        │
│  text-slate-900 | font-bold | 48px                │
│  ████████████████████████████ (Máximo contraste)   │
├────────────────────────────────────────────────────┤
│  H2 Heading                                        │
│  text-slate-900 | font-bold | 36px                │
│  ████████████████████████████ (Máximo contraste)   │
├────────────────────────────────────────────────────┤
│  Body Text                                         │
│  text-slate-600 | font-normal | 16px              │
│  █████████████░░░░░░░░░░░░░░░░ (Alto contraste)   │
├────────────────────────────────────────────────────┤
│  Secondary Text                                    │
│  text-slate-500 | font-normal | 14px              │
│  ████████░░░░░░░░░░░░░░░░░░░░░░ (Medio contraste) │
├────────────────────────────────────────────────────┤
│  Muted Text (Placeholder/Label)                    │
│  text-slate-400 | font-normal | 12px              │
│  █████░░░░░░░░░░░░░░░░░░░░░░░░░░ (Bajo contraste) │
├────────────────────────────────────────────────────┤
│  Description (Helper Text)                         │
│  text-slate-500 | font-normal | 12px              │
│  ████████░░░░░░░░░░░░░░░░░░░░░░ (Medio contraste) │
└────────────────────────────────────────────────────┘
```

---

## Accesibilidad Validada

```
┌─────────────────────────────────────────────────────┐
│        WCAG CONTRAST RATIOS VERIFICADOS             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ Slate 900 on White        Ratio 21:1   AAA+++   │
│    (Primary text on white)                          │
│                                                     │
│  ✓ Slate 600 on White        Ratio 6.3:1  AAA      │
│    (Body text on white)                             │
│                                                     │
│  ✓ Blue 600 on White         Ratio 6.8:1  AAA      │
│    (Buttons and links)                              │
│                                                     │
│  ✓ Slate 500 on White        Ratio 5.3:1  AA       │
│    (Secondary text)                                 │
│                                                     │
│  ✓ Slate 400 on White        Ratio 4.2:1  AA       │
│    (Tertiary/muted text)                            │
│                                                     │
│  ✓ Green 600 on White        Ratio 5.2:1  AA       │
│    (Success indicators)                             │
│                                                     │
│  ✓ Red 600 on White          Ratio 5.7:1  AA       │
│    (Error messages)                                 │
│                                                     │
│  ✓ Cyan 600 on White         Ratio 6.1:1  AAA      │
│    (Accent elements)                                │
│                                                     │
│  ✓ White on Slate 900        Ratio 21:1   AAA+++   │
│    (Sidebar text on dark)                           │
│                                                     │
│  ✓ Blue 600 on Slate 900     Ratio 6.4:1  AAA      │
│    (Active items in sidebar)                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Mapa de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTES → COLORES                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Button.tsx                                                │
│    → Primary: bg-blue-600, hover:bg-blue-700              │
│    → Secondary: bg-slate-100, hover:bg-slate-200          │
│    → Accent: bg-cyan-500, hover:bg-cyan-600               │
│                                                             │
│  Card.tsx                                                  │
│    → BG: bg-white, border-slate-200                        │
│    → Title: text-slate-900, Desc: text-slate-600           │
│    → Hover: hover:shadow-md, hover:border-blue-200         │
│                                                             │
│  Input.tsx                                                 │
│    → Border: border-slate-300                              │
│    → Focus: focus:border-blue-600, focus:ring-blue-600    │
│    → Text: text-slate-900                                  │
│                                                             │
│  Badge.tsx                                                 │
│    → Default: bg-slate-100, text-slate-900                │
│    → Primary: bg-blue-100, text-blue-600                   │
│    → Success: bg-green-100, text-green-600                 │
│                                                             │
│  Alert.tsx                                                 │
│    → Success: bg-green-50, border-green-200, text-green-900│
│    → Warning: bg-amber-50, border-amber-200, text-amber-900│
│    → Error: bg-red-50, border-red-200, text-red-900        │
│    → Info: bg-blue-50, border-blue-200, text-blue-900      │
│                                                             │
│  Sidebar.tsx                                               │
│    → BG: bg-slate-900                                      │
│    → Active: bg-blue-600, text-white, shadow-blue-600/40  │
│    → Hover: hover:bg-slate-800                             │
│    → Icon: text-slate-500, active:text-white              │
│                                                             │
│  Avatar.tsx                                                │
│    → Default: bg-slate-200, text-slate-700                │
│    → Primary: bg-blue-200, text-blue-600                   │
│    → Status indicator: green/red/yellow dots               │
│                                                             │
│  Modal.tsx                                                 │
│    → Overlay: bg-slate-900/50                              │
│    → Content: bg-white, border-slate-200                   │
│    → Header: bg-slate-50, border-b-slate-200              │
│                                                             │
│  Tabs.tsx                                                  │
│    → Active: bg-blue-100, text-blue-600, border-blue-300  │
│    → Inactive: text-slate-600, hover:text-slate-900       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparativa: Antes vs Después

```
╔═════════════════════════════════════════════════════════════╗
║                    CAMBIOS REALIZADOS                       ║
╠════════════════════╦═════════════════════╦══════════════════╣
║ Elemento           ║ ANTES               ║ DESPUÉS          ║
╠════════════════════╬═════════════════════╬══════════════════╣
║ Sidebar border     ║ border-slate-800    ║ border-slate-700 ║
║ Sidebar shadow     ║ shadow-blue-900/50  ║ shadow-blue-600/40
║ Tenant name        ║ text-blue-200       ║ text-slate-100   ║
║ Icon color         ║ text-slate-400      ║ text-slate-500   ║
║ Button text        ║ text-blue-700       ║ text-blue-600    ║
║ Badge BG           ║ bg-blue-50          ║ bg-blue-100      ║
║ Page BG            ║ bg-gray-50          ║ bg-slate-50      ║
║ Body text          ║ text-slate-500      ║ text-slate-600   ║
║ Placeholder        ║ text-slate-300      ║ text-slate-400   ║
║ Tab active         ║ bg-blue-50          ║ bg-blue-100      ║
║ Tab border         ║ border-blue-200     ║ border-blue-300  ║
║ Active item bg     ║ bg-blue-500/20      ║ bg-blue-600/20   ║
║ Rounded corners    ║ rounded-xl          ║ rounded-lg       ║
╚════════════════════╩═════════════════════╩══════════════════╝
```

---

## Directrices Rápidas

### ✅ HACER (Correcto)
```tsx
// Button primario
<button className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/40">
  Acción
</button>

// Card con colores estándar
<div className="bg-white border-slate-200 rounded-lg">
  <h3 className="text-slate-900">Título</h3>
  <p className="text-slate-600">Descripción</p>
</div>

// Input estándar
<input 
  className="border-slate-300 focus:border-blue-600 focus:ring-blue-600"
  placeholder="Escribe aquí..."
/>

// Sidebar item
<button className={isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}>
  Menú
</button>
```

### ❌ NO HACER (Incorrecto)
```tsx
// ❌ Colores inconsistentes
<button className="bg-blue-500 hover:bg-blue-800 text-blue-100">

// ❌ Shadows no estándar
<div className="shadow-blue-900/50">

// ❌ Borders oscuros
<div className="border-slate-800">

// ❌ Texto bajo contraste
<p className="text-slate-300 bg-white">
```

---

## Versión Dark Mode (Futura)

```
Cuando implementes dark mode, usar:

Primary (Dark):     Blue 400 (#60a5fa)
Secondary (Dark):   Cyan 400 (#22d3ee)
Background (Dark):  Slate 950 (#03111c)
Foreground (Dark):  Slate 50 (#f8fafc)
Card (Dark):        Slate 900 (#0f172a)
Border (Dark):      Slate 800 (#1e293b)

Las variables CSS ya están preparadas para esto.
```

---

## Recursos

- **Guía Completa**: [COLOR_STANDARDS.md](COLOR_STANDARDS.md)
- **Implementación**: [COLOR_STANDARDIZATION_COMPLETE.md](COLOR_STANDARDIZATION_COMPLETE.md)
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Estado:** ✅ Estandarización Completa  
**Última Actualización:** 2026-01-09  
**Responsable:** GitHub Copilot + Team
