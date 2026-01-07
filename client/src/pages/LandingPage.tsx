import { ArrowRight, CheckCircle2, Coins, Headphones, LayoutDashboard, Lock } from "lucide-react";

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
  window.location.href = "/api/login";
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center font-bold">
              G
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gravy</p>
              <p className="font-semibold">Contabilidad Multi-tenant</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="hover:text-white transition-colors">
                {s.label}
              </button>
            ))}
          </nav>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25 hover:bg-emerald-400"
          >
            Iniciar sesión
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-24">
        <section id="inicio" className="pt-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Tu contabilidad en un solo lugar</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Controla múltiples empresas con flujos NIIF en minutos
            </h1>
            <p className="text-lg text-slate-300">
              Gravy centraliza planes de cuentas, terceros, asientos y políticas NIIF con acceso seguro multi-tenant.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={login}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 text-slate-950 font-semibold shadow-lg shadow-blue-500/25 hover:bg-blue-400"
              >
                Iniciar sesión
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollTo("caracteristicas")}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-200 hover:border-white/30"
              >
                Ver características
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-emerald-400/20 to-cyan-400/10 blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Empresas activas</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" /> Sincronizadas
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <p className="text-slate-400">Empresas</p>
                  <p className="text-2xl font-bold">multi-tenant</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <p className="text-slate-400">Planes</p>
                  <p className="text-2xl font-bold">NIIF</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <p className="text-slate-400">Asientos</p>
                  <p className="text-2xl font-bold">autom.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                  <p className="text-slate-400">Seguridad</p>
                  <p className="text-2xl font-bold">OIDC</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Características</p>
              <h2 className="text-3xl font-display font-bold">Todo lo que necesitas</h2>
            </div>
            <button onClick={login} className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400">
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <LayoutDashboard className="h-6 w-6 text-emerald-300" />,
                title: "Multi-empresa",
                desc: "Administra varios tenants con asociaciones de usuarios y roles.",
              },
              {
                icon: <Lock className="h-6 w-6 text-emerald-300" />,
                title: "Autenticación segura",
                desc: "OIDC listo para producción y bypass de desarrollo para pruebas rápidas.",
              },
              {
                icon: <Coins className="h-6 w-6 text-emerald-300" />,
                title: "NIIF integrado",
                desc: "Políticas, plan de cuentas y asientos listos para cumplir norma.",
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.desc}</p>
                <button onClick={login} className="text-sm text-emerald-300 inline-flex items-center gap-1 hover:text-emerald-200">
                  Iniciar sesión <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="precios" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Precios</p>
              <h2 className="text-3xl font-display font-bold">Elige tu ritmo</h2>
              <p className="text-slate-300">Empieza gratis en desarrollo; escala a producción cuando estés listo.</p>
            </div>
            <button onClick={login} className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400">
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["Developer", "Equipo", "Empresa"].map((tier, idx) => (
              <div key={tier} className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                <div className="text-sm text-slate-300">{tier}</div>
                <div className="text-3xl font-bold">{idx === 0 ? "Gratis" : idx === 1 ? "$49" : "$149"}
                  <span className="text-sm text-slate-400"> {idx === 0 ? "dev" : "/mes"}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Multi-tenant</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Plan NIIF</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Asientos y terceros</li>
                </ul>
                <button onClick={login} className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-slate-950 font-semibold hover:bg-blue-400">
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="soporte" className="space-y-6 pb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Soporte</p>
              <h2 className="text-3xl font-display font-bold">Estamos para ayudarte</h2>
              <p className="text-slate-300">Documentación, canal de soporte y respuestas rápidas.</p>
            </div>
            <button onClick={login} className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400">
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["Base de conocimiento", "Soporte priorizado", "Guías NIIF"].map((item) => (
              <div key={item} className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                <Headphones className="h-6 w-6 text-emerald-300" />
                <h3 className="text-xl font-semibold">{item}</h3>
                <p className="text-sm text-slate-300">Respuestas claras y acompañamiento para que no te detengas.</p>
                <button onClick={login} className="text-sm text-emerald-300 inline-flex items-center gap-1 hover:text-emerald-200">
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
