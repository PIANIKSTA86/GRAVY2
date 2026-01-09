interface BenefitCardProps {
  metric: string;
  title: string;
  desc: string;
}

export function BenefitCard({ metric, title, desc }: BenefitCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
      <div className="flex items-start gap-4">
        <div className="text-4xl font-bold text-blue-600 flex-shrink-0">{metric}</div>
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}
