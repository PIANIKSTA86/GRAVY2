import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { useCuentas, useCreateCuenta } from "@/hooks/use-accounting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlanCuentasSchema } from "@shared/schema";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Search, FolderTree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CuentaForm = Omit<z.infer<typeof insertPlanCuentasSchema>, "tenantId">;

export default function PlanCuentas() {
  const { tenantId } = useParams();
  const id = Number(tenantId);
  const { data: cuentas, isLoading } = useCuentas(id);
  const createCuenta = useCreateCuenta(id);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<CuentaForm>({
    resolver: zodResolver(insertPlanCuentasSchema.omit({ tenantId: true })),
    defaultValues: {
      codigo: "",
      nombre: "",
      nivel: 1,
      naturaleza: "D",
      permiteTercero: false,
      permiteCentroCosto: false,
    }
  });

  const onSubmit = async (data: CuentaForm) => {
    try {
      await createCuenta.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({ title: "Cuenta creada exitosamente" });
    } catch (error) {
      toast({ title: "Error al crear cuenta", variant: "destructive" });
    }
  };

  const filteredCuentas = cuentas?.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.codigo.includes(searchTerm)
  );

  return (
    <Layout tenantId={tenantId!}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Plan de Cuentas</h1>
          <p className="text-slate-500">Gestiona la estructura contable de tu empresa.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary gap-2">
              <Plus className="h-4 w-4" /> Nueva Cuenta
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Cuenta Contable</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código</label>
                  <input {...form.register("codigo")} className="input-field font-mono" placeholder="1105" />
                  {form.formState.errors.codigo && <p className="text-xs text-red-500">{form.formState.errors.codigo.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel</label>
                  <input {...form.register("nivel", { valueAsNumber: true })} type="number" className="input-field" min="1" max="5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Cuenta</label>
                <input {...form.register("nombre")} className="input-field" placeholder="Caja General" />
                {form.formState.errors.nombre && <p className="text-xs text-red-500">{form.formState.errors.nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Naturaleza</label>
                <select {...form.register("naturaleza")} className="input-field">
                  <option value="D">Débito</option>
                  <option value="C">Crédito</option>
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" {...form.register("permiteTercero")} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Exige Tercero
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" {...form.register("permiteCentroCosto")} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Exige C. Costo
                </label>
              </div>

              <button type="submit" disabled={createCuenta.isPending} className="w-full btn-primary mt-4">
                {createCuenta.isPending ? "Guardando..." : "Guardar Cuenta"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por código o nombre..." 
            className="bg-transparent border-none focus:outline-none flex-1 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="p-12"><Loading /></div>
        ) : filteredCuentas && filteredCuentas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3 text-center">Nivel</th>
                  <th className="px-6 py-3 text-center">Naturaleza</th>
                  <th className="px-6 py-3 text-center">Configuración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCuentas.map((cuenta) => (
                  <tr key={cuenta.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3 font-mono font-medium text-slate-700">{cuenta.codigo}</td>
                    <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
                       <FolderTree className={`h-4 w-4 ${cuenta.nivel === 1 ? 'text-blue-600' : 'text-slate-400'}`} />
                       <span style={{ paddingLeft: `${(cuenta.nivel - 1) * 12}px` }}>
                         {cuenta.nombre}
                       </span>
                    </td>
                    <td className="px-6 py-3 text-center text-slate-500">{cuenta.nivel}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${cuenta.naturaleza === 'D' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {cuenta.naturaleza === 'D' ? 'Débito' : 'Crédito'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {cuenta.permiteTercero && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded uppercase font-bold tracking-wider">Tercero</span>}
                        {cuenta.permiteCentroCosto && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded uppercase font-bold tracking-wider">CC</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <p>No se encontraron cuentas.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
