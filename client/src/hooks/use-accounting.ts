import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  InsertTenant, 
  InsertPlanCuenta, 
  InsertTercero, 
  CreateAsientoCompleto,
  InsertNiifPolitica 
} from "@shared/schema";

// TENANTS
export function useTenants() {
  return useQuery({
    queryKey: [api.tenants.list.path],
    queryFn: async () => {
      const res = await fetch(api.tenants.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching tenants");
      return api.tenants.list.responses[200].parse(await res.json());
    },
  });
}

export function useTenant(id: string | undefined) {
  return useQuery({
    queryKey: [api.tenants.get.path, id],
    queryFn: async () => {
      if (!id || id === 'undefined' || id === 'null') return null;
      const url = buildUrl(api.tenants.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching tenant");
      return api.tenants.get.responses[200].parse(await res.json());
    },
    enabled: !!id && id !== 'undefined' && id !== 'null',
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTenant) => {
      const res = await fetch(api.tenants.create.path, {
        method: api.tenants.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error creating tenant");
      return api.tenants.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tenants.list.path] });
    },
  });
}

// CUENTAS (PLAN DE CUENTAS)
export function useCuentas(tenantId: number) {
  return useQuery({
    queryKey: [api.planCuentas.list.path, tenantId],
    queryFn: async () => {
      const url = buildUrl(api.planCuentas.list.path, { tenantId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching plan de cuentas");
      return api.planCuentas.list.responses[200].parse(await res.json());
    },
    enabled: !!tenantId,
  });
}

export function useCreateCuenta(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertPlanCuenta, "tenantId">) => {
      const url = buildUrl(api.planCuentas.create.path, { tenantId });
      const res = await fetch(url, {
        method: api.planCuentas.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error creating cuenta");
      return api.planCuentas.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.planCuentas.list.path, tenantId] });
    },
  });
}

// TERCEROS
export function useTerceros(tenantId: number) {
  return useQuery({
    queryKey: [api.terceros.list.path, tenantId],
    queryFn: async () => {
      const url = buildUrl(api.terceros.list.path, { tenantId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching terceros");
      return api.terceros.list.responses[200].parse(await res.json());
    },
    enabled: !!tenantId,
  });
}

export function useCreateTercero(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertTercero, "tenantId">) => {
      const url = buildUrl(api.terceros.create.path, { tenantId });
      const res = await fetch(url, {
        method: api.terceros.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error creating tercero");
      return api.terceros.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.terceros.list.path, tenantId] });
    },
  });
}

export function useUpdateTercero(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; data: Omit<InsertTercero, "tenantId"> }) => {
      const url = buildUrl(api.terceros.update.path, { tenantId, id: payload.id });
      const res = await fetch(url, {
        method: api.terceros.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("not_found");
        throw new Error("Error updating tercero");
      }
      return api.terceros.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.terceros.list.path, tenantId] });
    },
  });
}

export function useDeleteTercero(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.terceros.delete.path, { tenantId, id });
      const res = await fetch(url, {
        method: api.terceros.delete.method,
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("not_found");
        throw new Error("Error deleting tercero");
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.terceros.list.path, tenantId] });
    },
  });
}

// ASIENTOS
export function useAsientos(tenantId: number) {
  return useQuery({
    queryKey: [api.asientos.list.path, tenantId],
    queryFn: async () => {
      const url = buildUrl(api.asientos.list.path, { tenantId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching asientos");
      return api.asientos.list.responses[200].parse(await res.json());
    },
    enabled: !!tenantId,
  });
}

export function useCreateAsiento(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CreateAsientoCompleto, "tenantId">) => {
      const url = buildUrl(api.asientos.create.path, { tenantId });
      const res = await fetch(url, {
        method: api.asientos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error creating asiento");
      return api.asientos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.asientos.list.path, tenantId] });
    },
  });
}

// NIIF POLITICAS
export function useNiifPoliticas(tenantId: number) {
  return useQuery({
    queryKey: [api.niif.politicas.list.path, tenantId],
    queryFn: async () => {
      const url = buildUrl(api.niif.politicas.list.path, { tenantId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error fetching NIIF policies");
      return api.niif.politicas.list.responses[200].parse(await res.json());
    },
    enabled: !!tenantId,
  });
}

export function useCreateNiifPolitica(tenantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertNiifPolitica, "tenantId">) => {
      const url = buildUrl(api.niif.politicas.create.path, { tenantId });
      const res = await fetch(url, {
        method: api.niif.politicas.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error creating NIIF policy");
      return api.niif.politicas.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.niif.politicas.list.path, tenantId] });
    },
  });
}
