import { useTenants, useCreateTenant } from "@/hooks/use-accounting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTenantSchema } from "@shared/schema";
import { z } from "zod";
import { Link } from "wouter";
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type TenantForm = z.infer<typeof insertTenantSchema>;

export default function TenantSelection() {
  const { data: tenants, isLoading } = useTenants();
  const createTenant = useCreateTenant();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<TenantForm>({
    resolver: zodResolver(insertTenantSchema),
    defaultValues: {
      nombre: "",
      tipoEmpresa: "S.A.S",
      grupoNiif: "2",
      monedaFuncional: "COP",
      responsableContable: "",
    }
  });

  const onSubmit = async (data: TenantForm) => {
    try {
      await createTenant.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({
        title: "Empresa creada",
        description: `Se ha creado la empresa ${data.nombre} exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la empresa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20 mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Bienvenido a GRAVY</h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Sistema contable multi-empresa con soporte NIIF. 
            Selecciona una empresa para comenzar o crea una nueva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Tenant Card */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="group relative flex flex-col items-center justify-center h-48 bg-white border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer">
                <div className="p-3 bg-blue-50 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-slate-900">Nueva Empresa</span>
                <span className="text-sm text-slate-500 mt-1">Configura una organización</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Empresa</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre de la Empresa</label>
                  <input {...form.register("nombre")} className="input-field" placeholder="Ej: Industrias SAS" />
                  {form.formState.errors.nombre && <p className="text-xs text-red-500">{form.formState.errors.nombre.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <select {...form.register("tipoEmpresa")} className="input-field">
                      <option value="S.A.S">S.A.S</option>
                      <option value="S.A">S.A</option>
                      <option value="Ltda">Ltda</option>
                      <option value="Persona Natural">Persona Natural</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grupo NIIF</label>
                    <select {...form.register("grupoNiif")} className="input-field">
                      <option value="1">Grupo 1</option>
                      <option value="2">Grupo 2 (Pymes)</option>
                      <option value="3">Grupo 3 (Micro)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsable Contable</label>
                  <input {...form.register("responsableContable")} className="input-field" placeholder="Nombre del contador" />
                </div>

                <button 
                  type="submit" 
                  disabled={createTenant.isPending}
                  className="w-full btn-primary mt-4"
                >
                  {createTenant.isPending ? "Creando..." : "Crear Empresa"}
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* List Existing Tenants */}
          {isLoading ? (
             <div className="col-span-1 md:col-span-2 flex items-center justify-center h-48">
               <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
             </div>
          ) : (
            tenants?.map((tenant) => (
              <Link key={tenant.id} href={`/${tenant.id}/dashboard`} className="block">
                <div className="group h-48 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                        {tenant.tipoEmpresa}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        Grupo {tenant.grupoNiif}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {tenant.nombre}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500 font-mono-nums">ID: {tenant.id}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
