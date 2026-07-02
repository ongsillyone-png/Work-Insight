/*
Navicat MySQL Data Transfer

Source Server         : 192.168.7.24_new_web
Source Server Version : 50505
Source Host           : 192.168.7.24:3306
Source Database       : work_insight

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2026-07-01 20:45:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for activity_categories
-- ----------------------------
DROP TABLE IF EXISTS `activity_categories`;
CREATE TABLE `activity_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the activity category',
  `name` varchar(100) NOT NULL COMMENT 'Name of the category (e.g., IT, แผนงาน)',
  `description` varchar(255) DEFAULT NULL COMMENT 'Detailed description of the category',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_name` (`name`),
  KEY `idx_categories_status` (`is_active`,`deleted_at`),
  KEY `fk_categories_created_by` (`created_by`),
  KEY `fk_categories_updated_by` (`updated_by`),
  CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_categories_active` CHECK (`is_active` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='High-level activity categories';

-- ----------------------------
-- Records of activity_categories
-- ----------------------------
INSERT INTO `activity_categories` VALUES ('1', 'IT', 'งานเทคโนโลยีสารสนเทศและดิจิทัล', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_categories` VALUES ('2', 'แผนงาน', 'งานนโยบายและแผนงาน', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_categories` VALUES ('3', 'ประชาสัมพันธ์', 'งานสื่อสารองค์กรและประชาสัมพันธ์', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_categories` VALUES ('4', 'ประชุม', 'การประชุมและสัมมนาวิชาการ', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_categories` VALUES ('5', 'บริหาร', 'งานบริหารทั่วไปและทรัพยากรบุคคล', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_categories` VALUES ('6', 'เอกสาร', 'งานสารบรรณและงานเอกสาร', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);

-- ----------------------------
-- Table structure for activity_groups
-- ----------------------------
DROP TABLE IF EXISTS `activity_groups`;
CREATE TABLE `activity_groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the activity group',
  `name` varchar(100) NOT NULL COMMENT 'Name of the group (e.g., Hardware, Software)',
  `description` varchar(255) DEFAULT NULL COMMENT 'Detailed description of the group',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_groups_name` (`name`),
  KEY `idx_groups_status` (`is_active`,`deleted_at`),
  KEY `fk_groups_created_by` (`created_by`),
  KEY `fk_groups_updated_by` (`updated_by`),
  CONSTRAINT `fk_groups_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_groups_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_groups_active` CHECK (`is_active` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sub-groups for categorizing activity master definitions';

-- ----------------------------
-- Records of activity_groups
-- ----------------------------
INSERT INTO `activity_groups` VALUES ('1', 'Hardware', 'อุปกรณ์และฮาร์ดแวร์คอมพิวเตอร์', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('2', 'Software', 'โปรแกรมและแอปพลิเคชันระบบ', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('3', 'Database', 'ระบบฐานข้อมูลดิจิทัล', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('4', 'Server', 'เครื่องแม่ข่ายและการบำรุงรักษา', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('5', 'Network', 'ระบบเครือข่ายความเร็วสูง', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('6', 'Graphic', 'งานออกแบบและสื่อสารภาพลักษณ์', '1', '2026-07-01 12:06:21', '2026-07-01 15:02:00', null, null, null, '3');
INSERT INTO `activity_groups` VALUES ('7', 'HAIT', 'มาตรฐานเทคโนโลยีสารสนเทศโรงพยาบาล', '1', '2026-07-01 12:06:21', '2026-07-01 14:50:46', null, null, null, '1');
INSERT INTO `activity_groups` VALUES ('8', 'KPI', 'ตัวชี้วัดและสถิติประเมินผลการทำงาน', '1', '2026-07-01 12:06:21', '2026-07-01 15:00:39', null, null, null, '5');
INSERT INTO `activity_groups` VALUES ('9', 'ประชุม คปสอ.', 'ประชุม คปสอ.', '1', '2026-07-01 15:35:37', '2026-07-01 15:35:37', null, null, null, '4');

-- ----------------------------
-- Table structure for activity_logs
-- ----------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the log entry',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to users representing who performed the activity',
  `activity_master_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to activity_master',
  `log_date` date NOT NULL COMMENT 'The date the activity took place',
  `session` varchar(50) NOT NULL COMMENT 'Time period or shift (e.g., Morning, Afternoon, Evening, Night)',
  `duration` int(10) unsigned NOT NULL COMMENT 'Actual duration spent on the activity in minutes',
  `location_id` bigint(20) unsigned DEFAULT NULL COMMENT 'Foreign key to locations',
  `output` text DEFAULT NULL COMMENT 'Description of physical/digital outcomes or deliverables',
  `remark` text DEFAULT NULL COMMENT 'Additional comments or context',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  KEY `fk_logs_location` (`location_id`),
  KEY `idx_logs_date` (`log_date`),
  KEY `idx_logs_user_date` (`user_id`,`log_date`),
  KEY `idx_logs_activity_date` (`activity_master_id`,`log_date`),
  KEY `idx_logs_dashboard` (`log_date`,`user_id`,`duration`),
  KEY `idx_logs_soft_delete` (`deleted_at`),
  KEY `fk_logs_created_by` (`created_by`),
  KEY `fk_logs_updated_by` (`updated_by`),
  CONSTRAINT `fk_logs_activity` FOREIGN KEY (`activity_master_id`) REFERENCES `activity_master` (`id`),
  CONSTRAINT `fk_logs_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_logs_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_logs_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_logs_duration` CHECK (`duration` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transaction logs storing daily activity records for analysis';

-- ----------------------------
-- Records of activity_logs
-- ----------------------------
INSERT INTO `activity_logs` VALUES ('1', '1', '1', '2026-07-01', 'Morning', '30', '3', 'เม้าใช้งานไม่ได้', null, '2026-07-01 12:59:53', '2026-07-01 13:18:32', '2026-07-01 13:18:32', null, null);
INSERT INTO `activity_logs` VALUES ('2', '5', '3', '2026-07-01', 'Morning', '30', '2', 'vbvmvbmv', 'bmvb', '2026-07-01 14:38:48', '2026-07-01 14:40:53', '2026-07-01 14:40:53', null, null);
INSERT INTO `activity_logs` VALUES ('3', '6', '6', '2026-07-01', 'Afternoon', '60', '6', null, null, '2026-07-01 15:36:37', '2026-07-01 15:36:37', null, null, null);
INSERT INTO `activity_logs` VALUES ('4', '2', '7', '2026-07-01', 'Morning', '15', '1', null, null, '2026-07-01 16:13:37', '2026-07-01 16:13:37', null, null, null);

-- ----------------------------
-- Table structure for activity_master
-- ----------------------------
DROP TABLE IF EXISTS `activity_master`;
CREATE TABLE `activity_master` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the activity definition',
  `code` varchar(50) NOT NULL COMMENT 'Unique programmatic code for the activity',
  `name` varchar(150) NOT NULL COMMENT 'Human-readable name of the activity',
  `keyword` varchar(255) DEFAULT NULL COMMENT 'Keywords for easy lookup and autocomplete search',
  `default_duration` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Standard duration of this activity in minutes',
  `category_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to activity_categories',
  `group_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to activity_groups',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_activity_master_code` (`code`),
  KEY `fk_master_group` (`group_id`),
  KEY `idx_master_cat_group` (`category_id`,`group_id`),
  KEY `idx_master_status` (`is_active`,`deleted_at`),
  KEY `idx_master_search` (`code`,`name`),
  KEY `fk_master_created_by` (`created_by`),
  KEY `fk_master_updated_by` (`updated_by`),
  CONSTRAINT `fk_master_category` FOREIGN KEY (`category_id`) REFERENCES `activity_categories` (`id`),
  CONSTRAINT `fk_master_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_master_group` FOREIGN KEY (`group_id`) REFERENCES `activity_groups` (`id`),
  CONSTRAINT `fk_master_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_master_active` CHECK (`is_active` in (0,1)),
  CONSTRAINT `chk_master_duration` CHECK (`default_duration` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master list of activities that users can log';

-- ----------------------------
-- Records of activity_master
-- ----------------------------
INSERT INTO `activity_master` VALUES ('1', 'ACT-001', 'ซ่อมและแก้ไขอุปกรณ์คอมพิวเตอร์ (Hardware Repair)', 'ซ่อมคอม, เม้าส์, คีย์บอร์ด, จอภาพ', '30', '1', '1', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('2', 'ACT-002', 'ตรวจสอบการสำรองข้อมูล MariaDB (Database Backup)', 'backup, database, สำรองข้อมูล, sql', '30', '1', '3', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('3', 'ACT-003', 'ตรวจสอบอุณหภูมิห้องเซิร์ฟเวอร์ (Server Monitoring)', 'server, temp, monitor, อุณหภูมิ', '15', '1', '4', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('4', 'ACT-004', 'วิเคราะห์และตั้งค่าเครือข่าย (Network Setup)', 'network, switch, router, ip, wifi', '60', '1', '5', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('5', 'ACT-005', 'ออกแบบแบนเนอร์ประชาสัมพันธ์โรงพยาบาล (PR Graphic Design)', 'graphic, photoshop, banner, ออกแบบ, รูปภาพ', '120', '3', '6', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('6', 'ACT-006', 'ประชุมวางแผนเทคโนโลยีสารสนเทศกลุ่มงานดิจิทัล (Meeting)', 'meeting, ประชุม, แผนงาน', '60', '4', '7', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('7', 'ACT-007', 'ติดตั้งเครื่องพิมพ์สำหรับจุดคัดกรอง OPD (Printer setup)', 'printer, setup, install, พรินเตอร์, เครื่องพิมพ์', '45', '1', '1', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `activity_master` VALUES ('8', 'ACT-008', 'จัดทำเอกสารคู่มือการใช้งานระบบ HOSxP (Documentation)', 'doc, manual, คู่มือ, เอกสาร', '90', '6', '8', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the audit log',
  `user_id` bigint(20) unsigned DEFAULT NULL COMMENT 'User ID who performed the action (NULL for system/unauthenticated)',
  `action` varchar(50) NOT NULL COMMENT 'Action performed (Login, Insert, Update, Delete)',
  `ip_address` varchar(45) NOT NULL COMMENT 'IPv4 or IPv6 address',
  `user_agent` varchar(255) DEFAULT NULL COMMENT 'Browser and OS user agent string',
  `details` text DEFAULT NULL COMMENT 'Structured description or parameters of the action',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  KEY `idx_audit_user_action` (`user_id`,`action`),
  KEY `idx_audit_created_at` (`created_at`),
  KEY `idx_audit_soft_delete` (`deleted_at`),
  KEY `fk_audit_created_by` (`created_by`),
  KEY `fk_audit_updated_by` (`updated_by`),
  CONSTRAINT `fk_audit_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit logs for tracking security events and mutations';

-- ----------------------------
-- Records of audit_logs
-- ----------------------------

-- ----------------------------
-- Table structure for favorite_activity
-- ----------------------------
DROP TABLE IF EXISTS `favorite_activity`;
CREATE TABLE `favorite_activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the favorite record',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to users',
  `activity_master_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key to activity_master',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite_user_activity` (`user_id`,`activity_master_id`),
  KEY `fk_favorite_activity` (`activity_master_id`),
  KEY `idx_favorite_user` (`user_id`),
  KEY `idx_favorite_soft_delete` (`deleted_at`),
  KEY `fk_fav_created_by` (`created_by`),
  KEY `fk_fav_updated_by` (`updated_by`),
  CONSTRAINT `fk_fav_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fav_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_favorite_activity` FOREIGN KEY (`activity_master_id`) REFERENCES `activity_master` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mapping table for users'' bookmarked or favorite activities';

-- ----------------------------
-- Records of favorite_activity
-- ----------------------------

-- ----------------------------
-- Table structure for locations
-- ----------------------------
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the location',
  `name` varchar(100) NOT NULL COMMENT 'Location name (e.g., OPD, ER, Server Room)',
  `description` varchar(255) DEFAULT NULL COMMENT 'Detailed description of the location',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_locations_name` (`name`),
  KEY `idx_locations_status` (`is_active`,`deleted_at`),
  KEY `fk_locations_created_by` (`created_by`),
  KEY `fk_locations_updated_by` (`updated_by`),
  CONSTRAINT `fk_locations_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_locations_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_locations_active` CHECK (`is_active` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Physical or logical locations where activities are performed';

-- ----------------------------
-- Records of locations
-- ----------------------------
INSERT INTO `locations` VALUES ('1', 'OPD (แผนกผู้ป่วยนอก)', 'ตึกผู้ป่วยนอก ชั้น 1', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `locations` VALUES ('2', 'ER (ห้องฉุกเฉิน)', 'ตึกอุบัติเหตุและฉุกเฉิน ชั้น 1', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `locations` VALUES ('3', 'IPD (แผนกผู้ป่วยใน)', 'ตึกผู้ป่วยใน ชั้น 2-5', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `locations` VALUES ('4', 'LAB (ห้องปฏิบัติการ)', 'ตึกเทคนิคการแพทย์ ชั้น 1', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `locations` VALUES ('5', 'ห้องเซิร์ฟเวอร์', 'ห้องควบคุมเครือข่าย อาคารสารสนเทศ ชั้น 3', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `locations` VALUES ('6', 'ห้องประชุม', 'ห้องประชุม IT อาคารสารสนเทศ ชั้น 2', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the role',
  `name` varchar(50) NOT NULL COMMENT 'Unique name of the role (e.g., Admin, User)',
  `description` varchar(255) DEFAULT NULL COMMENT 'Brief description of the role''s permissions',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Timestamp when the record was created',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Timestamp when the record was last updated',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp for soft delete',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'User ID who created the record',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'User ID who last updated the record',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`),
  KEY `idx_roles_status` (`is_active`,`deleted_at`),
  KEY `fk_roles_created_by` (`created_by`),
  KEY `fk_roles_updated_by` (`updated_by`),
  CONSTRAINT `fk_roles_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_roles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_roles_active` CHECK (`is_active` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User roles defining system access levels';

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', 'Admin', 'System Administrator with full access', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);
INSERT INTO `roles` VALUES ('2', 'User', 'Standard Staff member logging activities', '1', '2026-07-01 12:06:21', '2026-07-01 12:06:21', null, null, null);

-- ----------------------------
-- Table structure for system_setting
-- ----------------------------
DROP TABLE IF EXISTS `system_setting`;
CREATE TABLE `system_setting` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the system setting',
  `setting_key` varchar(100) NOT NULL COMMENT 'Unique config key name',
  `setting_value` text DEFAULT NULL COMMENT 'Configuration value',
  `description` varchar(255) DEFAULT NULL COMMENT 'Purpose and use case of this setting',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete timestamp',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Creator user ID',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'Updater user ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_system_setting_key` (`setting_key`),
  KEY `idx_system_setting_status` (`deleted_at`),
  KEY `fk_setting_created_by` (`created_by`),
  KEY `fk_setting_updated_by` (`updated_by`),
  CONSTRAINT `fk_setting_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_setting_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System-wide settings and configurations';

-- ----------------------------
-- Records of system_setting
-- ----------------------------

-- ----------------------------
-- Table structure for system_settings
-- ----------------------------
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `app_name` varchar(100) NOT NULL DEFAULT 'Work Insight',
  `allow_registration` tinyint(1) NOT NULL DEFAULT 0,
  `max_quick_actions` int(11) NOT NULL DEFAULT 6,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of system_settings
-- ----------------------------
INSERT INTO `system_settings` VALUES ('1', 'Digital-Work Insight', '0', '6', '2026-07-01 14:50:28');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the user',
  `username` varchar(50) NOT NULL COMMENT 'Unique username for authentication',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hashed password for security',
  `full_name` varchar(150) NOT NULL COMMENT 'Full name of the user',
  `position` varchar(100) DEFAULT NULL COMMENT 'Professional job position in the organization',
  `role_id` bigint(20) unsigned NOT NULL COMMENT 'Foreign key referencing the user''s role',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT 'URL or file path to the user''s avatar image',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Flag indicating if active (1 = Active, 0 = Inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Timestamp when the user was created',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Timestamp when the user was last updated',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp for soft delete',
  `created_by` bigint(20) unsigned DEFAULT NULL COMMENT 'User ID who created the user profile',
  `updated_by` bigint(20) unsigned DEFAULT NULL COMMENT 'User ID who last updated the user profile',
  `preferred_categories` varchar(255) DEFAULT NULL,
  `managed_categories` varchar(255) DEFAULT NULL,
  `quick_actions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  KEY `fk_users_role_id` (`role_id`),
  KEY `idx_users_status` (`is_active`,`deleted_at`),
  KEY `idx_users_search` (`full_name`,`position`),
  KEY `fk_users_created_by` (`created_by`),
  KEY `fk_users_updated_by` (`updated_by`),
  CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_users_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_users_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_users_active` CHECK (`is_active` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Users table storing credentials and profile information';

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '$2b$10$IfmYUolSch.GyuWcZl/xeO3Kr26S8zjl7HgfPX', 'System Admin', 'IT Administrator', '1', null, '0', '2026-07-01 12:06:21', '2026-07-01 14:05:36', null, null, null, null, null);
