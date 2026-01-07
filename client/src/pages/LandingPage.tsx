import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Headphones,
  LayoutDashboard,
  Lock,
  Sparkles,
} from "lucide-react";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "caracteristicas", label: "Características" },
  { id: "precios", label: "Precios" },
  { id: "soporte", label: "Soporte" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function login() {
  window.location.href = "/login";
}

const accent = {
  primary: "bg-[#0d6efd]",
  primaryHover: "hover:bg-[#0b5adf]",
  soft: "bg-[#e8f0ff] text-[#0b4dd4]",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e6f0ff] via-white to-[#e8fffa]" />

      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0d6efd] to-[#00c2ff] flex items-center justify-center text-white font-bold">
              G
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Gravy</p>
              <p className="font-semibold text-slate-800">Contabilidad Multi-tenant</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="hover:text-slate-900 transition-colors">
                {s.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo("precios")}
              className="hidden md:inline-flex px-3 py-2 text-sm rounded-lg text-slate-700 border border-slate-200 hover:border-slate-300"
            >
              Ver precios
            </button>
            <button
              onClick={login}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-lg shadow-[#0d6efd]/30 ${accent.primary} ${accent.primaryHover}`}
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-28">
        {/* Hero */}
        <section id="inicio" className="pt-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#0d6efd]" />
              Multi-empresa + NIIF sin fricción
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-slate-900">
              La contabilidad moderna para equipos que gestionan varias empresas
            </h1>
            <p className="text-lg text-slate-600">
              Planes de cuentas, terceros, asientos y políticas NIIF en un espacio seguro. Todo conectado, todo trazable.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={login}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-lg shadow-[#0d6efd]/30 ${accent.primary} ${accent.primaryHover}`}
              >
                Iniciar sesión
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollTo("caracteristicas")}
                className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 hover:border-[#0d6efd]"
              >
                Ver características
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Auditoría completa
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Roles y sesiones seguras
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-[#0d6efd]/15 via-[#00c2ff]/12 to-[#8df2ff]/20 blur-3xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Panel consolidado</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0ff] text-[#0b4dd4]">
                  <CheckCircle2 className="h-4 w-4" /> En línea
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {["Empresas", "Planes NIIF", "Asientos", "Seguridad"].map((item) => (
                  <div key={item} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <p className="text-slate-500">{item}</p>
                    <p className="text-2xl font-bold text-slate-900">Activo</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-600">Sigue los flujos NIIF con plantillas listas para usar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="caracteristicas" className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#0b4dd4]">Características</p>
              <h2 className="text-3xl font-display font-bold text-slate-900">Lo esencial para equipos contables</h2>
              <p className="text-slate-600 mt-2">Opera varias empresas con control de acceso, NIIF y trazabilidad completa.</p>
            </div>
            <button
              onClick={login}
              className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-sm bg-[#0d6efd] hover:bg-[#0b5adf]"
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <LayoutDashboard className="h-6 w-6 text-[#0d6efd]" />,
                title: "Multi-tenant real",
                desc: "Empresas, usuarios asociados, roles y separación total de datos.",
              },
              {
                icon: <Lock className="h-6 w-6 text-[#0d6efd]" />,
                title: "Auth OIDC y sesiones",
                desc: "Listo para producción. Bypass de dev para pruebas sin fricción.",
              },
              {
                icon: <Coins className="h-6 w-6 text-[#0d6efd]" />,
                title: "NIIF end-to-end",
                desc: "Planes, políticas y asientos con plantillas y categorías NIIF.",
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#e8f0ff] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
                <button onClick={login} className="text-sm text-[#0b4dd4] inline-flex items-center gap-1 hover:text-[#0b5adf]">
                  Iniciar sesión <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#0b4dd4]">Precios</p>
              <h2 className="text-3xl font-display font-bold text-slate-900">Planes claros para cada etapa</h2>
              <p className="text-slate-600 mt-2">Comienza en dev gratis y escala cuando tu equipo lo necesite.</p>
            </div>
            <button
              onClick={login}
              className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-sm bg-[#0d6efd] hover:bg-[#0b5adf]"
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["Developer", "Equipo", "Empresa"].map((tier, idx) => (
              <div key={tier} className={`p-6 rounded-2xl border bg-white shadow-sm space-y-4 ${idx === 1 ? "border-[#0d6efd] shadow-lg shadow-[#0d6efd]/15" : "border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">{tier}</div>
                  {idx === 1 && <span className="px-2 py-1 rounded-full text-xs bg-[#e8f0ff] text-[#0b4dd4]">Recomendado</span>}
                </div>
                <div className="text-3xl font-bold text-slate-900">{idx === 0 ? "Gratis" : idx === 1 ? "$49" : "$149"}
                  <span className="text-sm text-slate-500"> {idx === 0 ? "dev" : "/mes"}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Multi-tenant</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Plan NIIF completo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Asientos y terceros</li>
                  {idx > 0 && <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Soporte priorizado</li>}
                  {idx === 2 && <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0d6efd]" /> Entornos dedicados</li>}
                </ul>
                <button
                  onClick={login}
                  className={`w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold ${idx === 1 ? "text-white bg-[#0d6efd] hover:bg-[#0b5adf]" : "text-[#0b4dd4] bg-[#e8f0ff] hover:bg-[#d9e8ff]"}`}
                >
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section id="soporte" className="space-y-8 pb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#0b4dd4]">Soporte</p>
              <h2 className="text-3xl font-display font-bold text-slate-900">Acompañamiento cuando lo necesitas</h2>
              <p className="text-slate-600 mt-2">Documentación clara, guías NIIF y un equipo listo para ayudarte.</p>
            </div>
            <button
              onClick={login}
              className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow-sm bg-[#0d6efd] hover:bg-[#0b5adf]"
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["Base de conocimiento", "Soporte priorizado", "Guías NIIF"].map((item) => (
              <div key={item} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
                <Headphones className="h-6 w-6 text-[#0d6efd]" />
                <h3 className="text-xl font-semibold text-slate-900">{item}</h3>
                <p className="text-sm text-slate-600">Respuestas claras y acompañamiento para que no te detengas.</p>
                <button onClick={login} className="text-sm text-[#0b4dd4] inline-flex items-center gap-1 hover:text-[#0b5adf]">
                  Iniciar sesión <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
