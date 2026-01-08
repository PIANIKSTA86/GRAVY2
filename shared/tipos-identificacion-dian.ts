// Utilidades para Tipos de Identificación DIAN (Colombia)
// Códigos estándar establecidos por la Dirección de Impuestos y Aduanas Nacionales

export const TIPOS_IDENTIFICACION_DIAN = {
  '11': 'Registro civil',
  '12': 'Tarjeta de identidad',
  '13': 'Cédula de ciudadanía',
  '21': 'Tarjeta de extranjería',
  '22': 'Cédula de extranjería',
  '31': 'NIT',
  '41': 'Pasaporte',
  '42': 'Documento de identificación extranjero',
  '47': 'PEP (Permiso Especial de Permanencia)',
  '48': 'PPT (Permiso Protección Temporal)',
  '91': 'NUIP',
} as const;

export type CodigoDIAN = keyof typeof TIPOS_IDENTIFICACION_DIAN;

/**
 * Array de opciones para selects/dropdowns
 */
export const OPCIONES_TIPO_IDENTIFICACION = Object.entries(TIPOS_IDENTIFICACION_DIAN).map(
  ([codigo, descripcion]) => ({
    value: codigo,
    label: `${codigo} - ${descripcion}`,
    descripcion,
  })
);

/**
 * Obtener descripción legible de un código DIAN
 */
export function getDescripcionTipoIdentificacion(codigo: string): string {
  return TIPOS_IDENTIFICACION_DIAN[codigo as CodigoDIAN] || 'Desconocido';
}

/**
 * Validar si un código DIAN es válido
 */
export function isCodigoDIANValido(codigo: string): codigo is CodigoDIAN {
  return codigo in TIPOS_IDENTIFICACION_DIAN;
}

/**
 * Tipos de identificación por tipo de persona
 */
export const TIPOS_PERSONA_NATURAL: CodigoDIAN[] = ['11', '12', '13', '21', '22', '41', '42', '47', '48', '91'];
export const TIPOS_PERSONA_JURIDICA: CodigoDIAN[] = ['31'];

/**
 * Determinar si un tipo de identificación corresponde a persona natural
 */
export function esPersonaNatural(tipoId: string): boolean {
  return TIPOS_PERSONA_NATURAL.includes(tipoId as CodigoDIAN);
}

/**
 * Determinar si un tipo de identificación corresponde a persona jurídica
 */
export function esPersonaJuridica(tipoId: string): boolean {
  return TIPOS_PERSONA_JURIDICA.includes(tipoId as CodigoDIAN);
}

/**
 * Validar si un tipo de identificación requiere dígito de verificación
 * Solo el NIT (31) requiere DV
 */
export function requiereDV(tipoId: string): boolean {
  return tipoId === '31';
}

/**
 * Obtener el tipo de persona sugerido según el tipo de identificación
 */
export function getTipoPersonaSugerido(tipoId: string): 'persona_natural' | 'persona_juridica' {
  return esPersonaJuridica(tipoId) ? 'persona_juridica' : 'persona_natural';
}

/**
 * Formatear identificación según tipo
 * Ejemplo: NIT con DV se muestra como "123456789-0"
 */
export function formatearIdentificacion(identificacion: string, tipoId: string, dv?: string): string {
  if (tipoId === '31' && dv) {
    return `${identificacion}-${dv}`;
  }
  return identificacion;
}

/**
 * Opciones filtradas por tipo de persona
 */
export function getOpcionesPorTipoPersona(tipoPersona: 'persona_natural' | 'persona_juridica') {
  const codigos = tipoPersona === 'persona_natural' ? TIPOS_PERSONA_NATURAL : TIPOS_PERSONA_JURIDICA;
  return OPCIONES_TIPO_IDENTIFICACION.filter(opt => codigos.includes(opt.value as CodigoDIAN));
}

/**
 * Validar longitud de identificación según tipo
 */
export function validarLongitudIdentificacion(identificacion: string, tipoId: string): boolean {
  const longitudes: Record<string, { min: number; max: number }> = {
    '11': { min: 10, max: 11 }, // Registro civil
    '12': { min: 10, max: 11 }, // TI
    '13': { min: 6, max: 10 },  // CC
    '21': { min: 6, max: 15 },  // Tarjeta extranjería
    '22': { min: 6, max: 15 },  // Cédula extranjería
    '31': { min: 9, max: 10 },  // NIT
    '41': { min: 6, max: 20 },  // Pasaporte
    '42': { min: 5, max: 20 },  // DIE
    '47': { min: 7, max: 15 },  // PEP
    '48': { min: 7, max: 15 },  // PPT
    '91': { min: 10, max: 11 }, // NUIP
  };

  const regla = longitudes[tipoId];
  if (!regla) return true; // Si no hay regla, permitir

  const longitud = identificacion.length;
  return longitud >= regla.min && longitud <= regla.max;
}
