import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { MessageSquare, Plus } from "lucide-react";

export default function PQRS() {
  const { tenantId } = useParams();

  return (
    <Layout tenantId={tenantId!}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">PQRS</h1>
          <p className="text-slate-500">Peticiones, Quejas, Reclamos y Sugerencias de los residentes.</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> Nueva Solicitud
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Módulo PQRS - En desarrollo</p>
      </div>
    </Layout>
  );
}
