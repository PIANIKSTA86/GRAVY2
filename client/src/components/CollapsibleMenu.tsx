import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  isCollapsed?: boolean;
}

export function CollapsibleMenu({
  title,
  icon: Icon,
  items,
  tenantId,
  isCollapsed = false,
}: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Verificar si algún item está activo
  const isAnyActive = items.some((item) => location === item.href);

  // Auto-close submenu when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const buttonContent = (
    <>
      <Icon
        className={clsx(
          "h-5 w-5 shrink-0",
          isAnyActive
            ? "text-white"
            : "text-slate-500 group-hover:text-white"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{title}</span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 transition-transform duration-200 shrink-0",
              isOpen ? "rotate-180" : ""
            )}
          />
        </>
      )}
    </>
  );

  if (isCollapsed) {
    return (
      <div className="space-y-1 relative">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                "w-full flex items-center justify-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
                isAnyActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              aria-expanded={isOpen}
              aria-label={title}
            >
              {buttonContent}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{title}</TooltipContent>
        </Tooltip>

        {/* Overlay submenu when collapsed */}
        {isOpen && (
          <div
            className="absolute left-20 top-0 mt-0 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl w-56 z-40 animate-in fade-in slide-in-from-left-2 duration-200"
            role="menu"
          >
            {items.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  role="menuitem"
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
                    isActive
                      ? "bg-blue-600/20 text-slate-100"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
          isAnyActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/40 translate-x-1"
            : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
        )}
        aria-expanded={isOpen}
      >
        {buttonContent}
      </button>

      {/* Expanded submenu */}
      {isOpen && (
        <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
                  isActive
                    ? "bg-blue-600/20 text-slate-100 border-l-2 border-blue-600 pl-3"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent"
                )}
              >
                <item.icon
                  className={clsx(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
