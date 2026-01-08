-- MIGRACIÓN SEGURA: Terceros Table Restructuring
-- Este script realiza un backup, migra datos y crea la nueva estructura

-- ============================================
-- 1. BACKUP DE DATOS EXISTENTES
-- ============================================
CREATE TABLE terceros_backup AS 
SELECT * FROM terceros;

-- ============================================
-- 2. CREAR TABLA NUEVA CON ESTRUCTURA MEJORADA
-- ============================================
CREATE TABLE terceros_new (
  -- IDENTIFICACIÓN (Sección 1)
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  tipo_identificacion VARCHAR(2) NOT NULL DEFAULT '31',
  -- Códigos estándar DIAN Colombia:
  -- 11: Registro civil
  -- 12: Tarjeta de identidad
  -- 13: Cédula de ciudadanía
  -- 21: Tarjeta de extranjería
  -- 22: Cédula de extranjería
  -- 31: NIT
  -- 41: Pasaporte
  -- 42: Documento de identificación extranjero
  -- 47: PEP (Permiso Especial de Permanencia)
  -- 48: PPT (Permiso Protección Temporal)
  -- 91: NUIP
  
  identificacion VARCHAR(50) NOT NULL,
  dv CHAR(1),
  
  -- INFORMACIÓN PERSONAL/EMPRESARIAL (Sección 2)
  tipo_persona ENUM('persona_natural', 'persona_juridica') NOT NULL DEFAULT 'persona_juridica',
  
  -- Para personas naturales
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  
  -- Para ambos (mejor que "nombre" genérico)
  nombre_completo VARCHAR(255) NOT NULL,
  
  -- Para personas jurídicas
  razon_social VARCHAR(255),
  
  -- CLASIFICACIÓN TRIBUTARIA (Sección 3)
  tipo_regimen VARCHAR(2) DEFAULT '48',
  -- Códigos estándar DIAN Colombia:
  -- 33: Responsable de Impuesto Nacional al Consumo
  -- 47: RST (Régimen Simple de Tributación)
  -- 48: Responsable de IVA
  -- 49: No Responsable de IVA
  -- 50: RST con Impuesto Nacional al Consumo
  
  es_autorretenedor BOOLEAN DEFAULT FALSE,
  retefuente BOOLEAN DEFAULT FALSE,
  tarifa_retefuente DECIMAL(5,2),
  
  -- CLASIFICACIÓN (Sección 4)
  vinculo_economico VARCHAR(100),
  parte_relacionada BOOLEAN DEFAULT FALSE,
  tipo VARCHAR(50),
  
  -- CONTACTO (Sección 5)
  direccion VARCHAR(255),
  email VARCHAR(255),
  telefono1 VARCHAR(20),
  telefono2 VARCHAR(20),
  
  -- ESTADO (Sección 6)
  estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
  
  -- AUDITORÍA (Sección 7)
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- ÍNDICES PARA PERFORMANCE
  UNIQUE KEY uk_tenant_identificacion (tenant_id, identificacion),
  UNIQUE KEY uk_nombre_completo (nombre_completo),
  INDEX idx_tenant_estado (tenant_id, estado),
  INDEX idx_tipo_persona (tipo_persona),
  INDEX idx_email (email),
  INDEX idx_tipo (tipo),
  
  CONSTRAINT fk_terceros_tenant FOREIGN KEY (tenant_id) 
    REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. MIGRAR DATOS EXISTENTES
-- ============================================
-- Mapear datos de la tabla antigua a la nueva
INSERT INTO terceros_new (
  id,
  tenant_id,
  tipo_identificacion,
  identificacion,
  tipo_persona,
  nombre_completo,
  vinculo_economico,
  parte_relacionada,
  tipo,
  estado,
  fecha_creacion,
  fecha_actualizacion
)
SELECT 
  id,
  tenant_id,
  '31' as tipo_identificacion,  -- Default: NIT (código DIAN estándar)
  identificacion,
  'persona_juridica' as tipo_persona,  -- Default: personas jurídicas
  nombre as nombre_completo,  -- El nombre actual se usa como nombre_completo
  vinculo_economico,
  parte_relacionada,
  tipo,
  'activo' as estado,  -- Todos los existentes se marcan como activos
  NOW() as fecha_creacion,
  NOW() as fecha_actualizacion
FROM terceros_backup;

-- ============================================
-- 4. REEMPLAZAR TABLA ANTIGUA POR LA NUEVA
-- ============================================
-- Desactivar Foreign Key Checks temporalmente (necesario porque asientos y lineas_asiento hacen referencia a terceros)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE terceros;
RENAME TABLE terceros_new TO terceros;

-- Reactivar Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 5. VERIFICACIÓN Y DATOS MIGRANTES
-- ============================================
-- Contar registros migrados
SELECT 
  COUNT(*) as total_terceros,
  COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
  COUNT(CASE WHEN tipo_persona = 'persona_natural' THEN 1 END) as personas_naturales,
  COUNT(CASE WHEN tipo_persona = 'persona_juridica' THEN 1 END) as personas_juridicas,
  COUNT(CASE WHEN parte_relacionada = true THEN 1 END) as partes_relacionadas
FROM terceros;

-- Mostrar algunos registros de ejemplo
SELECT 
  id,
  tenant_id,
  tipo_identificacion,
  identificacion,
  nombre_completo,
  tipo_persona,
  tipo,
  estado
FROM terceros
LIMIT 5;

-- ============================================
-- NOTAS:
-- ============================================
-- El backup está en: terceros_backup
-- Si necesitas revertir, ejecuta:
-- DROP TABLE terceros;
-- RENAME TABLE terceros_backup TO terceros;
-- 
-- Los campos nuevos que no tenían datos:
-- - dv (dígito de verificación): Deberá poblarse posteriormente
-- - apellidos: Solo para personas naturales
-- - razon_social: Deberá actualizarse
-- - tipo_regimen: Usa default 'ordinario'
-- - es_autorretenedor: Default FALSE
-- - retefuente: Default FALSE
-- - tarifa_retefuente: NULL
-- - direccion: NULL
-- - email: NULL
-- - telefono1: NULL
-- - telefono2: NULL
