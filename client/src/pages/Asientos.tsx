import Layout from "@/components/Layout";
import { useParams } from "wouter";
import { useAsientos, useCreateAsiento, useCuentas, useTerceros } from "@/hooks/use-accounting";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAsientoCompletoSchema } from "@shared/schema";
import { z } from "zod";
import { Loading } from "@/components/ui/Loading";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type AsientoForm = Omit<z.infer<typeof createAsientoCompletoSchema>, "tenantId">;

export default function Asientos() {
  const { tenantId } = useParams();
  const id = Number(tenantId);
  
  const { data: asientos, isLoading } = useAsientos(id);
  const { data: cuentas } = useCuentas(id);
  const { data: terceros } = useTerceros(id);
  
  const createAsiento = useCreateAsiento(id);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AsientoForm>({
    resolver: zodResolver(createAsientoCompletoSchema.omit({ tenantId: true })),
    defaultValues: {
      fecha: new Date(),
      tipoComprobante: "Diario",
      numero: "",
      descripcion: "",
      lineas: [
        { cuentaId: 0, debito: "0", credito: "0" }, // Initial line
        { cuentaId: 0, debito: "0", credito: "0" }  // Second line for balance
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineas"
  });

  // Calculate totals for validation display
  const lineas = form.watch("lineas");
  const totalDebito = lineas?.reduce((acc, curr) => acc + Number(curr.debito || 0), 0) || 0;
  const totalCredito = lineas?.reduce((acc, curr) => acc + Number(curr.credito || 0), 0) || 0;
  const isBalanced = Math.abs(totalDebito - totalCredito) < 0.01;

  const onSubmit = async (data: AsientoForm) => {
    if (!isBalanced) {
      toast({ 
        title: "Asiento Descuadrado", 
        description: "La suma de débitos y créditos debe ser igual.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      await createAsiento.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({ title: "Asiento registrado exitosamente" });
    } catch (error) {
      toast({ title: "Error al registrar asiento", variant: "destructive" });
    }
  };

  return (
    <Layout tenantId={tenantId!}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Libro Diario</h1>
          <p className="text-slate-500">Registro de movimientos contables.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary gap-2">
              <Plus className="h-4 w-4" /> Nuevo Asiento
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Asiento Contable</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              
              {/* Cabecera */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Fecha</label>
                  <input type="date" {...form.register("fecha")} className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                  <select {...form.register("tipoComprobante")} className="input-field">
                    <option value="Diario">Diario</option>
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                    <option value="Ajuste">Ajuste</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Número</label>
                  <input {...form.register("numero")} className="input-field font-mono" placeholder="AUTO" />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                  <input {...form.register("descripcion")} className="input-field" placeholder="Detalle de la transacción..." />
                  {form.formState.errors.descripcion && <p className="text-xs text-red-500">{form.formState.errors.descripcion.message}</p>}
                </div>
              </div>

              {/* Lineas */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <h3 className="font-bold text-slate-900">Detalle del Movimiento</h3>
                   <button type="button" onClick={() => append({ cuentaId: 0, debito: "0", credito: "0" })} className="text-sm text-blue-600 font-medium hover:underline">
                     + Agregar Línea
                   </button>
                 </div>

                 <div className="space-y-3">
                   {fields.map((field, index) => (
                     <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-3 bg-white border border-slate-100 rounded-lg hover:shadow-sm transition-shadow">
                       <div className="col-span-4 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Cuenta</label>
                         <select 
                           {...form.register(`lineas.${index}.cuentaId`, { valueAsNumber: true })} 
                           className="input-field h-9 text-xs"
                         >
                           <option value="">Seleccionar Cuenta...</option>
                           {cuentas?.map(c => (
                             <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>
                           ))}
                         </select>
                         {form.formState.errors.lineas?.[index]?.cuentaId && <p className="text-[10px] text-red-500">Requerido</p>}
                       </div>

                       <div className="col-span-3 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Tercero (Opcional)</label>
                         <select 
                           {...form.register(`lineas.${index}.terceroId`, { valueAsNumber: true })} 
                           className="input-field h-9 text-xs"
                         >
                            <option value="">Ninguno</option>
                            {terceros?.map(t => (
                              <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                         </select>
                       </div>

                       <div className="col-span-2 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase text-right block">Débito</label>
                         <input 
                           type="number" 
                           step="0.01" 
                           {...form.register(`lineas.${index}.debito`)} 
                           className="input-field h-9 text-xs text-right font-mono" 
                         />
                       </div>

                       <div className="col-span-2 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase text-right block">Crédito</label>
                         <input 
                           type="number" 
                           step="0.01" 
                           {...form.register(`lineas.${index}.credito`)} 
                           className="input-field h-9 text-xs text-right font-mono" 
                         />
                       </div>

                       <div className="col-span-1 flex items-end justify-center h-full pb-1">
                          <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Footer Totals */}
              <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl">
                 <div className="flex items-center gap-2">
                   {!isBalanced && (
                     <div className="flex items-center gap-2 text-red-600 text-sm font-bold animate-pulse">
                       <AlertCircle className="h-4 w-4" />
                       Descuadrado por: {Math.abs(totalDebito - totalCredito).toFixed(2)}
                     </div>
                   )}
                   {isBalanced && <span className="text-green-600 text-sm font-bold">Asiento Balanceado</span>}
                 </div>
                 <div className="text-right space-y-1">
                   <div className="flex gap-8 text-sm">
                     <span className="text-slate-500">Total Débito:</span>
                     <span className="font-mono font-bold text-slate-900">{totalDebito.toFixed(2)}</span>
                   </div>
                   <div className="flex gap-8 text-sm">
                     <span className="text-slate-500">Total Crédito:</span>
                     <span className="font-mono font-bold text-slate-900">{totalCredito.toFixed(2)}</span>
                   </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={createAsiento.isPending || !isBalanced} 
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAsiento.isPending ? "Guardando..." : "Registrar Asiento"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {asientos?.map(asiento => (
            <div key={asiento.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-600">
                      <span className="text-xs font-bold uppercase">{format(new Date(asiento.fecha), "MMM")}</span>
                      <span className="text-lg font-bold font-mono">{format(new Date(asiento.fecha), "dd")}</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900">{asiento.descripcion}</h3>
                     <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                       <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{asiento.numero}</span>
                       <span>•</span>
                       <span>{asiento.tipoComprobante}</span>
                     </div>
                   </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${asiento.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {asiento.estado}
                </div>
              </div>
            </div>
          ))}
          {asientos?.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No hay asientos registrados.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
