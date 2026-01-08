import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Pais, Departamento, Municipio } from "@shared/schema";

export function usePaises() {
  return useQuery({
    queryKey: [api.catalogos.paises.path],
    queryFn: async () => {
      const res = await fetch(api.catalogos.paises.path);
      if (!res.ok) throw new Error("Error fetching países");
      return res.json() as Promise<Pais[]>;
    },
    staleTime: Infinity, // Los catálogos no cambian frecuentemente
  });
}

export function useDepartamentos(paisCodigo?: string) {
  return useQuery({
    queryKey: [api.catalogos.departamentos.path, paisCodigo],
    queryFn: async () => {
      const url = paisCodigo 
        ? `${api.catalogos.departamentos.path}?pais=${paisCodigo}`
        : api.catalogos.departamentos.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching departamentos");
      return res.json() as Promise<Departamento[]>;
    },
    enabled: !!paisCodigo,
    staleTime: Infinity,
  });
}

export function useMunicipios(departamentoCodigo?: string) {
  return useQuery({
    queryKey: [api.catalogos.municipios.path, departamentoCodigo],
    queryFn: async () => {
      const url = departamentoCodigo
        ? `${api.catalogos.municipios.path}?departamento=${departamentoCodigo}`
        : api.catalogos.municipios.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching municipios");
      return res.json() as Promise<Municipio[]>;
    },
    enabled: !!departamentoCodigo,
    staleTime: Infinity,
  });
}
