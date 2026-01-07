-- Migración: Agregar campos de autenticación personalizada
-- Fecha: 2026-01-07

-- 1. Agregar columnas a la tabla users
ALTER TABLE `users` 
ADD COLUMN `subscriber_id` VARCHAR(255) NULL,
ADD COLUMN `password_hash` VARCHAR(255) NULL;

-- 2. Agregar índice único para subscriber_id
CREATE UNIQUE INDEX `idx_subscriber_id` ON `users` (`subscriber_id`);

-- 3. Crear tabla de auditoría de login
CREATE TABLE `login_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NULL,
  `subscriber_id` VARCHAR(255) NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(500) NULL,
  `success` BOOLEAN DEFAULT FALSE,
  `failure_reason` VARCHAR(255) NULL,
  `attempted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_subscriber_id_attempts` (`subscriber_id`),
  INDEX `idx_attempted_at` (`attempted_at`),
  INDEX `idx_ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
