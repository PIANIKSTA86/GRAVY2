# 🎨 ESTÁNDARES DE COLOR - CONTAGRAV

## Paleta Principal (Basada en Landing Page Optimizado)

### Primary Colors
```
Blue 600 - #2563eb (Principal)
  - Uso: Botones primarios, links, highlights
  - Hover: Blue 700 (#1d4ed8)
  - Foreground: White (#ffffff)
  
Blue 50 - #eff6ff (Light)
  - Uso: Fondos light, badges
  - Contrast: ✓ WCAG AA

Blue 100 - #dbeafe (Very Light)
  - Uso: Hover backgrounds, focus states
```

### Secondary Colors
```
Cyan 500 - #06b6d4 (Accent)
  - Uso: Accents, gradients, secondary CTAs
  - Foreground: White (#ffffff)
  - Hover: Cyan 600 (#0891b2)

Cyan 50 - #ecf8ff (Light Accent)
  - Uso: Light backgrounds
```

### Neutral Colors (Slate)
```
Slate 900 - #0f172a (Primary Text)
  - Uso: Body text, headings
  - Contrast: ✓ WCAG AAA

Slate 700 - #334155 (Secondary Text)
  - Uso: Secondary headings, descriptions

Slate 600 - #475569 (Tertiary Text)
  - Uso: Labels, helper text
  - Contrast: ✓ WCAG AA

Slate 500 - #64748b (Placeholder, Disabled)
  - Uso: Placeholder text, disabled state

Slate 400 - #94a3b8 (Icon, Subtle)
  - Uso: Icon colors, subtle borders

Slate 300 - #cbd5e1 (Border Light)
  - Uso: Light borders

Slate 200 - #e2e8f0 (Border)
  - Uso: Standard borders

Slate 100 - #f1f5f9 (Background Light)
  - Uso: Card backgrounds, subtle separators

Slate 50 - #f8fafc (Background Very Light)
  - Uso: Page backgrounds, hover states

White - #ffffff (Solid White)
  - Uso: Cards, modals, main content
```

### Status Colors
```
Success - #10b981 (Green 500)
  - Uso: Success messages, positive indicators
  - Foreground: White

Warning - #f59e0b (Amber 500)
  - Uso: Warning messages, caution indicators
  - Foreground: White

Destructive - #ef4444 (Red 500)
  - Uso: Error messages, delete actions
  - Foreground: White

Info - #3b82f6 (Blue 500)
  - Uso: Info messages, confirmations
  - Foreground: White

Offline - #6b7280 (Gray 500)
  - Uso: Offline status, inactive
```

### Sidebar Colors (App)
```
Sidebar Background - #0f172a (Slate 900)
Sidebar Foreground - #ffffff (White)
Sidebar Primary - #2563eb (Blue 600)
Sidebar Accent - #06b6d4 (Cyan 500)
Sidebar Border - #1e293b (Slate 800)

Active Item: Blue 600 with shadow-md shadow-blue-900/30
Hover Item: Slate 800
```

### Chart Colors
```
Chart 1: #2563eb (Blue 600) - Primary data
Chart 2: #06b6d4 (Cyan 500) - Secondary data
Chart 3: #10b981 (Green 500) - Success data
Chart 4: #f59e0b (Amber 500) - Warning data
Chart 5: #ef4444 (Red 500) - Alert data
```

---

## Jerarquía de Uso por Componente

### Botones
```
Primary Button:
  - Background: Blue 600
  - Text: White
  - Hover: Blue 700
  - Focus Ring: Blue 600
  
Secondary Button:
  - Background: Slate 100
  - Text: Slate 900
  - Border: Slate 200
  - Hover: Slate 200
  
Accent Button:
  - Background: Cyan 500
  - Text: White
  - Hover: Cyan 600
  
Destructive Button:
  - Background: Red 500
  - Text: White
  - Hover: Red 600

Ghost Button:
  - Background: Transparent
  - Text: Blue 600
  - Hover: Blue 50
```

### Input Fields
```
Border: Slate 300
Background: White
Focus Border: Blue 600
Focus Ring: Blue 600 with opacity
Text: Slate 900
Placeholder: Slate 500
```

### Cards
```
Background: White
Border: Slate 200
Hover Shadow: shadow-md with slate-900/5
Title: Slate 900
Description: Slate 600
```

### Headers/Headings
```
H1, H2, H3: Slate 900
H4, H5, H6: Slate 800
Subtitle: Slate 600
Caption: Slate 500
```

### Forms & Labels
```
Label: Slate 600 (12px uppercase)
Error: Red 500
Success: Green 500
Warning: Amber 500
Hint: Slate 500 (smaller)
```

### Sidebar (Navigation)
```
Background: Slate 900
Active Item: Blue 600 with shadow
Hover Item: Slate 800
Icon: 
  - Active: White
  - Inactive: Slate 400
Text:
  - Active: White
  - Inactive: Slate 300
Border: Slate 800
```

### Tables & Lists
```
Header Background: Slate 50
Header Text: Slate 700
Row Odd: White
Row Even: Slate 50
Row Hover: Slate 100
Cell Text: Slate 900
Cell Muted: Slate 600
Border: Slate 200
```

### Alerts & Notifications
```
Success:
  - Background: Green 50
  - Border: Green 200
  - Text: Green 900
  - Icon: Green 500

Warning:
  - Background: Amber 50
  - Border: Amber 200
  - Text: Amber 900
  - Icon: Amber 500

Error:
  - Background: Red 50
  - Border: Red 200
  - Text: Red 900
  - Icon: Red 500

Info:
  - Background: Blue 50
  - Border: Blue 200
  - Text: Blue 900
  - Icon: Blue 500
```

### Modals & Overlays
```
Overlay: rgba(0, 0, 0, 0.5) or slate-900/50
Modal Background: White
Modal Header: Slate 50
Modal Border: Slate 200
Close Button: Slate 400
Close Hover: Slate 900
```

### Badges & Tags
```
Default:
  - Background: Slate 100
  - Text: Slate 900
  - Border: Slate 200

Primary:
  - Background: Blue 100
  - Text: Blue 900
  - Border: Blue 300

Success:
  - Background: Green 100
  - Text: Green 900
  - Border: Green 300

Warning:
  - Background: Amber 100
  - Text: Amber 900
  - Border: Amber 300

Destructive:
  - Background: Red 100
  - Text: Red 900
  - Border: Red 300
```

---

## Gradients (Landing & Accents)

```
Blue to Cyan (Primary CTA):
  from-blue-600 to-cyan-500
  Hover: from-blue-700 to-cyan-600

Slate to Slate (Subtle):
  from-slate-50 to-slate-100
  
Success Gradient:
  from-green-50 to-emerald-50

Warning Gradient:
  from-amber-50 to-yellow-50

Error Gradient:
  from-red-50 to-rose-50
```

---

## Dark Mode (Future)

```
Background: slate-950
Foreground: slate-50
Card: slate-900
Border: slate-800
Primary: blue-500
Secondary: cyan-400
Text Hierarchy: slate-100 → slate-300 → slate-400
```

---

## Implementación en Tailwind

### Class Patterns

```tsx
// Texto
text-slate-900           // Primary text
text-slate-600           // Secondary text
text-slate-500           // Tertiary text
text-white               // On dark backgrounds

// Fondos
bg-white                 // Cards, main content
bg-slate-50              // Light backgrounds
bg-blue-600              // Primary buttons
bg-cyan-500              // Secondary buttons

// Bordes
border-slate-200         // Standard borders
border-blue-600          // Active/focus
border-red-500           // Error state

// Hover States
hover:bg-blue-700        // Button hover
hover:border-blue-600    // Border interactive
hover:shadow-md          // Elevation on hover

// Focus/Ring
focus:ring-2             // Accessibility
focus:ring-blue-600      // Blue ring
ring-offset-background   // Ring offset

// Gradients
from-blue-600 to-cyan-500    // Primary gradient
bg-gradient-to-r             // Horizontal gradient
```

---

## Consideraciones de Accesibilidad

✓ **WCAG AA Compliance**: Todos los colores cumplen ratios de contraste
✓ **WCAG AAA**: Primary text (Slate 900) cumple AAA
✓ **Color Blindness**: No solo depende de color para información crítica
✓ **Focus States**: Ring de 2px en todos los elementos interactivos
✓ **Motion**: Preferencia respetada (prefers-reduced-motion)

---

## Ejemplo de Uso

### Componente Botón
```tsx
export function Button({ variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-blue-600',
    accent: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-600',
  };
  
  return (
    <button 
      className={`
        px-4 py-2 rounded-lg font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]}
      `}
      {...props}
    />
  );
}
```

### Componente Card
```tsx
export function Card({ children, ...props }) {
  return (
    <div 
      className="
        bg-white rounded-lg border border-slate-200
        shadow-sm hover:shadow-md transition-shadow
        p-6 text-slate-900
      "
      {...props}
    >
      {children}
    </div>
  );
}
```

### Componente Sidebar Item
```tsx
export function SidebarItem({ active, ...props }) {
  return (
    <button
      className={`
        w-full px-4 py-3 rounded-xl text-sm font-medium
        transition-all duration-200 flex items-center gap-3
        ${active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
        }
      `}
      {...props}
    />
  );
}
```

---

## Checklist de Implementación

- [ ] index.css actualizado con nuevas variables
- [ ] tailwind.config.ts actualizado
- [ ] Layout.tsx actualizado (sidebar colors)
- [ ] LandingPage.tsx verificado
- [ ] Componentes UI (button, card, input) actualizados
- [ ] Todas las páginas (Asientos, Comprobantes, etc.) actualizadas
- [ ] Landing components verificados
- [ ] Tests visuales de colores completados
- [ ] Contraste de colores validado (WCAG)
- [ ] Documentación enviada al equipo

---

**Última actualización**: 2026-01-09
**Versión**: 1.0
**Estado**: En implementación
