import { useState } from "react";
import { FAQItem } from "./FAQItem";
import { ArrowRight } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            ❓ Preguntas frecuentes
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            Todo lo que necesitas saber
          </h2>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.q}
              answer={faq.a}
              isOpen={activeTab === idx}
              onClick={() => setActiveTab(activeTab === idx ? null : idx)}
            />
          ))}
        </div>

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-display font-bold mb-2">¿Aún tienes preguntas?</h3>
          <p className="mb-6 text-blue-100">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte.
          </p>
          <button
            onClick={() => (window.location.href = "mailto:support@contagrav.com")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Contactar soporte <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
