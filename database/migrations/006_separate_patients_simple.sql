-- Migration: Create separate patients table (simplified - no data migration)
USE hospital_db;

-- =====================================================
-- CREATE PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nid VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nid (nid),
    INDEX idx_phone (phone),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- UPDATE APPOINTMENTS TABLE
-- =====================================================
-- Check if foreign key exists and drop it
SET @fk_exists = (SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'appointments' 
    AND CONSTRAINT_NAME = 'appointments_ibfk_1');

SET @sql_drop_fk = IF(@fk_exists > 0,
    'ALTER TABLE appointments DROP FOREIGN KEY appointments_ibfk_1',
    'SELECT "Foreign key appointments_ibfk_1 does not exist" AS message');
PREPARE stmt FROM @sql_drop_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new foreign key to patients table
SET @fk_new_exists = (SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'hospital_db' 
    AND TABLE_NAME = 'appointments' 
    AND CONSTRAINT_NAME = 'appointments_patient_fk');

SET @sql_add_fk = IF(@fk_new_exists = 0,
    'ALTER TABLE appointments ADD CONSTRAINT appointments_patient_fk FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE',
    'SELECT "Foreign key appointments_patient_fk already exists" AS message');
PREPARE stmt FROM @sql_add_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migration completed! Patients table created.' AS status;
SELECT 'NOTE: You need to manually register patients again as the old patient data is not migrated.' AS warning;
