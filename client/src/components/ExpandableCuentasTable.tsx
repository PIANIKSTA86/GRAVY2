import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, FolderTree } from "lucide-react";
import type { PlanCuenta } from "@shared/schema";

interface ExpandableCuentasTableProps {
  cuentas: PlanCuenta[];
  searchTerm: string;
}

interface CuentaWithChildren extends PlanCuenta {
  children?: CuentaWithChildren[];
  depth: number;
  isExpanded?: boolean;
}

interface RowData {
  cuenta: CuentaWithChildren;
  index: number;
  isExpanded: boolean;
  onToggle: (cuentaId: number) => void;
}

// Componente para cada fila
function CuentaRow({ cuenta, isExpanded, onToggle }: RowData) {
  const hasChildren = cuenta.children && cuenta.children.length > 0;
  const indent = cuenta.depth * 20;

  return (
    <div
      className="flex items-center px-6 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100"
      style={{ paddingLeft: `${indent + 24}px` }}
    >
      {/* Expandir/Colapsar */}
      {hasChildren ? (
        <button
          onClick={() => onToggle(cuenta.id)}
          className="mr-2 p-1 hover:bg-slate-200 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-600" />
          )}
        </button>
      ) : (
        <div className="w-6 mr-2" />
      )}

      {/* Ícono */}
      <FolderTree
        className={`h-4 w-4 mr-3 flex-shrink-0 ${
          cuenta.nivel === 1 ? "text-blue-600" : "text-slate-400"
        }`}
      />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4">
          <code className="font-mono font-medium text-slate-700 min-w-max">
            {cuenta.codigo}
          </code>
          <span className="text-slate-900 font-medium truncate">
            {cuenta.nombre}
          </span>
        </div>
      </div>

      {/* Nivel */}
      <div className="text-center text-slate-600 text-sm min-w-max px-4">
        Nivel {cuenta.nivel}
      </div>

      {/* Naturaleza */}
      <div className="text-center min-w-max px-4">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            cuenta.naturaleza === "D"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {cuenta.naturaleza === "D" ? "Débito" : "Crédito"}
        </span>
      </div>

      {/* Configuración */}
      <div className="text-center text-xs text-slate-600 min-w-max px-4">
        {cuenta.permiteTercero && <span className="mr-2">🧑</span>}
        {cuenta.permiteCentroCosto && <span>🎯</span>}
      </div>
    </div>
  );
}

// Función para construir estructura jerárquica
function buildHierarchy(cuentas: PlanCuenta[]): CuentaWithChildren[] {
  const cuentasMap = new Map<number, CuentaWithChildren>();

  // Crear mapa de cuentas
  cuentas.forEach((c) => {
    cuentasMap.set(c.id, {
      ...c,
      children: [],
      depth: 0,
    });
  });

  // Construir jerarquía
  const roots: CuentaWithChildren[] = [];

  cuentasMap.forEach((cuenta) => {
    if (!cuenta.padreId) {
      cuenta.depth = 0;
      roots.push(cuenta);
    } else {
      const padre = cuentasMap.get(cuenta.padreId);
      if (padre) {
        cuenta.depth = padre.depth + 1;
        if (!padre.children) padre.children = [];
        padre.children.push(cuenta);
      }
    }
  });

  // Ordenar por código
  const sortByCode = (items: CuentaWithChildren[]) => {
    items.sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));
    items.forEach((item) => {
      if (item.children) sortByCode(item.children);
    });
  };

  sortByCode(roots);
  return roots;
}

// Función para aplanar el árbol manteniendo la estructura
function flattenHierarchy(
  items: CuentaWithChildren[],
  expandedIds: Set<number>
): CuentaWithChildren[] {
  const flat: CuentaWithChildren[] = [];

  const traverse = (items: CuentaWithChildren[]) => {
    items.forEach((item) => {
      flat.push(item);
      if (expandedIds.has(item.id) && item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return flat;
}

// Función para filtrar y mantener padres visibles
function filterWithParents(
  items: CuentaWithChildren[],
  searchTerm: string
): CuentaWithChildren[] {
  if (!searchTerm.trim()) return items;

  const lowerSearch = searchTerm.toLowerCase();

  const matches = (item: CuentaWithChildren): boolean => {
    return (
      item.codigo.includes(searchTerm) ||
      item.nombre.toLowerCase().includes(lowerSearch)
    );
  };

  const filterItems = (items: CuentaWithChildren[]): CuentaWithChildren[] => {
    return items
      .map((item) => {
        const childrenFiltered = item.children ? filterItems(item.children) : [];
        const itemMatches = matches(item);

        if (itemMatches || childrenFiltered.length > 0) {
          return {
            ...item,
            children: childrenFiltered,
            isExpanded: childrenFiltered.length > 0 ? true : item.isExpanded,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as CuentaWithChildren[];
  };

  return filterItems(items);
}

export function ExpandableCuentasTable({ cuentas, searchTerm }: ExpandableCuentasTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1])); // Expandir nivel 1 por defecto
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hierarchy = useMemo(() => {
    const base = buildHierarchy(cuentas);
    return filterWithParents(base, searchTerm);
  }, [cuentas, searchTerm]);

  const flatList = useMemo(() => {
    return flattenHierarchy(hierarchy, expandedIds);
  }, [hierarchy, expandedIds]);

  const toggleExpand = useCallback((cuentaId: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cuentaId)) {
        newSet.delete(cuentaId);
      } else {
        newSet.add(cuentaId);
      }
      return newSet;
    });
  }, []);

  // Lazy loading con scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const scrollTop = scrollContainerRef.current.scrollTop;
    const itemHeight = 52;
    const visibleItems = Math.ceil(600 / itemHeight) + 5; // 5 items de buffer
    
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
    const end = start + visibleItems;
    
    setVisibleRange({ start, end });
  }, []);

  // Renderizar solo items visibles
  const visibleItems = flatList.slice(visibleRange.start, visibleRange.end);
  const offsetY = visibleRange.start * 52;

  if (flatList.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No se encontraron cuentas
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Encabezado */}
      <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center px-6 py-3 text-slate-500 font-medium text-sm">
          <div className="flex-1">Código</div>
          <div className="flex-1">Nombre</div>
          <div className="text-center px-4">Nivel</div>
          <div className="text-center px-4">Naturaleza</div>
          <div className="text-center px-4">Config</div>
        </div>
      </div>

      {/* Tabla con lazy loading */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        {/* Spacer superior */}
        <div style={{ height: offsetY }} />

        {/* Filas visibles */}
        <div>
          {visibleItems.map((cuenta) => (
            <CuentaRow
              key={cuenta.id}
              cuenta={cuenta}
              index={0}
              isExpanded={expandedIds.has(cuenta.id)}
              onToggle={toggleExpand}
            />
          ))}
        </div>

        {/* Spacer inferior */}
        <div style={{ height: Math.max(0, (flatList.length - visibleRange.end) * 52) }} />
      </div>

      {/* Footer con información */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        Mostrando {visibleItems.length} de {flatList.length} cuentas (Total: {cuentas.length})
      </div>
    </div>
  );
}
