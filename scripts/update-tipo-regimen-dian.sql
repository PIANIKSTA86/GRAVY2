-- SCRIPT DE ACTUALIZACIÓN: Cambiar tipo_regimen a códigos DIAN
-- Ejecutar SOLO si la tabla 'terceros' ya fue migrada con los valores antiguos (ordinario, simplificado, tributario_especial)

-- ============================================
-- VERIFICAR ESTRUCTURA ACTUAL
-- ============================================
-- Ejecuta esto primero para verificar qué tipo de datos tiene actualmente
SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gravy2' 
  AND TABLE_NAME = 'terceros' 
  AND COLUMN_NAME = 'tipo_regimen';

-- ============================================
-- OPCIÓN 1: SI LA TABLA YA EXISTE CON ENUM ANTIGUO
-- ============================================

-- Paso 1: Agregar columna temporal con los códigos DIAN
ALTER TABLE terceros 
ADD COLUMN tipo_regimen_new VARCHAR(2) NOT NULL DEFAULT '48' AFTER razon_social;

-- Paso 2: Migrar datos de valores antiguos a códigos DIAN
UPDATE terceros
SET tipo_regimen_new = CASE tipo_regimen
  WHEN 'ordinario' THEN '48'        -- Responsable de IVA (régimen común)
  WHEN 'simplificado' THEN '49'     -- No Responsable de IVA
  WHEN 'tributario_especial' THEN '33' -- Responsable Imp. Consumo
  ELSE '48' -- Default a Responsable de IVA
END;

-- Paso 3: Eliminar columna antigua
ALTER TABLE terceros DROP COLUMN tipo_regimen;

-- Paso 4: Renombrar columna nueva
ALTER TABLE terceros 
CHANGE COLUMN tipo_regimen_new tipo_regimen VARCHAR(2) NOT NULL DEFAULT '48';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar que los datos se migraron correctamente
SELECT 
  tipo_regimen,
  COUNT(*) as cantidad,
  CASE tipo_regimen
    WHEN '33' THEN 'Responsable de Impuesto Nacional al Consumo'
    WHEN '47' THEN 'RST (Régimen Simple de Tributación)'
    WHEN '48' THEN 'Responsable de IVA'
    WHEN '49' THEN 'No Responsable de IVA'
    WHEN '50' THEN 'RST con Impuesto Nacional al Consumo'
    ELSE 'Desconocido'
  END as descripcion
FROM terceros
GROUP BY tipo_regimen
ORDER BY tipo_regimen;

-- ============================================
-- CÓDIGOS DIAN ESTÁNDAR - REFERENCIA
-- ============================================
/*
RÉGIMEN TRIBUTARIO COLOMBIA (Códigos DIAN):

33 - Responsable de Impuesto Nacional al Consumo
     Aplica a empresas que venden bienes y servicios con impuesto al consumo

47 - RST (Régimen Simple de Tributación)
     Para pequeñas empresas que unifican impuestos nacionales

48 - Responsable de IVA (Régimen Común/Ordinario)
     Empresas que facturan IVA y pueden descontar IVA pagado

49 - No Responsable de IVA (Régimen Simplificado)
     Pequeñas empresas exentas de IVA (ingresos < límite)

50 - RST con Impuesto Nacional al Consumo
     Combina Régimen Simple con responsabilidad de Imp. Consumo
*/

-- ============================================
-- MAPEO RECOMENDADO
-- ============================================
/*
ANTES                    → DESPUÉS (DIAN)
ordinario                → 48 (Responsable de IVA)
simplificado             → 49 (No Responsable de IVA)
tributario_especial      → 33 (Responsable Imp. Consumo)
                           47 (RST - si aplica)
                           50 (RST + Consumo - si aplica)
*/

-- ============================================
-- REVERTIR (Si es necesario)
-- ============================================
/*
-- Para volver a la estructura antigua:
ALTER TABLE terceros 
ADD COLUMN tipo_regimen_old VARCHAR(20) NOT NULL DEFAULT 'ordinario' AFTER razon_social;

UPDATE terceros
SET tipo_regimen_old = CASE tipo_regimen
  WHEN '48' THEN 'ordinario'
  WHEN '49' THEN 'simplificado'
  WHEN '33' THEN 'tributario_especial'
  WHEN '47' THEN 'simplificado'
  WHEN '50' THEN 'tributario_especial'
  ELSE 'ordinario'
END;

ALTER TABLE terceros DROP COLUMN tipo_regimen;
ALTER TABLE terceros 
CHANGE COLUMN tipo_regimen_old tipo_regimen VARCHAR(20) NOT NULL DEFAULT 'ordinario';
*/
