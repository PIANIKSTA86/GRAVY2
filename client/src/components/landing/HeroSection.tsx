import { ArrowRight, Shield, Lock } from "lucide-react";
import { Sparkles } from "lucide-react";

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  stats: Array<{ number: string; label: string }>;
}

export function HeroSection({ onPrimaryClick, onSecondaryClick, stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-8 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Contabilidad Multi-empresa 🚀</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6 text-slate-900 tracking-tight">
                Contabilidad moderna para equipos que gobiernan múltiples empresas
              </h1>

              {/* Subheading */}
              <p className="text-xl text-slate-600 leading-relaxed">
                NIIF, multi-tenant, seguridad empresarial y reportes inteligentes. Todo en una plataforma diseñada para crecer con tu negocio.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPrimaryClick}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2"
              >
                Empezar ahora
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onSecondaryClick}
                className="px-8 py-4 border-2 border-slate-300 text-slate-900 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Ver características
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Shield, text: "99.9% disponibilidad" },
                { icon: Lock, text: "Encriptación end-to-end" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="space-y-6">
                {/* Dashboard header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Panel Consolidado</h3>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Empresas", value: "∞", icon: "🏢" },
                    { label: "Asientos", value: "+10K", icon: "📊" },
                    { label: "Usuarios", value: "+500", icon: "👥" },
                    { label: "Estado", value: "Activo", icon: "✓" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Info banner */}
                <div className="bg-green-500/15 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm text-green-300">✓ Cumplimiento NIIF automático</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-20 border-t border-slate-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</p>
              <p className="text-sm md:text-base text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
