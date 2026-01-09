import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { useTenant, useCuentas, useTerceros, useAsientos } from "@/hooks/use-accounting";
import { StatCard } from "@/components/StatCard";
import { BookOpen, Users, FileText, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Dashboard() {
  const { tenantId } = useParams();
  const id = tenantId!; // Safe because route ensures it exists
  const { data: tenant, isLoading: loadingTenant } = useTenant(id);
  const { data: cuentas } = useCuentas(Number(id));
  const { data: terceros } = useTerceros(Number(id));
  const { data: asientos } = useAsientos(Number(id));

  if (loadingTenant) return <Loading />;

  // Simple stats calculation
  const totalCuentas = cuentas?.length || 0;
  const totalTerceros = terceros?.length || 0;
  const totalAsientos = asientos?.length || 0;
  const asientosBorrador = asientos?.filter(a => a.estado === 'Borrador').length || 0;

  return (
    <Layout tenantId={id}>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
          Panel General
        </h1>
        <p className="text-slate-600 mt-2">
          Resumen financiero para <span className="font-semibold text-blue-600">{tenant?.nombre}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Cuentas Activas"
          value={totalCuentas.toString()}
          subtitle="En el plan de cuentas"
          icon={BookOpen}
          color="blue"
        />
        <StatCard 
          title="Terceros Registrados"
          value={totalTerceros.toString()}
          subtitle="Clientes y proveedores"
          icon={Users}
          color="purple"
        />
        <StatCard 
          title="Asientos del Mes"
          value={totalAsientos.toString()}
          subtitle="Transacciones registradas"
          icon={FileText}
          color="green"
        />
        <StatCard 
          title="Pendientes"
          value={asientosBorrador.toString()}
          subtitle="Borradores por aprobar"
          icon={AlertCircle}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Actividad Reciente</h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">Últimos 5 asientos</span>
          </div>
          
          <div className="space-y-4">
            {asientos?.slice(0, 5).map(asiento => (
              <div key={asiento.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{asiento.descripcion}</h4>
                    <p className="text-xs text-slate-500 font-mono-nums">
                      {asiento.numero} • {format(new Date(asiento.fecha), "PPP", { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    asiento.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {asiento.estado}
                  </span>
                </div>
              </div>
            ))}
            {totalAsientos === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>No hay movimientos recientes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-b from-blue-900 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" /> Acciones Rápidas
          </h3>
          
          <div className="space-y-3">
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
               <span className="font-medium text-sm">Nuevo Asiento</span>
               <Calendar className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
             </button>
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
               <span className="font-medium text-sm">Crear Tercero</span>
               <Users className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
             </button>
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between group">
               <span className="font-medium text-sm">Ver Reportes</span>
               <TrendingUp className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
             </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Estado del Sistema</h4>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Base de Datos Conectada
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
