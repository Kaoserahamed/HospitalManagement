# Core Entities & Database Design - Hospital Management System

## Entity Relationship Overview

### Core Entities
1. Users
2. Patients
3. Doctors
4. Departments
5. Appointments
6. Medical Records
7. Prescriptions
8. Bills/Payments

---

## Database Schema

### 1. users
Primary authentication and user management table.

```sql
users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── role (ENUM: 'admin', 'doctor', 'patient')
├── first_name
├── last_name
├── phone
├── is_active
├── created_at
└── updated_at
```

**Relationships:**
- One-to-One with patients (if role = 'patient')
- One-to-One with doctors (if role = 'doctor')

---

### 2. patients
Patient-specific information.

```sql
patients
├── id (PK)
├── user_id (FK -> users.id, UNIQUE)
├── patient_code (UNIQUE)
├── date_of_birth
├── gender (ENUM: 'male', 'female', 'other')
├── blood_group (ENUM: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
├── address
├── emergency_contact_name
├── emergency_contact_phone
├── medical_history (TEXT)
├── allergies (TEXT)
├── created_at
└── updated_at
```

**Relationships:**
- One-to-Many with appointments
- One-to-Many with medical_records
- One-to-Many with bills

---

### 3. departments
Hospital departments/specializations.

```sql
departments
├── id (PK)
├── name (UNIQUE)
├── description
├── is_active
├── created_at
└── updated_at
```

**Relationships:**
- One-to-Many with doctors

---

### 4. doctors
Doctor profiles and information.

```sql
doctors
├── id (PK)
├── user_id (FK -> users.id, UNIQUE)
├── doctor_code (UNIQUE)
├── department_id (FK -> departments.id)
├── specialization
├── qualification
├── experience_years
├── consultation_fee
├── is_available
├── created_at
└── updated_at
```

**Relationships:**
- Many-to-One with departments
- One-to-Many with appointments
- One-to-Many with doctor_schedules
- One-to-Many with medical_records
- One-to-Many with prescriptions

---

### 5. doctor_schedules
Doctor availability and working hours.

```sql
doctor_schedules
├── id (PK)
├── doctor_id (FK -> doctors.id)
├── day_of_week (ENUM: 'monday', 'tuesday', ..., 'sunday')
├── start_time (TIME)
├── end_time (TIME)
├── slot_duration (INT, minutes)
├── is_active
├── created_at
└── updated_at
```

**Unique Constraint:** (doctor_id, day_of_week)

---

### 6. appointments
Patient-doctor appointments.

```sql
appointments
├── id (PK)
├── appointment_number (UNIQUE)
├── patient_id (FK -> patients.id)
├── doctor_id (FK -> doctors.id)
├── appointment_date
├── appointment_time
├── status (ENUM: 'scheduled', 'completed', 'cancelled', 'no_show')
├── reason_for_visit (TEXT)
├── notes (TEXT)
├── created_at
└── updated_at
```

**Relationships:**
- Many-to-One with patients
- Many-to-One with doctors
- One-to-One with medical_records
- One-to-One with bills

**Indexes:**
- (patient_id, appointment_date)
- (doctor_id, appointment_date)
- (appointment_date, status)

---

### 7. medical_records
Patient medical records and diagnoses.

```sql
medical_records
├── id (PK)
├── record_number (UNIQUE)
├── patient_id (FK -> patients.id)
├── doctor_id (FK -> doctors.id)
├── appointment_id (FK -> appointments.id, NULLABLE)
├── visit_date
├── chief_complaint (TEXT)
├── diagnosis (TEXT)
├── symptoms (TEXT)
├── vital_signs (JSON: blood_pressure, temperature, pulse, weight, height)
├── treatment_plan (TEXT)
├── notes (TEXT)
├── created_at
└── updated_at
```

**Relationships:**
- Many-to-One with patients
- Many-to-One with doctors
- One-to-Many with prescriptions

**Indexes:**
- (patient_id, visit_date)
- (doctor_id, visit_date)

---

### 8. prescriptions
Medication prescriptions.

```sql
prescriptions
├── id (PK)
├── prescription_number (UNIQUE)
├── medical_record_id (FK -> medical_records.id)
├── patient_id (FK -> patients.id)
├── doctor_id (FK -> doctors.id)
├── medication_name
├── dosage
├── frequency
├── duration
├── instructions (TEXT)
├── issued_date
├── created_at
└── updated_at
```

**Relationships:**
- Many-to-One with medical_records
- Many-to-One with patients
- Many-to-One with doctors

**Indexes:**
- (patient_id, issued_date)
- (medical_record_id)

---

### 9. bills
Billing and payment information.

```sql
bills
├── id (PK)
├── bill_number (UNIQUE)
├── patient_id (FK -> patients.id)
├── appointment_id (FK -> appointments.id, NULLABLE)
├── total_amount (DECIMAL(10,2))
├── paid_amount (DECIMAL(10,2))
├── balance (DECIMAL(10,2))
├── payment_status (ENUM: 'pending', 'partial', 'paid')
├── payment_method (ENUM: 'cash', 'card', 'insurance', 'online')
├── bill_date
├── payment_date (NULLABLE)
├── description (TEXT)
├── created_at
└── updated_at
```

**Relationships:**
- Many-to-One with patients
- One-to-One with appointments (nullable)

**Indexes:**
- (patient_id, bill_date)
- (payment_status, bill_date)

---

## Entity Relationship Diagram (Textual)

```
users (1) -------- (1) patients
users (1) -------- (1) doctors

departments (1) -------- (many) doctors

doctors (1) -------- (many) doctor_schedules
doctors (1) -------- (many) appointments
doctors (1) -------- (many) medical_records
doctors (1) -------- (many) prescriptions

patients (1) -------- (many) appointments
patients (1) -------- (many) medical_records
patients (1) -------- (many) prescriptions
patients (1) -------- (many) bills

appointments (1) -------- (1) medical_records
appointments (1) -------- (1) bills

medical_records (1) -------- (many) prescriptions
```

---

## Key Design Decisions

1. **User-Role Separation**: Users table handles authentication; patients/doctors tables handle role-specific data
2. **Soft Deletes**: Use `is_active` flags instead of hard deletes for audit trail
3. **Unique Codes**: Human-readable unique codes (patient_code, doctor_code) separate from internal IDs
4. **Timestamps**: All tables have created_at and updated_at for audit purposes
5. **Indexes**: Strategic indexes on foreign keys and frequently queried date columns
6. **JSON for Flexibility**: Vital signs stored as JSON for flexible schema
7. **Decimal for Money**: Use DECIMAL(10,2) for monetary values to avoid floating-point errors
8. **ENUM Constraints**: Use ENUMs for fixed-value columns to ensure data integrity
