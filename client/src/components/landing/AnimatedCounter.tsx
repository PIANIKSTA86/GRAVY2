import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: string;
  label: string;
  delay?: number;
}

export function AnimatedCounter({ value, label, delay = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add("animate-in");
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        animationDelay: `${delay}ms`,
      }}
      className="text-center opacity-0 animate-fade-in"
    >
      <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{value}</p>
      <p className="text-sm md:text-base text-slate-600">{label}</p>
    </div>
  );
}
