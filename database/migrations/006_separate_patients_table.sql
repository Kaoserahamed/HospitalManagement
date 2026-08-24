-- Migration: Separate patients from users table
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
-- MIGRATE EXISTING PATIENT DATA
-- =====================================================
-- Copy patient data from users and patient_profiles to new patients table
INSERT INTO patients (
    id, nid, phone, first_name, last_name, date_of_birth, gender, 
    blood_group, address, emergency_contact_name, emergency_contact_phone, 
    medical_history, allergies, is_active, created_at, updated_at
)
SELECT 
    u.id,
    pp.nid,
    pp.phone,
    u.first_name,
    u.last_name,
    pp.date_of_birth,
    pp.gender,
    pp.blood_group,
    pp.address,
    pp.emergency_contact_name,
    pp.emergency_contact_phone,
    pp.medical_history,
    pp.allergies,
    u.is_active,
    u.created_at,
    u.updated_at
FROM users u
INNER JOIN patient_profiles pp ON u.id = pp.user_id
WHERE u.role = 'patient'
ON DUPLICATE KEY UPDATE patients.id = patients.id; -- Skip if already exists

-- =====================================================
-- UPDATE APPOINTMENTS TABLE
-- =====================================================
-- Update foreign key for patient_id to point to patients table instead of users
ALTER TABLE appointments DROP FOREIGN KEY appointments_ibfk_1;
ALTER TABLE appointments 
ADD CONSTRAINT appointments_patient_fk 
FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

-- =====================================================
-- CLEANUP
-- =====================================================
-- Drop patient_profiles table (no longer needed)
DROP TABLE IF EXISTS patient_profiles;

-- Remove patients from users table (keep them for now for data integrity)
-- We'll manually clean them up after verifying the migration

-- NOTE: Cannot make email/password_hash NOT NULL yet if patients exist in users table
-- Only make them NOT NULL after removing patient users
SELECT 'Migration completed! Review patients table and manually delete patient users if needed.' AS status;
