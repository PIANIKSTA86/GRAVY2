import {
  Zap,
  BarChart3,
  Lock,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";
import {
  LandingHeader,
  HeroSection,
  FeaturesGrid,
  BenefitsGrid,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from "@/components/landing";

interface NavLink {
  id: string;
  label: string;
}

const navLinks: NavLink[] = [
  { id: "inicio", label: "Inicio" },
  { id: "caracteristicas", label: "Características" },
  { id: "precios", label: "Precios" },
  { id: "faq", label: "Preguntas" },
];

const stats = [
  { number: "+$10B", label: "USD en operaciones" },
  { number: "+50K", label: "empresas activas" },
  { number: "+100K", label: "usuarios satisfechos" },
  { number: "99.9%", label: "disponibilidad" },
];

const features = [
  {
    icon: Zap,
    title: "Multi-tenant en tiempo real",
    desc: "Maneja múltiples empresas con separación total de datos y control de acceso granular.",
  },
  {
    icon: BarChart3,
    title: "NIIF end-to-end",
    desc: "Planes, políticas y asientos predefinidos con normas NIIF completas integradas.",
  },
  {
    icon: Lock,
    title: "Seguridad empresarial",
    desc: "Auth OIDC, encriptación, auditoría completa y cumplimiento normativo.",
  },
  {
    icon: TrendingUp,
    title: "Reportes inteligentes",
    desc: "Analítica avanzada y dashboards en tiempo real para decisiones basadas en datos.",
  },
  {
    icon: Users,
    title: "Colaboración sin límites",
    desc: "Roles, permisos y sesiones seguras para trabajar en equipo sin fricciones.",
  },
  {
    icon: Globe,
    title: "API moderna y robusta",
    desc: "Integración fácil con tus herramientas existentes mediante REST API documentada.",
  },
];

const benefits = [
  {
    title: "+40% en eficiencia operativa",
    desc: "Automatización de procesos contables reduce tiempo manual de entrada de datos.",
    metric: "+40%",
  },
  {
    title: "+60% en velocidad de reportes",
    desc: "Genera reportes en segundos en lugar de horas con análisis inteligente.",
    metric: "+60%",
  },
  {
    title: "-70% en errores contables",
    desc: "Validación automática de reglas NIIF previene errores costosos.",
    metric: "-70%",
  },
  {
    title: "+99.9% disponibilidad",
    desc: "Infraestructura cloud escalable con redundancia geográfica y backup automático.",
    metric: "99.9%",
  },
];

const pricingPlans = [
  {
    name: "Developer",
    price: "Gratis",
    period: "dev",
    desc: "Para probar y desarrollar",
    features: [
      "Multi-tenant completo",
      "1 empresa",
      "5 usuarios",
      "Planes NIIF básicos",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Profesional",
    price: "$49",
    period: "/mes",
    desc: "Para equipos activos",
    features: [
      "Multi-tenant completo",
      "Empresas ilimitadas",
      "50 usuarios",
      "Planes NIIF avanzados",
      "Reportes customizados",
      "API completa",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Empresa",
    price: "$199",
    period: "/mes",
    desc: "Para operaciones grandes",
    features: [
      "Todo en Profesional",
      "Usuarios ilimitados",
      "Entornos dedicados",
      "SLA garantizado",
      "Onboarding personalizado",
      "Account manager",
      "Integraciones custom",
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    q: "¿Cómo funciona la contabilidad multi-tenant?",
    a: "ContaGrav separa completamente datos entre empresas. Cada empresa tiene su plan de cuentas, terceros y asientos. Los usuarios solo ven lo que pertenece a su empresa.",
  },
  {
    q: "¿Qué nivel de NIIF incluye?",
    a: "Incluimos NIIF para PYMEs y NIIF Plenas. Plantillas precargadas, políticas contables automatizadas y asientos predefinidos para cumplimiento normativo.",
  },
  {
    q: "¿Cómo es la seguridad?",
    a: "Usamos Auth OIDC, encriptación en tránsito y reposo, auditoría completa de acciones, roles granulares y cumplimiento de normas internacionales de seguridad.",
  },
  {
    q: "¿Puedo integrar otras herramientas?",
    a: "Sí, tenemos API REST completa documentada. Integramos con ERP, CRM, sistemas bancarios y herramientas de terceros populares.",
  },
  {
    q: "¿Qué pasa con mis datos?",
    a: "Los datos están en infraestructura cloud con redundancia geográfica, backups automáticos diarios y recuperación ante desastres garantizada.",
  },
  {
    q: "¿Hay soporte en español?",
    a: "Sí, nuestro equipo de soporte está en Colombia, México y España. Horario de atención 24/7 para planes Empresa.",
  },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function login() {
  window.location.href = "/login";
}

function demo() {
  window.location.href = "mailto:demo@contagrav.com";
}

export default function LandingPage() {
  // Footer sections configuration
  const footerSections = [
    {
      title: "Producto",
      links: [
        { label: "Características", href: "#caracteristicas" },
        { label: "Precios", href: "#precios" },
        { label: "Iniciar sesión", href: "/login" },
        { label: "Documentación", href: "#" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Acerca de", href: "mailto:info@contagrav.com" },
        { label: "Blog", href: "mailto:blog@contagrav.com" },
        { label: "Carreras", href: "mailto:careers@contagrav.com" },
        { label: "Prensa", href: "mailto:press@contagrav.com" },
      ],
    },
    {
      title: "Soporte",
      links: [
        { label: "Centro de ayuda", href: "mailto:support@contagrav.com" },
        { label: "Estado del sistema", href: "#" },
        { label: "Seguridad", href: "#" },
        { label: "Contacto", href: "mailto:contact@contagrav.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "#" },
        { label: "Términos", href: "#" },
        { label: "Cookies", href: "#" },
        { label: "Compliance", href: "#" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <LandingHeader
        navLinks={navLinks}
        onNavClick={scrollTo}
        onLoginClick={login}
        onPricingClick={() => scrollTo("precios")}
      />

      {/* Hero Section */}
      <div id="inicio">
        <HeroSection
          onPrimaryClick={login}
          onSecondaryClick={() => scrollTo("caracteristicas")}
          stats={stats}
        />
      </div>

      {/* Features */}
      <div id="caracteristicas">
        <FeaturesGrid features={features} onFeatureClick={login} />
      </div>

      {/* Benefits */}
      <BenefitsGrid benefits={benefits} />

      {/* Pricing */}
      <div id="precios">
        <PricingSection plans={pricingPlans} onCTA={login} />
      </div>

      {/* FAQ */}
      <div id="faq">
        <FAQSection faqs={faqs} />
      </div>

      {/* CTA */}
      <CTASection onPrimaryClick={login} onSecondaryClick={demo} />

      {/* Footer */}
      <Footer sections={footerSections} />
    </div>
  );
}
