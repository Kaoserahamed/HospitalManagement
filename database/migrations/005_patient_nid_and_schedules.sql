-- Migration: Update patients to use NID/phone and add doctor schedules
USE hospital_db;

-- =====================================================
-- UPDATE PATIENT PROFILES
-- =====================================================
-- Add NID (National ID) and phone for patients
-- First add as nullable, then update existing records, then make NOT NULL

-- Add columns as nullable first
ALTER TABLE patient_profiles 
ADD COLUMN nid VARCHAR(50) NULL AFTER user_id,
ADD COLUMN phone VARCHAR(20) NULL AFTER nid;

-- Update existing patient profiles with dummy data (you should update these manually)
-- This ensures migration doesn't fail
UPDATE patient_profiles 
SET 
    nid = CONCAT('TEMP_NID_', id),
    phone = CONCAT('TEMP_', SUBSTRING(id, 1, 10))
WHERE nid IS NULL OR phone IS NULL;

-- Now make them NOT NULL and UNIQUE
ALTER TABLE patient_profiles 
MODIFY nid VARCHAR(50) NOT NULL,
MODIFY phone VARCHAR(20) NOT NULL,
ADD UNIQUE KEY unique_nid (nid),
ADD UNIQUE KEY unique_phone (phone),
ADD INDEX idx_nid (nid),
ADD INDEX idx_phone (phone);

-- =====================================================
-- UPDATE USERS TABLE
-- =====================================================
-- Make email and password_hash nullable for patients
ALTER TABLE users 
MODIFY email VARCHAR(255) NULL,
MODIFY password_hash VARCHAR(255) NULL;

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
