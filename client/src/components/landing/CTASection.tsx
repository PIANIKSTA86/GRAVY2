import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function CTASection({ onPrimaryClick, onSecondaryClick }: CTASectionProps) {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
          Comienza tu transformación contable hoy
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Únete a cientos de equipos que ya están optimizando su contabilidad con ContaGrav.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onPrimaryClick}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
          >
            Prueba gratis ahora
          </button>
          <button
            onClick={onSecondaryClick}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Solicitar demostración
          </button>
        </div>
      </div>
    </section>
  );
}
