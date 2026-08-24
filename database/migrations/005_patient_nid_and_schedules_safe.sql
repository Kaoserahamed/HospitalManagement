-- Migration: Update patients to use NID/phone and add doctor schedules (SAFE VERSION)
USE hospital_db;

-- =====================================================
-- UPDATE PATIENT PROFILES - SAFE VERSION
-- =====================================================
-- Check and add NID if not exists
SET @nid_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND COLUMN_NAME = 'nid');

SET @sql_nid = IF(@nid_exists = 0,
    'ALTER TABLE patient_profiles ADD COLUMN nid VARCHAR(50) NULL AFTER user_id',
    'SELECT "Column nid already exists" AS message');
PREPARE stmt FROM @sql_nid;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add phone if not exists
SET @phone_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND COLUMN_NAME = 'phone');

SET @sql_phone = IF(@phone_exists = 0,
    'ALTER TABLE patient_profiles ADD COLUMN phone VARCHAR(20) NULL AFTER nid',
    'SELECT "Column phone already exists" AS message');
PREPARE stmt FROM @sql_phone;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records with temp data if needed
UPDATE patient_profiles 
SET 
    nid = CONCAT('TEMP_NID_', id),
    phone = CONCAT('TEMP_', SUBSTRING(id, 1, 10))
WHERE nid IS NULL OR phone IS NULL;

-- Make columns NOT NULL
ALTER TABLE patient_profiles 
MODIFY COLUMN nid VARCHAR(50) NOT NULL,
MODIFY COLUMN phone VARCHAR(20) NOT NULL;

-- Add unique constraints if they don't exist
SET @constraint_nid = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND CONSTRAINT_NAME = 'unique_nid');

SET @sql_constraint_nid = IF(@constraint_nid = 0,
    'ALTER TABLE patient_profiles ADD UNIQUE KEY unique_nid (nid)',
    'SELECT "Constraint unique_nid already exists" AS message');
PREPARE stmt FROM @sql_constraint_nid;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @constraint_phone = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND CONSTRAINT_NAME = 'unique_phone');

SET @sql_constraint_phone = IF(@constraint_phone = 0,
    'ALTER TABLE patient_profiles ADD UNIQUE KEY unique_phone (phone)',
    'SELECT "Constraint unique_phone already exists" AS message');
PREPARE stmt FROM @sql_constraint_phone;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes if they don't exist
SET @idx_nid = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND INDEX_NAME = 'idx_nid');

SET @sql_idx_nid = IF(@idx_nid = 0,
    'ALTER TABLE patient_profiles ADD INDEX idx_nid (nid)',
    'SELECT "Index idx_nid already exists" AS message');
PREPARE stmt FROM @sql_idx_nid;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_phone = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'patient_profiles' 
    AND INDEX_NAME = 'idx_phone');

SET @sql_idx_phone = IF(@idx_phone = 0,
    'ALTER TABLE patient_profiles ADD INDEX idx_phone (phone)',
    'SELECT "Index idx_phone already exists" AS message');
PREPARE stmt FROM @sql_idx_phone;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- UPDATE USERS TABLE
-- =====================================================
-- Make email and password_hash nullable for patients
ALTER TABLE users 
MODIFY COLUMN email VARCHAR(255) NULL,
MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- =====================================================
-- DOCTOR SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    doctor_id CHAR(36) NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INT NOT NULL COMMENT 'Duration in minutes',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_is_active (is_active),
    UNIQUE KEY unique_doctor_day (doctor_id, day_of_week, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Migration completed successfully!' AS status;
