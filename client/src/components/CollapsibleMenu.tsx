import { useState, useEffect, useRef } from "react";
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
  onExpand?: () => void;
}

export function CollapsibleMenu({
  title,
  icon: Icon,
  items,
  tenantId,
  isCollapsed = false,
  onExpand,
}: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Verificar si algún item está activo
  const isAnyActive = items.some((item) => location === item.href);

  // Auto-close submenu when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  // Handle click when collapsed: expand sidebar instead of showing menu
  const handleCollapsedClick = () => {
    if (onExpand) {
      onExpand();
      // Small delay to allow sidebar to expand, then open menu
      setTimeout(() => setIsOpen(true), 100);
    }
  };

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
      <div className="space-y-1 relative" ref={menuRef}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleCollapsedClick}
              className={clsx(
                "w-full flex items-center justify-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
                isAnyActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              aria-label={title}
            >
              {buttonContent}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{title}</TooltipContent>
        </Tooltip>
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
