-- ==========================================================
-- Work Insight
-- Digital Activity Intelligence Platform
-- Enterprise Database Schema Design
--
-- Target DB: MariaDB 11.x
-- Engine: InnoDB
-- Charset: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `work_insight` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `work_insight`;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Disable foreign key checks temporarily to avoid constraint issues during table creation
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- 1. Table: roles
-- ==========================================================
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the role',
    `name` VARCHAR(50) NOT NULL COMMENT 'Unique name of the role (e.g., Admin, User)',
    `description` VARCHAR(255) NULL COMMENT 'Brief description of the role''s permissions',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the record was created',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the record was last updated',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp for soft delete',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'User ID who created the record',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'User ID who last updated the record',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_roles_name` (`name`),
    CONSTRAINT `chk_roles_active` CHECK (`is_active` IN (0, 1)),
    INDEX `idx_roles_status` (`is_active`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User roles defining system access levels';

-- ==========================================================
-- 2. Table: users
-- ==========================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the user',
    `username` VARCHAR(50) NOT NULL COMMENT 'Unique username for authentication',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password for security',
    `full_name` VARCHAR(150) NOT NULL COMMENT 'Full name of the user',
    `position` VARCHAR(100) NULL COMMENT 'Professional job position in the organization',
    `role_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key referencing the user''s role',
    `avatar_url` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL or file path to the user''s avatar image',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was created',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was last updated',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp for soft delete',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'User ID who created the user profile',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'User ID who last updated the user profile',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_username` (`username`),
    CONSTRAINT `fk_users_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_users_active` CHECK (`is_active` IN (0, 1)),
    INDEX `idx_users_status` (`is_active`, `deleted_at`),
    INDEX `idx_users_search` (`full_name`, `position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Users table storing credentials and profile information';

-- ==========================================================
-- 3. Table: activity_categories
-- ==========================================================
DROP TABLE IF EXISTS `activity_categories`;
CREATE TABLE `activity_categories` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the activity category',
    `name` VARCHAR(100) NOT NULL COMMENT 'Name of the category (e.g., IT, แผนงาน)',
    `description` VARCHAR(255) NULL COMMENT 'Detailed description of the category',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_categories_name` (`name`),
    CONSTRAINT `chk_categories_active` CHECK (`is_active` IN (0, 1)),
    INDEX `idx_categories_status` (`is_active`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='High-level activity categories';

-- ==========================================================
-- 4. Table: activity_groups
-- ==========================================================
DROP TABLE IF EXISTS `activity_groups`;
CREATE TABLE `activity_groups` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the activity group',
    `name` VARCHAR(100) NOT NULL COMMENT 'Name of the group (e.g., Hardware, Software)',
    `description` VARCHAR(255) NULL COMMENT 'Detailed description of the group',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_groups_name` (`name`),
    CONSTRAINT `chk_groups_active` CHECK (`is_active` IN (0, 1)),
    INDEX `idx_groups_status` (`is_active`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sub-groups for categorizing activity master definitions';

-- ==========================================================
-- 5. Table: activity_master
-- ==========================================================
DROP TABLE IF EXISTS `activity_master`;
CREATE TABLE `activity_master` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the activity definition',
    `code` VARCHAR(50) NOT NULL COMMENT 'Unique programmatic code for the activity',
    `name` VARCHAR(150) NOT NULL COMMENT 'Human-readable name of the activity',
    `keyword` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Keywords for easy lookup and autocomplete search',
    `default_duration` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Standard duration of this activity in minutes',
    `category_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to activity_categories',
    `group_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to activity_groups',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_activity_master_code` (`code`),
    CONSTRAINT `fk_master_category` FOREIGN KEY (`category_id`) REFERENCES `activity_categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_master_group` FOREIGN KEY (`group_id`) REFERENCES `activity_groups` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_master_active` CHECK (`is_active` IN (0, 1)),
    CONSTRAINT `chk_master_duration` CHECK (`default_duration` >= 0),
    INDEX `idx_master_cat_group` (`category_id`, `group_id`),
    INDEX `idx_master_status` (`is_active`, `deleted_at`),
    INDEX `idx_master_search` (`code`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master list of activities that users can log';

-- ==========================================================
-- 6. Table: locations
-- ==========================================================
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the location',
    `name` VARCHAR(100) NOT NULL COMMENT 'Location name (e.g., OPD, ER, Server Room)',
    `description` VARCHAR(255) NULL COMMENT 'Detailed description of the location',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_locations_name` (`name`),
    CONSTRAINT `chk_locations_active` CHECK (`is_active` IN (0, 1)),
    INDEX `idx_locations_status` (`is_active`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Physical or logical locations where activities are performed';

-- ==========================================================
-- 7. Table: activity_logs
-- ==========================================================
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the log entry',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to users representing who performed the activity',
    `activity_master_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to activity_master',
    `log_date` DATE NOT NULL COMMENT 'The date the activity took place',
    `session` VARCHAR(50) NOT NULL COMMENT 'Time period or shift (e.g., Morning, Afternoon, Evening, Night)',
    `duration` INT UNSIGNED NOT NULL COMMENT 'Actual duration spent on the activity in minutes',
    `location_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Foreign key to locations',
    `output` TEXT NULL DEFAULT NULL COMMENT 'Description of physical/digital outcomes or deliverables',
    `remark` TEXT NULL DEFAULT NULL COMMENT 'Additional comments or context',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_logs_activity` FOREIGN KEY (`activity_master_id`) REFERENCES `activity_master` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_logs_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_logs_duration` CHECK (`duration` > 0),
    INDEX `idx_logs_date` (`log_date`),
    INDEX `idx_logs_user_date` (`user_id`, `log_date`),
    INDEX `idx_logs_activity_date` (`activity_master_id`, `log_date`),
    INDEX `idx_logs_dashboard` (`log_date`, `user_id`, `duration`),
    INDEX `idx_logs_soft_delete` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transaction logs storing daily activity records for analysis';

-- ==========================================================
-- 8. Table: favorite_activity
-- ==========================================================
DROP TABLE IF EXISTS `favorite_activity`;
CREATE TABLE `favorite_activity` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the favorite record',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to users',
    `activity_master_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to activity_master',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_favorite_user_activity` (`user_id`, `activity_master_id`),
    CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorite_activity` FOREIGN KEY (`activity_master_id`) REFERENCES `activity_master` (`id`) ON DELETE CASCADE,
    INDEX `idx_favorite_user` (`user_id`),
    INDEX `idx_favorite_soft_delete` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mapping table for users'' bookmarked or favorite activities';

-- ==========================================================
-- 9. Table: system_setting
-- ==========================================================
DROP TABLE IF EXISTS `system_setting`;
CREATE TABLE `system_setting` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the system setting',
    `setting_key` VARCHAR(100) NOT NULL COMMENT 'Unique config key name',
    `setting_value` TEXT NULL DEFAULT NULL COMMENT 'Configuration value',
    `description` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Purpose and use case of this setting',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_system_setting_key` (`setting_key`),
    INDEX `idx_system_setting_status` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System-wide settings and configurations';

-- ==========================================================
-- 10. Table: audit_logs
-- ==========================================================
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT COMMENT 'Primary key of the audit log',
    `user_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'User ID who performed the action (NULL for system/unauthenticated)',
    `action` VARCHAR(50) NOT NULL COMMENT 'Action performed (Login, Insert, Update, Delete)',
    `ip_address` VARCHAR(45) NOT NULL COMMENT 'IPv4 or IPv6 address',
    `user_agent` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Browser and OS user agent string',
    `details` TEXT NULL DEFAULT NULL COMMENT 'Structured description or parameters of the action',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
    `created_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Creator user ID',
    `updated_by` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT 'Updater user ID',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_audit_user_action` (`user_id`, `action`),
    INDEX `idx_audit_created_at` (`created_at`),
    INDEX `idx_audit_soft_delete` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit logs for tracking security events and mutations';

-- Re-enable foreign key checks before establishing audit foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- Establish Auditing Foreign Key Constraints (created_by, updated_by)
-- ==========================================================

ALTER TABLE `roles`
    ADD CONSTRAINT `fk_roles_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_roles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `users`
    ADD CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_users_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `activity_categories`
    ADD CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `activity_groups`
    ADD CONSTRAINT `fk_groups_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_groups_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `activity_master`
    ADD CONSTRAINT `fk_master_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_master_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `locations`
    ADD CONSTRAINT `fk_locations_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_locations_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `activity_logs`
    ADD CONSTRAINT `fk_logs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_logs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `favorite_activity`
    ADD CONSTRAINT `fk_fav_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_fav_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `system_setting`
    ADD CONSTRAINT `fk_setting_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_setting_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `audit_logs`
    ADD CONSTRAINT `fk_audit_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_audit_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
