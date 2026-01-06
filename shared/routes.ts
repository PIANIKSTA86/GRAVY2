import { z } from 'zod';
import { 
  insertTenantSchema, 
  insertPlanCuentasSchema, 
  insertTerceroSchema, 
  createAsientoCompletoSchema,
  insertNiifPoliticaSchema,
  tenants,
  planCuentas,
  terceros,
  asientos,
  niifPoliticas
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tenants: {
    list: {
      method: 'GET' as const,
      path: '/api/tenants',
      responses: {
        200: z.array(z.custom<typeof tenants.$inferSelect>()),
      },
    },
    listByOwner: {
      method: 'GET' as const,
      path: '/api/my-tenants',
      responses: {
        200: z.array(z.custom<typeof tenants.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tenants',
      input: insertTenantSchema,
      responses: {
        201: z.custom<typeof tenants.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tenants/:id',
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  terceros: {
    list: {
      method: 'GET' as const,
      path: '/api/:tenantId/terceros',
      responses: {
        200: z.array(z.custom<typeof terceros.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/:tenantId/terceros',
      input: insertTerceroSchema.omit({ tenantId: true }),
      responses: {
        201: z.custom<typeof terceros.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  planCuentas: {
    list: {
      method: 'GET' as const,
      path: '/api/:tenantId/cuentas',
      responses: {
        200: z.array(z.custom<typeof planCuentas.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/:tenantId/cuentas',
      input: insertPlanCuentasSchema.omit({ tenantId: true }),
      responses: {
        201: z.custom<typeof planCuentas.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  asientos: {
    create: {
      method: 'POST' as const,
      path: '/api/:tenantId/asientos',
      input: createAsientoCompletoSchema.omit({ tenantId: true }),
      responses: {
        201: z.custom<typeof asientos.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/:tenantId/asientos',
      responses: {
        200: z.array(z.custom<typeof asientos.$inferSelect>()),
      },
    }
  },
  niif: {
    politicas: {
      list: {
        method: 'GET' as const,
        path: '/api/:tenantId/niif/politicas',
        responses: {
          200: z.array(z.custom<typeof niifPoliticas.$inferSelect>()),
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/:tenantId/niif/politicas',
        input: insertNiifPoliticaSchema.omit({ tenantId: true }),
        responses: {
          201: z.custom<typeof niifPoliticas.$inferSelect>(),
          400: errorSchemas.validation,
        },
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
