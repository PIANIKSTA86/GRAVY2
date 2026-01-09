interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections: FooterSection[];
}

export function Footer({ sections }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-sm">
                CG
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">ContaGrav</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              La plataforma de contabilidad moderna para equipos multi-empresa.
            </p>
          </div>

          {/* Footer Sections */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, lidx) => (
                  <li key={lidx}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400 text-center md:text-left mb-4 md:mb-0">
            © 2024 ContaGrav. Todos los derechos reservados. Hecho con ❤️ en Colombia.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
