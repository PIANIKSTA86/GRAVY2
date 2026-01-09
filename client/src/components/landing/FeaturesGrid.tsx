import { LucideIcon } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface FeaturesGridProps {
  features: Feature[];
  onFeatureClick?: () => void;
}

export function FeaturesGrid({ features, onFeatureClick }: FeaturesGridProps) {
  return (
    <section className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            ✨ Características principales
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            Todo lo que necesitas para contabilidad moderna
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para contadores y equipos financieros que valoran la eficiencia y la seguridad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              onClick={onFeatureClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
