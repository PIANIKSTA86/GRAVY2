import { ArrowRight, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick?: () => void;
}

export function FeatureCard({ icon: Icon, title, desc, onClick }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed mb-4">{desc}</p>
      <button
        onClick={onClick}
        className="text-blue-600 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all group-hover:text-blue-700"
      >
        Explorar <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
