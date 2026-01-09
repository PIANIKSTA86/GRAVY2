import { BenefitCard } from "./BenefitCard";

interface Benefit {
  title: string;
  desc: string;
  metric: string;
}

interface BenefitsGridProps {
  benefits: Benefit[];
}

export function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            📈 Resultados comprobados
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            Lo que nuestros clientes logran
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <BenefitCard
              key={idx}
              metric={benefit.metric}
              title={benefit.title}
              desc={benefit.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
