# 📝 Estándares de Tipografía - ContaGrav

## 🎯 Filosofía Tipográfica

ContaGrav utiliza un sistema de tipografía profesional diseñado específicamente para aplicaciones SaaS contables/empresariales. El esquema combina modernidad, legibilidad y confianza profesional.

---

## 🔤 Familias de Fuentes

### **Primary Sans - Plus Jakarta Sans**
```css
font-family: "Plus Jakarta Sans", "Inter", "system-ui", sans-serif;
```
- **Uso:** Interfaz general, textos de cuerpo, navegación, botones, formularios
- **Pesos:** 300, 400, 500, 600, 700, 800
- **Características:** Moderna, limpia, geométrica, altamente legible
- **Clase Tailwind:** `font-sans` (aplicada por defecto)

### **Display Font - Sora**
```css
font-family: "Sora", "Plus Jakarta Sans", sans-serif;
```
- **Uso:** Títulos principales (H1, H2), hero headings, encabezados de sección
- **Pesos:** 400, 500, 600, 700, 800
- **Características:** Geométrica, impactante, moderna, excelente para headings grandes
- **Clase Tailwind:** `font-display`

### **Monospace - JetBrains Mono**
```css
font-family: "JetBrains Mono", "Consolas", monospace;
```
- **Uso:** Datos numéricos, códigos de cuenta, identificadores, valores contables
- **Pesos:** 400, 500, 600, 700
- **Características:** Altamente legible para números, espaciado uniforme
- **Clase Tailwind:** `font-mono`

---

## 📏 Jerarquía Tipográfica

### **H1 - Hero Headlines (Landing)**
```tsx
className="text-5xl md:text-6xl font-display font-bold leading-tight tracking-tight text-slate-900"
```
- **Tamaño:** 48px móvil / 60px desktop
- **Font:** Sora (Display)
- **Peso:** 700-800 (Bold)
- **Tracking:** Tight (-0.02em)
- **Uso:** Títulos principales de landing page

### **H1 - Page Titles (Internal)**
```tsx
className="text-3xl font-display font-bold text-slate-900 tracking-tight"
```
- **Tamaño:** 30px
- **Font:** Sora (Display)
- **Peso:** 700 (Bold)
- **Tracking:** Tight
- **Uso:** Títulos de páginas internas (Dashboard, Plan de Cuentas, etc.)

### **H2 - Section Headings**
```tsx
className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900"
```
- **Tamaño:** 36px móvil / 48px desktop
- **Font:** Sora (Display)
- **Peso:** 700-800 (Bold)
- **Tracking:** Tight
- **Uso:** Secciones principales en landing y páginas de contenido

### **H3 - Card/Component Titles**
```tsx
className="text-xl font-display font-bold text-slate-900"
// O en cards más grandes:
className="text-2xl font-display font-bold text-slate-900"
```
- **Tamaño:** 20px - 24px
- **Font:** Sora (Display)
- **Peso:** 700 (Bold)
- **Uso:** Títulos de cards, componentes, subsecciones

### **Body Large**
```tsx
className="text-xl text-slate-600 leading-relaxed"
```
- **Tamaño:** 20px
- **Font:** Plus Jakarta Sans (Sans)
- **Peso:** 400 (Regular)
- **Uso:** Subtítulos importantes, descripciones hero

### **Body Regular**
```tsx
className="text-base text-slate-600"
// O simplemente:
className="text-slate-600"
```
- **Tamaño:** 16px (default)
- **Font:** Plus Jakarta Sans (Sans)
- **Peso:** 400 (Regular)
- **Uso:** Texto de cuerpo general, descripciones

### **Body Small**
```tsx
className="text-sm text-slate-500"
```
- **Tamaño:** 14px
- **Font:** Plus Jakarta Sans (Sans)
- **Peso:** 400 (Regular)
- **Uso:** Texto secundario, ayuda, metadatos

### **Labels/Captions**
```tsx
className="text-xs font-semibold uppercase tracking-wider text-slate-400"
```
- **Tamaño:** 12px
- **Font:** Plus Jakarta Sans (Sans)
- **Peso:** 600 (Semibold)
- **Letter Spacing:** Wide (0.05em)
- **Uso:** Labels de formulario, secciones en sidebar, badges

### **Números Contables**
```tsx
className="font-mono text-sm font-medium text-slate-900"
// Para valores grandes/destacados:
className="font-mono text-2xl font-bold text-slate-900"
```
- **Font:** JetBrains Mono (Mono)
- **Uso:** Valores monetarios, códigos de cuenta, números de documento

---

## 🎨 Patrones de Uso por Componente

### **Landing Page - Hero**
```tsx
<h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6 text-slate-900 tracking-tight">
  Título Principal
</h1>
<p className="text-xl text-slate-600 leading-relaxed">
  Subtítulo o descripción
</p>
```

### **Landing Page - Secciones**
```tsx
<h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-4">
  Título de Sección
</h2>
<p className="text-lg text-slate-600">
  Descripción de la sección
</p>
```

### **Páginas Internas - Header**
```tsx
<div>
  <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
    Plan de Cuentas
  </h1>
  <p className="text-slate-500">
    Gestiona el catálogo de cuentas contables.
  </p>
</div>
```

### **Cards de Features/Benefits**
```tsx
<div className="bg-white rounded-2xl p-8">
  <h3 className="text-xl font-display font-bold text-slate-900 mb-3">
    Título de Feature
  </h3>
  <p className="text-slate-600 leading-relaxed">
    Descripción del beneficio
  </p>
</div>
```

### **Pricing Cards**
```tsx
<h3 className="text-2xl font-display font-bold mb-2">
  Plan Professional
</h3>
<p className="text-sm text-slate-600 mb-4">
  Descripción del plan
</p>
<div className="text-4xl font-bold">$99</div>
```

### **Dashboard Stats**
```tsx
<div className="bg-white rounded-xl p-6">
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

### **Forms y Labels**
```tsx
<label className="block text-sm font-medium text-slate-700 mb-2">
  Nombre de la Cuenta
</label>
<input className="text-base" />
<p className="text-xs text-slate-500 mt-1">
  Texto de ayuda
</p>
```

### **Tabla de Cuentas Contables**
```tsx
<td className="font-mono text-sm font-medium text-slate-900">
  1105
</td>
<td className="text-sm text-slate-700">
  Caja General
</td>
<td className="font-mono text-sm text-right text-slate-900">
  $1,234,567.89
</td>
```

---

## 🔧 Configuración Técnica

### **Google Fonts Import (index.css)**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap');
```

### **Tailwind Config (tailwind.config.ts)**
```typescript
fontFamily: {
  sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Consolas", "monospace"],
  display: ["Sora", "Plus Jakarta Sans", "sans-serif"],
}
```

---

## ✅ Checklist de Implementación

Al crear nuevos componentes o páginas:

- [ ] **Headings principales** (H1, H2) usan `font-display font-bold tracking-tight`
- [ ] **Títulos de cards** (H3) usan `font-display font-bold`
- [ ] **Body text** usa las clases por defecto (Plus Jakarta Sans automático)
- [ ] **Labels/captions** usan `text-xs font-semibold uppercase tracking-wider`
- [ ] **Valores numéricos** usan `font-mono`
- [ ] **Line height** apropiado: `leading-tight` para headings, `leading-relaxed` para body
- [ ] **Color consistency:** `text-slate-900` headings, `text-slate-600` body, `text-slate-500` secondary

---

## 🎯 Principios de Diseño

### **1. Contraste Jerárquico**
- Usar tamaños contrastantes entre headings y body (ratio 1.5x - 2x mínimo)
- Display font solo para headings importantes
- Sans font para todo lo demás

### **2. Legibilidad Contable**
- Números siempre en monospace para alineación
- Suficiente line-height en tablas (1.5 - 1.75)
- Alto contraste en valores monetarios

### **3. Consistencia**
- Mismo patrón de heading en todas las páginas internas
- Misma estructura en todas las landing sections
- Reutilizar clases en lugar de crear nuevas

### **4. Accesibilidad**
- Mínimo 16px para body text (text-base)
- Alto contraste de color (slate-900 vs white = AAA)
- Line height mínimo 1.5 para body text

---

## 📦 Componentes con Tipografía Estandarizada

### **Landing Components**
✅ HeroSection.tsx - H1 display font
✅ PricingSection.tsx - H2 display font  
✅ FAQSection.tsx - H2 y H3 display font
✅ CTASection.tsx - H2 display font
✅ FeaturesGrid.tsx - H2 y H3 display font
✅ BenefitsGrid.tsx - H2 y H3 display font
✅ FeatureCard.tsx - H3 display font
✅ BenefitCard.tsx - H3 display font
✅ PricingCard.tsx - H3 display font

### **Internal Pages**
✅ Dashboard.tsx - H1 display font + tracking-tight
✅ PlanCuentas.tsx - H1 display font + tracking-tight
✅ Terceros.tsx - H1 display font + tracking-tight
✅ Asientos.tsx - H1 display font + tracking-tight
✅ Comprobantes.tsx - H1 display font + tracking-tight
✅ Periodos.tsx - H1 display font + tracking-tight
✅ Niif.tsx - H1 display font + tracking-tight
✅ Unidades.tsx - H1 display font + tracking-tight
✅ FacturaciónPH.tsx - H1 display font + tracking-tight
✅ Documentos.tsx - H1 display font + tracking-tight
✅ Reservas.tsx - H1 display font + tracking-tight
✅ PQRS.tsx - H1 display font + tracking-tight
✅ TenantSelection.tsx - H1 display font + tracking-tight
✅ LoginPage.tsx - H1 display font + tracking-tight
✅ LoginLanding.tsx - H1 display font + tracking-tight
✅ not-found.tsx - H1 display font + tracking-tight

### **Layout Components**
✅ Layout.tsx - Logo con display font
✅ CollapsibleMenu.tsx - Typography consistente
✅ StatCard.tsx - Valores con mono font

---

## 🚀 Optimizaciones de Performance

### **Font Loading**
- Fuentes cargadas vía Google Fonts CDN con `display=swap`
- Pesos selectivos: Solo los necesarios (no todo el rango)
- Fallbacks configurados para cada familia

### **Font-Display Strategy**
```css
/* Ya incluido en el import de Google Fonts */
font-display: swap;
```
- Previene flash de texto invisible (FOIT)
- Muestra texto inmediatamente con fallback
- Cambia a custom font cuando carga

### **Preload Critical Fonts (Opcional)**
```html
<!-- Agregar en index.html si se necesita -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap" as="style">
```

---

## 📚 Referencias

- **Plus Jakarta Sans:** https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **Sora:** https://fonts.google.com/specimen/Sora
- **JetBrains Mono:** https://fonts.google.com/specimen/JetBrains+Mono
- **Tailwind Typography:** https://tailwindcss.com/docs/font-family
- **Web Font Best Practices:** https://web.dev/font-best-practices/

---

## 📝 Notas de Actualización

**Última actualización:** Enero 2025

**Cambios recientes:**
- Migración de Inter/Playfair Display a Plus Jakarta Sans/Sora
- Implementación de `tracking-tight` en todos los headings principales
- Estandarización de H3 en cards con `font-display`
- Documentación completa de patrones por tipo de componente

**Próximos pasos:**
- Considerar variantes de fuente para dark mode si se implementa
- Evaluar necesidad de fuente adicional para gráficos/charts
- Medir impacto en CLS (Cumulative Layout Shift)
