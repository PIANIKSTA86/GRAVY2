-- SCRIPT DE ACTUALIZACIÓN: Cambiar tipo_identificacion a códigos DIAN
-- Ejecutar SOLO si la tabla 'terceros' ya fue migrada con los códigos antiguos (CC, NIT, CE, etc.)

-- ============================================
-- VERIFICAR ESTRUCTURA ACTUAL
-- ============================================
-- Ejecuta esto primero para verificar qué tipo de datos tiene actualmente
SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gravy2' 
  AND TABLE_NAME = 'terceros' 
  AND COLUMN_NAME = 'tipo_identificacion';

-- ============================================
-- OPCIÓN 1: SI LA TABLA YA EXISTE CON ENUM ANTIGUO
-- ============================================

-- Paso 1: Agregar columna temporal con los códigos DIAN
ALTER TABLE terceros 
ADD COLUMN tipo_identificacion_new VARCHAR(2) NOT NULL DEFAULT '31' AFTER tenant_id;

-- Paso 2: Migrar datos de códigos antiguos a códigos DIAN
UPDATE terceros
SET tipo_identificacion_new = CASE tipo_identificacion
  WHEN 'NIT' THEN '31'
  WHEN 'CC' THEN '13'
  WHEN 'CE' THEN '22'
  WHEN 'PA' THEN '41'
  WHEN 'PT' THEN '48'
  WHEN 'PN' THEN '47'
  WHEN 'XX' THEN '42'
  ELSE '31' -- Default a NIT si no coincide
END;

-- Paso 3: Eliminar columna antigua
ALTER TABLE terceros DROP COLUMN tipo_identificacion;

-- Paso 4: Renombrar columna nueva
ALTER TABLE terceros 
CHANGE COLUMN tipo_identificacion_new tipo_identificacion VARCHAR(2) NOT NULL DEFAULT '31';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar que los datos se migraron correctamente
SELECT 
  tipo_identificacion,
  COUNT(*) as cantidad,
  CASE tipo_identificacion
    WHEN '11' THEN 'Registro civil'
    WHEN '12' THEN 'Tarjeta de identidad'
    WHEN '13' THEN 'Cédula de ciudadanía'
    WHEN '21' THEN 'Tarjeta de extranjería'
    WHEN '22' THEN 'Cédula de extranjería'
    WHEN '31' THEN 'NIT'
    WHEN '41' THEN 'Pasaporte'
    WHEN '42' THEN 'Documento identificación extranjero'
    WHEN '47' THEN 'PEP'
    WHEN '48' THEN 'PPT'
    WHEN '91' THEN 'NUIP'
    ELSE 'Desconocido'
  END as descripcion
FROM terceros
GROUP BY tipo_identificacion
ORDER BY tipo_identificacion;

-- ============================================
-- CÓDIGOS DIAN ESTÁNDAR - REFERENCIA
-- ============================================
/*
11 - Registro civil
12 - Tarjeta de identidad
13 - Cédula de ciudadanía
21 - Tarjeta de extranjería
22 - Cédula de extranjería
31 - NIT
41 - Pasaporte
42 - Documento de identificación extranjero
47 - PEP (Permiso Especial de Permanencia)
48 - PPT (Permiso Protección Temporal)
91 - NUIP
*/

-- ============================================
-- REVERTIR (Si es necesario)
-- ============================================
/*
-- Para volver a la estructura antigua:
ALTER TABLE terceros 
ADD COLUMN tipo_identificacion_old VARCHAR(10) NOT NULL DEFAULT 'NIT' AFTER tenant_id;

UPDATE terceros
SET tipo_identificacion_old = CASE tipo_identificacion
  WHEN '31' THEN 'NIT'
  WHEN '13' THEN 'CC'
  WHEN '22' THEN 'CE'
  WHEN '41' THEN 'PA'
  WHEN '48' THEN 'PT'
  WHEN '47' THEN 'PN'
  WHEN '42' THEN 'XX'
  ELSE 'NIT'
END;

ALTER TABLE terceros DROP COLUMN tipo_identificacion;
ALTER TABLE terceros 
CHANGE COLUMN tipo_identificacion_old tipo_identificacion VARCHAR(10) NOT NULL DEFAULT 'NIT';
*/
