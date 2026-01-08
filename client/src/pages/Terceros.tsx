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
import { useState, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TerceroForm = Omit<z.infer<typeof insertTerceroSchema>, "tenantId">;

export default function Terceros() {
  const { tenantId } = useParams();
  const id = Number(tenantId);
  const { data: terceros, isLoading } = useTerceros(id);
  const createTercero = useCreateTercero(id);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
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

  // Paginación
  const totalPages = Math.ceil((filteredTerceros?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTerceros = filteredTerceros?.slice(startIndex, endIndex);

  // Reset página cuando se filtra
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o identificación..." 
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 whitespace-nowrap">Mostrar:</label>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="input-field w-20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Terceros */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12"><Loading /></div>
        ) : paginatedTerceros && paginatedTerceros.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-2 text-left font-medium text-slate-600">Identificación</th>
                    <th className="px-6 py-2 text-left font-medium text-slate-600">Nombre / Razón Social</th>
                    <th className="px-6 py-2 text-center font-medium text-slate-600">Tipo</th>
                    <th className="px-6 py-2 text-center font-medium text-slate-600">Estado NIIF</th>
                    <th className="px-6 py-2 text-center font-medium text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTerceros.map((tercero) => (
                    <tr key={tercero.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-mono text-sm font-medium text-slate-700">{tercero.identificacion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <span className="font-medium text-sm text-slate-900">{tercero.nombre}</span>
                      </td>
                      <td className="px-6 py-2 text-center">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold uppercase rounded-full">
                          {tercero.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-center">
                        {tercero.parteRelacionada ? (
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            Parte Relacionada
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-2 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Mostrando <span className="font-semibold">{startIndex + 1}</span> a <span className="font-semibold">{Math.min(endIndex, filteredTerceros?.length || 0)}</span> de <span className="font-semibold">{filteredTerceros?.length || 0}</span> terceros
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p>No se encontraron terceros.</p>
            {searchTerm && (
              <p className="text-sm mt-2">Prueba con otros términos de búsqueda.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
