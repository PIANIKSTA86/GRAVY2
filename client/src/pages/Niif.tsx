import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { useNiifPoliticas, useCreateNiifPolitica } from "@/hooks/use-accounting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNiifPoliticaSchema } from "@shared/schema";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Scale, BookMarked } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PoliticaForm = Omit<z.infer<typeof insertNiifPoliticaSchema>, "tenantId">;

export default function Niif() {
  const { tenantId } = useParams();
  const id = Number(tenantId);
  const { data: politicas, isLoading } = useNiifPoliticas(id);
  const createPolitica = useCreateNiifPolitica(id);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PoliticaForm>({
    resolver: zodResolver(insertNiifPoliticaSchema.omit({ tenantId: true })),
    defaultValues: {
      modulo: "Activos Fijos",
      metodoMedicion: "",
      cuentasAsociadas: "",
    }
  });

  const onSubmit = async (data: PoliticaForm) => {
    try {
      await createPolitica.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({ title: "Política NIIF guardada" });
    } catch (error) {
      toast({ title: "Error al guardar política", variant: "destructive" });
    }
  };

  return (
    <Layout tenantId={tenantId!}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Políticas NIIF</h1>
          <p className="text-slate-500">Manual de políticas contables y revelaciones.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary gap-2">
              <Plus className="h-4 w-4" /> Nueva Política
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Definir Política Contable</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Módulo</label>
                <select {...form.register("modulo")} className="input-field">
                  <option value="Activos Fijos">Activos Fijos (PPE)</option>
                  <option value="Inventarios">Inventarios</option>
                  <option value="Cuentas por Cobrar">Cuentas por Cobrar</option>
                  <option value="Intangibles">Intangibles</option>
                  <option value="Pasivos">Pasivos Financieros</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Medición</label>
                <textarea 
                  {...form.register("metodoMedicion")} 
                  className="input-field min-h-[100px]" 
                  placeholder="Ej: Costo histórico menos depreciación acumulada..." 
                />
                {form.formState.errors.metodoMedicion && <p className="text-xs text-red-500">{form.formState.errors.metodoMedicion.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cuentas Asociadas (Opcional)</label>
                <input {...form.register("cuentasAsociadas")} className="input-field" placeholder="15, 1505, 1510" />
              </div>

              <button type="submit" disabled={createPolitica.isPending} className="w-full btn-primary mt-4">
                {createPolitica.isPending ? "Guardando..." : "Guardar Política"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full"><Loading /></div>
        ) : politicas && politicas.length > 0 ? (
          politicas.map(politica => (
            <div key={politica.id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Scale className="h-24 w-24 text-slate-900" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <BookMarked className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{politica.modulo}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Medición</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{politica.metodoMedicion}</p>
                  </div>
                  
                  {politica.cuentasAsociadas && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Alcance (Cuentas)</p>
                      <div className="flex flex-wrap gap-2">
                        {politica.cuentasAsociadas.split(',').map((cuenta, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono font-medium">
                            {cuenta.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Scale className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p>No se han definido políticas contables.</p>
            <p className="text-sm">Define las reglas para el reconocimiento y medición de tus transacciones.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
