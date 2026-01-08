// Utilidades para Tipos de Régimen Tributario DIAN (Colombia)
// Códigos estándar establecidos por la Dirección de Impuestos y Aduanas Nacionales

export const TIPOS_REGIMEN_DIAN = {
  '33': 'Responsable de Impuesto Nacional al Consumo',
  '47': 'RST (Régimen Simple de Tributación)',
  '48': 'Responsable de IVA',
  '49': 'No Responsable de IVA',
  '50': 'RST con Impuesto Nacional al Consumo',
} as const;

export type CodigoRegimenDIAN = keyof typeof TIPOS_REGIMEN_DIAN;

/**
 * Array de opciones para selects/dropdowns
 */
export const OPCIONES_TIPO_REGIMEN = Object.entries(TIPOS_REGIMEN_DIAN).map(
  ([codigo, descripcion]) => ({
    value: codigo,
    label: `${codigo} - ${descripcion}`,
    descripcion,
  })
);

/**
 * Obtener descripción legible de un código DIAN de régimen
 */
export function getDescripcionTipoRegimen(codigo: string): string {
  return TIPOS_REGIMEN_DIAN[codigo as CodigoRegimenDIAN] || 'Desconocido';
}

/**
 * Validar si un código DIAN de régimen es válido
 */
export function isCodigoRegimenDIANValido(codigo: string): codigo is CodigoRegimenDIAN {
  return codigo in TIPOS_REGIMEN_DIAN;
}

/**
 * Determinar si un régimen es RST (Régimen Simple)
 */
export function esRegimenSimple(codigoRegimen: string): boolean {
  return codigoRegimen === '47' || codigoRegimen === '50';
}

/**
 * Determinar si un régimen es responsable de IVA
 */
export function esResponsableIVA(codigoRegimen: string): boolean {
  return codigoRegimen === '48';
}

/**
 * Determinar si un régimen NO es responsable de IVA
 */
export function noResponsableIVA(codigoRegimen: string): boolean {
  return codigoRegimen === '49';
}

/**
 * Determinar si un régimen tiene responsabilidad de Impuesto al Consumo
 */
export function tieneImpuestoConsumo(codigoRegimen: string): boolean {
  return codigoRegimen === '33' || codigoRegimen === '50';
}

/**
 * Obtener información completa del régimen
 */
export function getInfoRegimen(codigoRegimen: string) {
  return {
    codigo: codigoRegimen,
    descripcion: getDescripcionTipoRegimen(codigoRegimen),
    esRST: esRegimenSimple(codigoRegimen),
    responsableIVA: esResponsableIVA(codigoRegimen),
    noResponsableIVA: noResponsableIVA(codigoRegimen),
    tieneImpConsumo: tieneImpuestoConsumo(codigoRegimen),
  };
}

/**
 * Obtener régimen sugerido según características del tercero
 */
export function getRegimenSugerido(params: {
  tipoPersona: 'persona_natural' | 'persona_juridica';
  ingresosAnuales?: number;
  actividadEconomica?: string;
}): CodigoRegimenDIAN {
  const { tipoPersona, ingresosAnuales } = params;

  // RST: Para pequeñas empresas (límite aproximado 50.000 UVT ≈ $2.100M COP 2024)
  if (ingresosAnuales && ingresosAnuales < 2100000000) {
    return '47'; // RST
  }

  // Personas jurídicas generalmente son responsables de IVA
  if (tipoPersona === 'persona_juridica') {
    return '48'; // Responsable de IVA
  }

  // Personas naturales con bajos ingresos
  if (tipoPersona === 'persona_natural') {
    return '49'; // No Responsable de IVA
  }

  // Default: Responsable de IVA
  return '48';
}

/**
 * Validar compatibilidad régimen - tipo persona
 */
export function esRegimenCompatible(
  codigoRegimen: string,
  tipoPersona: 'persona_natural' | 'persona_juridica'
): boolean {
  // RST (47 y 50) es más común en personas naturales y pequeñas empresas
  if (esRegimenSimple(codigoRegimen)) {
    return true; // Ambos pueden tener RST
  }

  // Responsable IVA (48) es más común en personas jurídicas
  if (esResponsableIVA(codigoRegimen)) {
    return tipoPersona === 'persona_juridica'; // Advertencia si es persona natural
  }

  // No responsable IVA (49) es más común en personas naturales
  if (noResponsableIVA(codigoRegimen)) {
    return tipoPersona === 'persona_natural'; // Advertencia si es persona jurídica
  }

  // Impuesto al consumo (33) puede aplicar a ambos
  return true;
}

/**
 * Obtener badge color según régimen
 */
export function getColorBadgeRegimen(codigoRegimen: string): {
  bg: string;
  text: string;
} {
  switch (codigoRegimen) {
    case '48': // Responsable IVA
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case '49': // No Responsable IVA
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
    case '47': // RST
      return { bg: 'bg-green-100', text: 'text-green-700' };
    case '50': // RST + Consumo
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case '33': // Imp. Consumo
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

/**
 * Obtener descripción corta para UI
 */
export function getDescripcionCortaRegimen(codigoRegimen: string): string {
  const map: Record<string, string> = {
    '33': 'Imp. Consumo',
    '47': 'RST',
    '48': 'Resp. IVA',
    '49': 'No Resp. IVA',
    '50': 'RST + Consumo',
  };
  return map[codigoRegimen] || codigoRegimen;
}
