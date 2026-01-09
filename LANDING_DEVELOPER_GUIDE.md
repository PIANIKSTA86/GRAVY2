# 🔧 GUÍA DEL DESARROLLADOR - Landing Page

## Inicio Rápido

```bash
# El landing está completamente funcional
# Solo necesitas correr tu dev server normal
npm run dev:win  # En Windows
npm run dev      # En Mac/Linux
```

Visita: `http://localhost:5173`

---

## 📂 Estructura de Archivos

```
client/src/
├── pages/LandingPage.tsx          (Main page - 7.5 KB)
└── components/landing/
    ├── LandingHeader.tsx          (Header sticky + mobile menu)
    ├── HeroSection.tsx            (Hero con stats y preview)
    ├── FeaturesGrid.tsx           (Grid de 6 características)
    ├── BenefitsGrid.tsx           (Grid de 4 beneficios)
    ├── PricingSection.tsx         (3 planes de precios)
    ├── FAQSection.tsx             (FAQ interactivo)
    ├── CTASection.tsx             (Call-to-action final)
    ├── Footer.tsx                 (Footer con 5 columnas)
    ├── FeatureCard.tsx            (Componente de feature)
    ├── PricingCard.tsx            (Componente de pricing)
    ├── BenefitCard.tsx            (Componente de benefit)
    ├── FAQItem.tsx                (Componente de FAQ)
    ├── AnimatedCounter.tsx        (Contador con lazy load)
    └── index.ts                   (Exports)
```

---

## 🔄 Workflow de Cambios

### 1. Actualizar Contenido (Fácil)

Edita `LandingPage.tsx`:

```tsx
// Cambiar features
const features = [
  {
    icon: Zap,
    title: "Nueva Feature",
    desc: "Descripción",
  },
];

// Cambiar precios
const pricingPlans = [
  {
    name: "Plan Nuevo",
    price: "$99",
    features: ["Feature 1", "Feature 2"],
  },
];

// Cambiar FAQ
const faqs = [
  {
    q: "Nueva pregunta?",
    a: "Respuesta completa.",
  },
];
```

### 2. Agregar Nueva Sección (Intermedio)

Crea nuevo componente en `client/src/components/landing/`:

```tsx
// client/src/components/landing/NewSection.tsx
interface NewSectionProps {
  title: string;
  items: any[];
}

export function NewSection({ title, items }: NewSectionProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <h2>{title}</h2>
        {/* Tu contenido */}
      </div>
    </section>
  );
}
```

Luego agrega a `LandingPage.tsx`:

```tsx
import { NewSection } from "@/components/landing";

export default function LandingPage() {
  return (
    <div>
      {/* ... otras secciones */}
      <NewSection title="..." items={...} />
    </div>
  );
}
```

### 3. Modificar Componente Existente (Avanzado)

Ejemplo: Cambiar estilos de FeatureCard

```tsx
// client/src/components/landing/FeatureCard.tsx
export function FeatureCard({ icon: Icon, title, desc, onClick }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
      {/* Modificar aquí */}
    </div>
  );
}
```

---

## 🎨 Paleta de Colores

```
PRIMARY:      #2563eb (Blue 600)
SECONDARY:    #06b6d4 (Cyan 500)
SUCCESS:      #10b981 (Green 500)
BACKGROUND:  #ffffff (White)
TEXT:        #0f172a (Slate 900)
TEXT_LIGHT:  #64748b (Slate 600)
```

### Tailwind Classes Usadas

```
bg-blue-600        → Primary button
bg-blue-50         → Light backgrounds
text-blue-600      → Primary text
border-blue-300    → Hover states
shadow-blue-600/30 → Glow effects
```

---

## 🎯 Modelos de Datos

### NavLink
```tsx
interface NavLink {
  id: string;      // "inicio", "caracteristicas", etc
  label: string;   // Texto a mostrar
}
```

### Feature
```tsx
interface Feature {
  icon: LucideIcon;  // Lucide React icon
  title: string;
  desc: string;
}
```

### PricingPlan
```tsx
interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  highlighted: boolean;  // Si es el plan destacado
}
```

### FAQ
```tsx
interface FAQ {
  q: string;  // Pregunta
  a: string;  // Respuesta
}
```

### FooterSection
```tsx
interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}
```

---

## 🚀 Funcionalidades Principales

### Smooth Scrolling
```tsx
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Uso:
<button onClick={() => scrollTo("precios")}>
  Ver Precios
</button>
```

### Mobile Menu
Automático en `LandingHeader.tsx`:
- Se abre/cierra al clickear hamburguesa
- Se cierra automáticamente al navegar
- Full-width en mobile

### Email Links
```tsx
// Para support
onClick={() => (window.location.href = "mailto:support@contagrav.com")}

// Para sales
onClick={() => (window.location.href = "mailto:sales@contagrav.com")}
```

### FAQ Interactivo
Estado manejado por `FAQSection.tsx`:
```tsx
const [activeTab, setActiveTab] = useState<number | null>(null);

// Toggle al clickear
onClick={() => setActiveTab(activeTab === idx ? null : idx)}
```

---

## 🎬 Animations

### Hover Effects
- 200ms transitions en botones
- Scale 110% en icons
- Cambio de color en borders

### Background Gradients
Parallax suave en hero (puramente CSS):
```tsx
<div className="absolute bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
```

### Smooth Scrolling
Built-in en navegación:
```tsx
scrollIntoView({ behavior: "smooth" })
```

---

## 🔍 Testing Checklist

- [ ] Desktop (1920px) - looks good
- [ ] Tablet (768px) - responsive grid
- [ ] Mobile (375px) - hamburger menu
- [ ] All links work (scroll + email)
- [ ] Hover effects smooth
- [ ] No console errors
- [ ] Lighthouse score >90
- [ ] Page loads <2s

---

## 🐛 Troubleshooting

### Componentes no importan
**Error:** `Module not found`

**Solución:** Verifica ruta alias en `vite.config.ts`:
```tsx
resolve: {
  alias: {
    "@": path.resolve(import.meta.dirname, "client", "src"),
  },
}
```

### Estilos no aplican
**Problema:** Tailwind classes no funcionan

**Solución:** Asegúrate que `tailwind.config.ts` incluye:
```tsx
content: [
  "./client/index.html",
  "./client/src/**/*.{js,ts,jsx,tsx}",
]
```

### Mobile menu no funciona
**Problema:** Menu no abre/cierra

**Solución:** Check en `LandingHeader.tsx` la función `handleNavClick`:
```tsx
const handleNavClick = (id: string) => {
  onNavClick(id);
  setMobileMenuOpen(false);  // ← Debe cerrar aquí
};
```

---

## 📊 Performance Tips

### 1. Lazy Load Images (Future)
```tsx
<img loading="lazy" src="..." alt="..." />
```

### 2. Memoize Components (si cambian frecuentemente)
```tsx
export const FeatureCard = memo(({ ... }: Props) => {
  // Component
});
```

### 3. Use useCallback para handlers
```tsx
const handleClick = useCallback(() => {
  login();
}, []);
```

---

## 🔗 Rutas Importantes

| Ruta | Descripción |
|------|-------------|
| `/` | Landing Page |
| `/login` | Login (redirect) |
| `mailto:sales@contagrav.com` | Sales email |
| `mailto:support@contagrav.com` | Support email |
| `mailto:demo@contagrav.com` | Demo request |

---

## 📚 Recursos Útiles

### Tailwind CSS
- Color palette: https://tailwindcss.com/docs/customizing-colors
- Components: https://ui.shadcn.com

### Lucide Icons
- Icon search: https://lucide.dev
- All icons: https://lucide.dev/icons

### React Best Practices
- Hooks: https://react.dev/reference/react
- Performance: https://react.dev/learn/render-and-commit

---

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# 1. Push to Git
git push origin main

# 2. Vercel auto-deploys
# Listo! 🎉
```

### Manual Build
```bash
npm run build
# Output en: dist/
# Deploy la carpeta dist/
```

---

## 📞 Soporte

- **Preguntas:** Ver `LANDING_PAGE_UPDATES.md`
- **Issues:** Check Tailwind docs + Lucide docs
- **Cambios:** Edita `LandingPage.tsx` + componentes

---

**Happy coding! 🚀**
