import { Link, useLocation } from "wouter";
import { useTenant } from "@/hooks/use-accounting";
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
  FileSpreadsheet
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { CollapsibleMenu } from "./CollapsibleMenu";

interface LayoutProps {
  children: React.ReactNode;
  tenantId: string;
}

export default function Layout({ children, tenantId }: LayoutProps) {
  const [location] = useLocation();
  const { data: tenant } = useTenant(tenantId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white fixed h-full shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">GRAVY</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Contabilidad Pro</p>
          </div>
        </div>

        {tenant && (
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Empresa Actual</p>
            <p className="font-semibold truncate text-blue-200">{tenant.nombre}</p>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-1">
          {/* Dashboard */}
          <Link 
            href={dashboardItem.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
              location === dashboardItem.href
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
            )}
          >
            <dashboardItem.icon className={clsx("h-5 w-5", location === dashboardItem.href ? "text-white" : "text-slate-400 group-hover:text-white")} />
            {dashboardItem.name}
          </Link>

          {/* Contabilidad Menu */}
          <CollapsibleMenu 
            title="Contabilidad"
            icon={Calculator}
            items={contabilidadItems}
            tenantId={tenantId}
          />

          {/* Mi Comunidad Menu */}
          <CollapsibleMenu 
            title="Mi Comunidad"
            icon={Building2}
            items={miComunidadItems}
            tenantId={tenantId}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cambiar Empresa
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2">
           <Building2 className="text-blue-500 h-6 w-6" />
           <span className="font-display font-bold text-lg">GRAVY</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900 z-10 pt-20 px-4 lg:hidden">
           <nav className="space-y-2">
            {/* Dashboard */}
            <Link 
              href={dashboardItem.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg transition-colors",
                location === dashboardItem.href
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              <dashboardItem.icon className="h-5 w-5" />
              {dashboardItem.name}
            </Link>

            {/* Contabilidad Items */}
            <div className="space-y-1 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contabilidad</p>
              {contabilidadItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-6 py-3 text-base font-medium rounded-lg transition-colors ml-2",
                    location === item.href
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mi Comunidad Items */}
            <div className="space-y-1 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Mi Comunidad</p>
              {miComunidadItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-6 py-3 text-base font-medium rounded-lg transition-colors ml-2",
                    location === item.href
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>

             <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-4 text-base font-medium text-red-400 hover:bg-slate-800 rounded-lg mt-8"
            >
              <LogOut className="h-5 w-5" />
              Salir de {tenant?.nombre}
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 w-full min-h-screen flex flex-col">
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
