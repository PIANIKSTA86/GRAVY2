export function Loading() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Cargando datos...</p>
      </div>
    </div>
  );
}
