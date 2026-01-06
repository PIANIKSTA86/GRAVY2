import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { useTerceros, useCreateTercero } from "@/hooks/use-accounting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTerceroSchema } from "@shared/schema";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TerceroForm = Omit<z.infer<typeof insertTerceroSchema>, "tenantId">;

export default function Terceros() {
  const { tenantId } = useParams();
  const id = Number(tenantId);
  const { data: terceros, isLoading } = useTerceros(id);
  const createTercero = useCreateTercero(id);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<TerceroForm>({
    resolver: zodResolver(insertTerceroSchema.omit({ tenantId: true })),
    defaultValues: {
      identificacion: "",
      nombre: "",
      tipo: "Cliente",
      parteRelacionada: false,
    }
  });

  const onSubmit = async (data: TerceroForm) => {
    try {
      await createTercero.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({ title: "Tercero creado exitosamente" });
    } catch (error) {
      toast({ title: "Error al crear tercero", variant: "destructive" });
    }
  };

  const filteredTerceros = terceros?.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.identificacion.includes(searchTerm)
  );

  return (
    <Layout tenantId={tenantId!}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Terceros</h1>
          <p className="text-slate-500">Administra clientes, proveedores y empleados.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary gap-2">
              <Plus className="h-4 w-4" /> Nuevo Tercero
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Tercero</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Identificación (NIT/CC)</label>
                <input {...form.register("identificacion")} className="input-field font-mono" placeholder="900123456" />
                {form.formState.errors.identificacion && <p className="text-xs text-red-500">{form.formState.errors.identificacion.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Razón Social / Nombre</label>
                <input {...form.register("nombre")} className="input-field" placeholder="Empresa SAS" />
                {form.formState.errors.nombre && <p className="text-xs text-red-500">{form.formState.errors.nombre.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select {...form.register("tipo")} className="input-field">
                    <option value="Cliente">Cliente</option>
                    <option value="Proveedor">Proveedor</option>
                    <option value="Empleado">Empleado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" {...form.register("parteRelacionada")} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Parte Relacionada (NIIF)
                  </label>
                </div>
              </div>

              <button type="submit" disabled={createTercero.isPending} className="w-full btn-primary mt-4">
                {createTercero.isPending ? "Guardando..." : "Guardar Tercero"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Search Bar - Full Width on Mobile */}
         <div className="md:col-span-2 lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar tercero por nombre o identificación..." 
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>

         {isLoading ? (
            <div className="col-span-full py-12"><Loading /></div>
         ) : filteredTerceros && filteredTerceros.length > 0 ? (
            filteredTerceros.map(tercero => (
              <div key={tercero.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{tercero.nombre}</h3>
                      <p className="text-xs text-slate-500 font-mono">{tercero.identificacion}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded border border-slate-100">
                    {tercero.tipo}
                  </span>
                </div>
                {tercero.parteRelacionada && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                      Parte Relacionada
                    </span>
                  </div>
                )}
              </div>
            ))
         ) : (
           <div className="col-span-full py-12 text-center text-slate-500">
             No se encontraron terceros.
           </div>
         )}
      </div>
    </Layout>
  );
}
