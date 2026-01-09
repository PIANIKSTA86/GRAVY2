import { PricingCard } from "./PricingCard";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  highlighted: boolean;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  onCTA?: () => void;
}

export function PricingSection({ plans, onCTA }: PricingSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            💳 Planes transparentes
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            Precios claros para cada etapa
          </h2>
          <p className="text-lg text-slate-600">
            Comienza gratis y escala cuando tu equipo crezca.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <PricingCard key={idx} plan={plan} onCTA={onCTA} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            ¿Necesitas un plan personalizado? Nuestro equipo puede ayudarte.
          </p>
          <button
            onClick={() => (window.location.href = "mailto:sales@contagrav.com")}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            Contactar ventas →
          </button>
        </div>
      </div>
    </section>
  );
}
