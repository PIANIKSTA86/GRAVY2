import { Link, useLocation } from "wouter";
import { useTenant } from "@/hooks/use-accounting";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  Building2,
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Scale,
  LogOut,
  Menu,
  X,
  Calculator,
  Home,
  FileArchive,
  Calendar,
  FileArchive as ArchiveIcon,
  MessageSquare,
  FileSpreadsheet,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { CollapsibleMenu } from "./CollapsibleMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
  tenantId: string;
}

export default function Layout({ children, tenantId }: LayoutProps) {
  const [location] = useLocation();
  const { data: tenant } = useTenant(tenantId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  const dashboardItem = { name: "Dashboard", href: `/${tenantId}/dashboard`, icon: LayoutDashboard };

  const contabilidadItems = [
    { name: "Plan de Cuentas", href: `/${tenantId}/cuentas`, icon: BookOpen },
    { name: "Terceros", href: `/${tenantId}/terceros`, icon: Users },
    { name: "Asientos Contables", href: `/${tenantId}/asientos`, icon: FileText },
    { name: "Políticas NIIF", href: `/${tenantId}/niif`, icon: Scale },
    { name: "Períodos Contables", href: `/${tenantId}/periodos`, icon: Calendar },
    { name: "Comprobantes", href: `/${tenantId}/comprobantes`, icon: FileSpreadsheet },
  ];

  const miComunidadItems = [
    { name: "Unidades", href: `/${tenantId}/unidades`, icon: Home },
    { name: "Facturación PH", href: `/${tenantId}/facturacion-ph`, icon: FileText },
    { name: "Reservas", href: `/${tenantId}/reservas`, icon: Calendar },
    { name: "Documentos", href: `/${tenantId}/documentos`, icon: ArchiveIcon },
    { name: "PQRS", href: `/${tenantId}/pqrs`, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside
        data-state={isCollapsed ? "collapsed" : "expanded"}
        className={clsx(
          "hidden lg:flex flex-col bg-slate-950 text-white fixed h-full shadow-2xl shadow-slate-950/60 z-20 transition-all duration-300 ease-linear",
          "border-r border-slate-800/80 backdrop-blur-sm",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header - Logo & Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
          <img
            src="/icono.png"
            alt="ContaGrav"
            className="h-10 w-10 rounded-lg border border-blue-500/30 bg-white object-contain shadow-lg shadow-blue-600/40"
          />
          {!isCollapsed && (
            <div className="flex-1 animate-in fade-in duration-300">
              <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">
                GRAVY
              </h1>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Contabilidad Pro
              </p>
            </div>
          )}
          {/* Toggle Button - Integrated in Header */}
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Colapsar sidebar"
              title="Colapsar (Ctrl+B)"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}
          {/* Expand Button when Collapsed */}
          {isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Expandir sidebar"
              title="Expandir (Ctrl+B)"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tenant Info */}
        {tenant && !isCollapsed && (
          <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 animate-in fade-in duration-300 shrink-0">
            <p className="text-xs text-slate-400 font-medium mb-1">
              Empresa Actual
            </p>
            <p className="font-semibold truncate text-slate-100">
              {tenant.nombre}
            </p>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <Link
            href={dashboardItem.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
              isCollapsed && "justify-center",
              location === dashboardItem.href
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1"
                : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
            )}
            title={isCollapsed ? dashboardItem.name : undefined}
          >
            <dashboardItem.icon
              className={clsx(
                "h-5 w-5 shrink-0",
                location === dashboardItem.href
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              )}
            />
            {!isCollapsed && <span>{dashboardItem.name}</span>}
          </Link>

          <CollapsibleMenu
            title="Contabilidad"
            icon={Calculator}
            items={contabilidadItems}
            tenantId={tenantId}
            isCollapsed={isCollapsed}
            onExpand={toggleSidebar}
          />

          <CollapsibleMenu
            title="Mi Comunidad"
            icon={Building2}
            items={miComunidadItems}
            tenantId={tenantId}
            isCollapsed={isCollapsed}
            onExpand={toggleSidebar}
          />
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <Link
            href="/"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
              isCollapsed && "justify-center",
              "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
            title={isCollapsed ? "Cambiar Empresa" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Cambiar Empresa</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2">
          <img
            src="/icono.png"
            alt="ContaGrav"
            className="h-8 w-8 rounded-md bg-white object-contain"
          />
          <span className="font-display font-bold text-lg">GRAVY</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Sheet Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navegación</SheetTitle>
            <SheetDescription>Menú de navegación principal</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              {tenant && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Empresa Actual
                  </p>
                  <p className="font-semibold truncate text-slate-900">
                    {tenant.nombre}
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
              {/* Dashboard */}
              <div className="space-y-2">
                <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Principal
                </p>
                <Link
                  href={dashboardItem.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    location === dashboardItem.href
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <dashboardItem.icon className="h-5 w-5" />
                  {dashboardItem.name}
                </Link>
              </div>

              {/* Contabilidad */}
              <div className="space-y-2">
                <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contabilidad
                </p>
                {contabilidadItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      location === item.href
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mi Comunidad */}
              <div className="space-y-2">
                <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mi Comunidad
                </p>
                {miComunidadItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      location === item.href
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Salir
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={clsx(
          "flex-1 w-full min-h-screen flex flex-col transition-all duration-300 ease-linear",
          "pt-16 lg:pt-0",
          isCollapsed ? "lg:pl-24" : "lg:pl-72"
        )}
      >
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
