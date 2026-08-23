-- Create Database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient', 'receptionist') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 2. DEPARTMENTS TABLE
-- -- =====================================================
-- CREATE TABLE departments (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     name VARCHAR(100) NOT NULL UNIQUE,
--     description TEXT,
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     INDEX idx_name (name)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 3. PATIENTS TABLE
-- -- =====================================================
-- CREATE TABLE patients (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     user_id CHAR(36) NOT NULL UNIQUE,
--     patient_code VARCHAR(20) NOT NULL UNIQUE,
--     date_of_birth DATE NOT NULL,
--     gender ENUM('male', 'female', 'other') NOT NULL,
--     blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
--     address TEXT,
--     emergency_contact_name VARCHAR(100),
--     emergency_contact_phone VARCHAR(20),
--     medical_history TEXT,
--     allergies TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     INDEX idx_user_id (user_id),
--     INDEX idx_patient_code (patient_code)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 4. DOCTORS TABLE
-- -- =====================================================
-- CREATE TABLE doctors (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     user_id CHAR(36) NOT NULL UNIQUE,
--     doctor_code VARCHAR(20) NOT NULL UNIQUE,
--     department_id CHAR(36) NOT NULL,
--     specialization VARCHAR(100) NOT NULL,
--     qualification VARCHAR(255) NOT NULL,
--     experience_years INT NOT NULL,
--     consultation_fee DECIMAL(10, 2) NOT NULL,
--     is_available BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
--     INDEX idx_user_id (user_id),
--     INDEX idx_department_id (department_id),
--     INDEX idx_doctor_code (doctor_code),
--     INDEX idx_specialization (specialization)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 5. DOCTOR SCHEDULES TABLE
-- -- =====================================================
-- CREATE TABLE doctor_schedules (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     doctor_id CHAR(36) NOT NULL,
--     day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
--     start_time TIME NOT NULL,
--     end_time TIME NOT NULL,
--     slot_duration INT NOT NULL DEFAULT 30 COMMENT 'Duration in minutes',
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
--     UNIQUE KEY unique_doctor_day (doctor_id, day_of_week),
--     INDEX idx_doctor_id (doctor_id),
--     INDEX idx_day_of_week (day_of_week)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 6. APPOINTMENTS TABLE
-- -- =====================================================
-- CREATE TABLE appointments (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     appointment_number VARCHAR(20) NOT NULL UNIQUE,
--     patient_id CHAR(36) NOT NULL,
--     doctor_id CHAR(36) NOT NULL,
--     appointment_date DATE NOT NULL,
--     appointment_time TIME NOT NULL,
--     status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
--     reason_for_visit TEXT,
--     notes TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
--     FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
--     INDEX idx_patient_id (patient_id),
--     INDEX idx_doctor_id (doctor_id),
--     INDEX idx_appointment_date (appointment_date),
--     INDEX idx_status (status),
--     INDEX idx_doctor_date (doctor_id, appointment_date),
--     INDEX idx_patient_date (patient_id, appointment_date)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 7. MEDICAL RECORDS TABLE
-- -- =====================================================
-- CREATE TABLE medical_records (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     record_number VARCHAR(20) NOT NULL UNIQUE,
--     patient_id CHAR(36) NOT NULL,
--     doctor_id CHAR(36) NOT NULL,
--     appointment_id CHAR(36),
--     visit_date DATE NOT NULL,
--     chief_complaint TEXT,
--     diagnosis TEXT,
--     symptoms TEXT,
--     vital_signs JSON COMMENT 'Stores blood_pressure, temperature, pulse, weight, height',
--     treatment_plan TEXT,
--     notes TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
--     FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
--     FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
--     INDEX idx_patient_id (patient_id),
--     INDEX idx_doctor_id (doctor_id),
--     INDEX idx_visit_date (visit_date),
--     INDEX idx_patient_visit (patient_id, visit_date)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 8. PRESCRIPTIONS TABLE
-- -- =====================================================
-- CREATE TABLE prescriptions (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     prescription_number VARCHAR(20) NOT NULL UNIQUE,
--     medical_record_id CHAR(36) NOT NULL,
--     patient_id CHAR(36) NOT NULL,
--     doctor_id CHAR(36) NOT NULL,
--     medication_name VARCHAR(255) NOT NULL,
--     dosage VARCHAR(100) NOT NULL,
--     frequency VARCHAR(100) NOT NULL,
--     duration VARCHAR(100) NOT NULL,
--     instructions TEXT,
--     issued_date DATE NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
--     FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
--     FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
--     INDEX idx_medical_record_id (medical_record_id),
--     INDEX idx_patient_id (patient_id),
--     INDEX idx_doctor_id (doctor_id),
--     INDEX idx_issued_date (issued_date),
--     INDEX idx_patient_issued (patient_id, issued_date)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 9. BILLS TABLE
-- -- =====================================================
-- CREATE TABLE bills (
--     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--     bill_number VARCHAR(20) NOT NULL UNIQUE,
--     patient_id CHAR(36) NOT NULL,
--     appointment_id CHAR(36),
--     total_amount DECIMAL(10, 2) NOT NULL,
--     paid_amount DECIMAL(10, 2) DEFAULT 0.00,
--     balance DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
--     payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
--     payment_method ENUM('cash', 'card', 'insurance', 'online'),
--     bill_date DATE NOT NULL,
--     payment_date DATE,
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
--     FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
--     INDEX idx_patient_id (patient_id),
--     INDEX idx_bill_date (bill_date),
--     INDEX idx_payment_status (payment_status),
--     INDEX idx_patient_status (patient_id, payment_status)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- TRIGGERS
-- -- =====================================================

-- -- Trigger to auto-generate patient code
-- DELIMITER $$
-- CREATE TRIGGER before_patient_insert
-- BEFORE INSERT ON patients
-- FOR EACH ROW
-- BEGIN
--     IF NEW.patient_code IS NULL OR NEW.patient_code = '' THEN
--         SET NEW.patient_code = CONCAT('PAT-', YEAR(NOW()), '-', LPAD((SELECT COUNT(*) + 1 FROM patients), 6, '0'));
--     END IF;
-- END$$
-- DELIMITER ;

-- -- Trigger to auto-generate doctor code
-- DELIMITER $$
-- CREATE TRIGGER before_doctor_insert
-- BEFORE INSERT ON doctors
-- FOR EACH ROW
-- BEGIN
--     IF NEW.doctor_code IS NULL OR NEW.doctor_code = '' THEN
--         SET NEW.doctor_code = CONCAT('DOC-', YEAR(NOW()), '-', LPAD((SELECT COUNT(*) + 1 FROM doctors), 6, '0'));
--     END IF;
-- END$$
-- DELIMITER ;

-- -- =====================================================
-- -- VIEWS
-- -- =====================================================

-- -- View for appointment details with patient and doctor names
-- CREATE OR REPLACE VIEW appointment_details AS
-- SELECT 
--     a.id,
--     a.appointment_number,
--     a.appointment_date,
--     a.appointment_time,
--     a.status,
--     a.reason_for_visit,
--     CONCAT(pu.first_name, ' ', pu.last_name) AS patient_name,
--     p.patient_code,
--     CONCAT(du.first_name, ' ', du.last_name) AS doctor_name,
--     d.doctor_code,
--     d.specialization,
--     dept.name AS department_name,
--     a.created_at
-- FROM appointments a
-- JOIN patients p ON a.patient_id = p.id
-- JOIN users pu ON p.user_id = pu.id
-- JOIN doctors d ON a.doctor_id = d.id
-- JOIN users du ON d.user_id = du.id
-- JOIN departments dept ON d.department_id = dept.id;

-- -- View for patient details with user information
-- CREATE OR REPLACE VIEW patient_details AS
-- SELECT 
--     p.id,
--     p.patient_code,
--     u.email,
--     CONCAT(u.first_name, ' ', u.last_name) AS full_name,
--     u.first_name,
--     u.last_name,
--     u.phone,
--     p.date_of_birth,
--     p.gender,
--     p.blood_group,
--     p.address,
--     p.emergency_contact_name,
--     p.emergency_contact_phone,
--     p.medical_history,
--     p.allergies,
--     p.created_at
-- FROM patients p
-- JOIN users u ON p.user_id = u.id
-- WHERE u.is_active = TRUE;

-- -- View for doctor details with user and department information
-- CREATE OR REPLACE VIEW doctor_details AS
-- SELECT 
--     d.id,
--     d.doctor_code,
--     u.email,
--     CONCAT(u.first_name, ' ', u.last_name) AS full_name,
--     u.first_name,
--     u.last_name,
--     u.phone,
--     d.specialization,
--     d.qualification,
--     d.experience_years,
--     d.consultation_fee,
--     d.is_available,
--     dept.id AS department_id,
--     dept.name AS department_name,
--     d.created_at
-- FROM doctors d
-- JOIN users u ON d.user_id = u.id
-- JOIN departments dept ON d.department_id = dept.id
-- WHERE u.is_active = TRUE;

-- -- =====================================================
-- -- SAMPLE DATA (Optional - for testing)
-- -- =====================================================

-- -- Insert admin user
-- INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone)
-- VALUES 
-- ('admin-uuid-001', 'admin@hospital.com', '$2b$10$YourHashedPasswordHere', 'admin', 'Admin', 'User', '+1234567890');

-- -- Insert departments
-- INSERT INTO departments (id, name, description) VALUES
-- ('dept-uuid-001', 'Cardiology', 'Heart and cardiovascular care'),
-- ('dept-uuid-002', 'Neurology', 'Brain and nervous system care'),
-- ('dept-uuid-003', 'Orthopedics', 'Bone and joint care'),
-- ('dept-uuid-004', 'Pediatrics', 'Children healthcare'),
-- ('dept-uuid-005', 'General Medicine', 'General healthcare services');

-- -- =====================================================
-- -- INDEXES SUMMARY
-- -- =====================================================
-- -- All foreign keys are indexed
-- -- Email, dates, and status fields are indexed
-- -- Composite indexes for common query patterns
-- -- Unique constraints on code fields

-- -- =====================================================
-- -- DATABASE COMPLETED
-- -- =====================================================
