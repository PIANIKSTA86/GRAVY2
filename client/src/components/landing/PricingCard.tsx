import { CheckCircle2 } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  highlighted: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onCTA?: () => void;
}

export function PricingCard({ plan, onCTA }: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 transition-all ${
        plan.highlighted
          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/30 transform md:scale-105"
          : "bg-white border border-slate-200 text-slate-900"
      }`}
    >
      {plan.highlighted && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-blue-900 text-xs font-bold">
            ⭐ MÁS POPULAR
          </span>
        </div>
      )}

      <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
      <p className={`text-sm mb-4 ${plan.highlighted ? "text-blue-100" : "text-slate-600"}`}>
        {plan.desc}
      </p>

      <div className="mb-6">
        <span className="text-4xl font-bold">{plan.price}</span>
        {plan.period && (
          <span className={`text-sm ml-2 ${plan.highlighted ? "text-blue-100" : "text-slate-600"}`}>
            {plan.period}
          </span>
        )}
      </div>

      <button
        onClick={onCTA}
        className={`w-full py-3 rounded-xl font-semibold mb-8 transition-all flex items-center justify-center gap-2 ${
          plan.highlighted
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Comenzar ahora
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="space-y-3">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle2
              className={`h-5 w-5 flex-shrink-0 ${plan.highlighted ? "text-yellow-300" : "text-blue-600"}`}
            />
            <span className={`text-sm ${plan.highlighted ? "text-blue-50" : "text-slate-700"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
