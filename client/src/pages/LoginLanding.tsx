import { LogIn, ShieldCheck } from "lucide-react";

export default function LoginLanding() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Sesión requerida
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight">
              Inicia sesión para continuar
            </h1>
            <p className="text-slate-300 text-lg">
              Conecta tu cuenta para acceder a tus empresas, asientos y reportes.
              Si estás en desarrollo local, el botón simula el inicio de sesión.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-0.5"
            >
              <LogIn className="h-5 w-5" />
              Ir a iniciar sesión
            </button>
            <div className="text-sm text-slate-400 flex items-center">
              Tip: si usas DEV_AUTH_BYPASS, el backend ya te autenticó.
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl" />
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Estado</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Listo para conectar
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span>API</span>
                  <span className="text-emerald-300">/api/login</span>
                </div>
                <div className="flex justify-between">
                  <span>Redirección</span>
                  <span className="text-emerald-300">Inicio de sesión</span>
                </div>
                <div className="flex justify-between">
                  <span>Modo dev</span>
                  <span className="text-amber-300">DEV_AUTH_BYPASS</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Continuar cerrará la sesión anterior y solicitará autenticación segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
