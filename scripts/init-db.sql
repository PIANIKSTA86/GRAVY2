-- ======================================
-- Script de Inicialización Base de Datos
-- ContaGrav2 - Sistema Contable MySQL
-- ======================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS contograv2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE contograv2;

-- Crear usuario de aplicación (opcional)
-- CREATE USER IF NOT EXISTS 'contograv'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
-- GRANT ALL PRIVILEGES ON contograv2.* TO 'contograv'@'localhost';
-- FLUSH PRIVILEGES;

-- ======================================
-- LIMPIAR TABLAS EXISTENTES (DESARROLLO)
-- ======================================
-- ADVERTENCIA: Esto elimina todos los datos
-- Solo usar en desarrollo, comentar en producción

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS lineas_asiento;
DROP TABLE IF EXISTS asientos;
DROP TABLE IF EXISTS niif_politicas;
DROP TABLE IF EXISTS periodos_contables;
DROP TABLE IF EXISTS centros_costo;
DROP TABLE IF EXISTS terceros;
DROP TABLE IF EXISTS plan_cuentas;
DROP TABLE IF EXISTS tenant_users;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ======================================
-- MENSAJES
-- ======================================
SELECT 'Base de datos lista para ejecutar migraciones de Drizzle' AS mensaje;
SELECT 'Ejecutar: npm run db:push' AS siguiente_paso;
