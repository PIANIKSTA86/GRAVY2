import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface SubmenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CollapsibleMenuProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubmenuItem[];
  tenantId: string;
}

export function CollapsibleMenu({ title, icon: Icon, items, tenantId }: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Verificar si algún item está activo
  const isAnyActive = items.some((item) => location === item.href);

  return (
    <div className="space-y-1">
      {/* Botón del menú principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
          isAnyActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1"
            : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
        )}
      >
        <Icon className={clsx("h-5 w-5", isAnyActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Submenu items */}
      {isOpen && (
        <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-blue-500/20 text-blue-200 border-l-2 border-blue-500 pl-3"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent"
                )}
              >
                <item.icon className={clsx("h-4 w-4", isActive ? "text-blue-300" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
