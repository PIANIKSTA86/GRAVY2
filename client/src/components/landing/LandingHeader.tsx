import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavLink {
  id: string;
  label: string;
}

interface HeaderProps {
  navLinks: NavLink[];
  onNavClick: (id: string) => void;
  onLoginClick: () => void;
  onPricingClick: () => void;
}

export function LandingHeader({
  navLinks,
  onNavClick,
  onLoginClick,
  onPricingClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick("inicio")}>
          <img src="/icono.png" alt="ContaGrav" className="h-10 w-10 rounded-lg border border-slate-200 bg-white object-contain shadow-sm" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">ContaGrav</p>
            <p className="text-sm font-bold text-slate-900">Contabilidad</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavClick(link.id)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onPricingClick}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Precios
          </button>
          <button
            onClick={onLoginClick}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <button
              onClick={onLoginClick}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              Iniciar sesión <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
