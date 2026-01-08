-- MIGRATION: Add Geographic Catalogs (DANE & ISO)
-- Execute this before running seed-catalogos.ts

USE gravy2;

-- ============================================
-- CATÁLOGOS GEOGRÁFICOS
-- ============================================

-- Tabla: Países (ISO 3166-1 alpha-2)
CREATE TABLE IF NOT EXISTS paises (
  codigo VARCHAR(2) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX idx_paises_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Departamentos de Colombia (DANE)
CREATE TABLE IF NOT EXISTS departamentos (
  codigo VARCHAR(2) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pais_codigo VARCHAR(2) NOT NULL DEFAULT 'CO',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX idx_departamentos_pais (pais_codigo),
  INDEX idx_departamentos_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Municipios de Colombia (DANE)
CREATE TABLE IF NOT EXISTS municipios (
  codigo VARCHAR(5) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  departamento_codigo VARCHAR(2) NOT NULL,
  codigo_postal VARCHAR(10),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX idx_municipios_dpto (departamento_codigo),
  INDEX idx_municipios_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign keys after tables are created
ALTER TABLE departamentos 
ADD CONSTRAINT fk_departamentos_pais 
FOREIGN KEY (pais_codigo) REFERENCES paises(codigo);

ALTER TABLE municipios 
ADD CONSTRAINT fk_municipios_dpto 
FOREIGN KEY (departamento_codigo) REFERENCES departamentos(codigo);

-- ============================================
-- ACTUALIZAR TABLA TERCEROS
-- ============================================

-- Agregar campos de ubicación geográfica a terceros
ALTER TABLE terceros
ADD COLUMN IF NOT EXISTS pais_codigo VARCHAR(2) DEFAULT 'CO' AFTER direccion,
ADD COLUMN IF NOT EXISTS departamento_codigo VARCHAR(2) AFTER pais_codigo,
ADD COLUMN IF NOT EXISTS municipio_codigo VARCHAR(5) AFTER departamento_codigo;

-- Agregar foreign keys (verificar primero si no existen)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_NAME = 'fk_terceros_pais' AND TABLE_NAME = 'terceros');

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE terceros ADD CONSTRAINT fk_terceros_pais FOREIGN KEY (pais_codigo) REFERENCES paises(codigo)', 
  'SELECT "FK fk_terceros_pais already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_NAME = 'fk_terceros_dpto' AND TABLE_NAME = 'terceros');

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE terceros ADD CONSTRAINT fk_terceros_dpto FOREIGN KEY (departamento_codigo) REFERENCES departamentos(codigo)', 
  'SELECT "FK fk_terceros_dpto already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_NAME = 'fk_terceros_mpio' AND TABLE_NAME = 'terceros');

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE terceros ADD CONSTRAINT fk_terceros_mpio FOREIGN KEY (municipio_codigo) REFERENCES municipios(codigo)', 
  'SELECT "FK fk_terceros_mpio already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar índices para búsquedas eficientes (si no existen)
SET @idx_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_NAME = 'terceros' AND INDEX_NAME = 'idx_terceros_pais');

SET @sql = IF(@idx_exists = 0, 
  'ALTER TABLE terceros ADD INDEX idx_terceros_pais (pais_codigo)', 
  'SELECT "Index idx_terceros_pais already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_NAME = 'terceros' AND INDEX_NAME = 'idx_terceros_dpto');

SET @sql = IF(@idx_exists = 0, 
  'ALTER TABLE terceros ADD INDEX idx_terceros_dpto (departamento_codigo)', 
  'SELECT "Index idx_terceros_dpto already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las tablas se crearon correctamente
SHOW TABLES LIKE 'paises';
SHOW TABLES LIKE 'departamentos';
SHOW TABLES LIKE 'municipios';

SELECT 'Migration completed successfully! Run: npx tsx scripts/seed-catalogos.ts' AS status;
