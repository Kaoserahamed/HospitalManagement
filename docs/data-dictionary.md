# Data Dictionary (Phase 0 draft)

This document describes the core relational entities. Full schema lives in
`database/complete_schema.sql` and evolves via Alembic (Phase 1).

## 1. users

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | Surrogate key |
| email | VARCHAR(255) UNIQUE | Login identifier |
| password_hash | VARCHAR(255) | Argon2 hash |
| role | ENUM | Admin, Doctor, Receptionist, Patient |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## 2. patients

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK users | Nullable for staff-created |
| first_name | VARCHAR | |
| last_name | VARCHAR | |
| dob | DATE | PHI |
| gender | ENUM | |
| phone | VARCHAR | PHI |
| address | TEXT | PHI |
| insurance_provider | VARCHAR | |
| insurance_number | VARCHAR | PHI |
| emergency_contact | JSON | PHI |
| created_at | TIMESTAMP | |

## 3. departments

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| name | VARCHAR(255) | |
| description | TEXT | |
| location | VARCHAR | |

## 4. doctors (doctor_profiles)

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK users | |
| department_id | BIGINT FK departments | |
| specialty | VARCHAR | |
| license_number | VARCHAR | |
| bio | TEXT | |

## 5. doctor_schedules

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| doctor_id | BIGINT FK | |
| day_of_week | INT | 0-6 |
| start_time | TIME | |
| end_time | TIME | |
| slot_minutes | INT | Appointment slot length |

## 6. appointments

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| patient_id | BIGINT FK patients | |
| doctor_id | BIGINT FK doctors | |
| department_id | BIGINT FK departments | |
| start_time | DATETIME | |
| end_time | DATETIME | |
| status | ENUM | Scheduled, Completed, Cancelled, No-show |
| type | ENUM | Consultation, Follow-up, Emergency |
| notes | TEXT | |

## 7. prescriptions

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| patient_id | BIGINT FK patients | |
| doctor_id | BIGINT FK doctors | |
| appointment_id | BIGINT FK appointments | Nullable |
| medication | VARCHAR | |
| dosage | VARCHAR | |
| frequency | VARCHAR | |
| duration | VARCHAR | |
| notes | TEXT | |
| issued_at | TIMESTAMP | |

## 8. audit_logs (planned)

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| actor_id | BIGINT FK users | |
| action | VARCHAR | |
| resource_type | VARCHAR | |
| resource_id | BIGINT | |
| timestamp | TIMESTAMP | |
| ip_address | VARCHAR | |
| metadata | JSON | No PHI |

## 9. Naming Conventions

- Tables: snake_case, plural.
- Primary keys: `id`.
- Foreign keys: `<entity>_id`.
- Timestamps: `created_at`, `updated_at`.
- Booleans: `is_<state>`.

## 10. Planned Additions (Phases 1-6)

- EHR: encounters, diagnoses, vitals, lab_results, imaging_metadata.
- Pharmacy: medications, stock, lots, dispenses.
- Billing: charges, invoices, payments, claims.
- Staff: shifts, time_off, rosters.
- Telemedicine: sessions, recordings (metadata only).

## 11. References

- `database/complete_schema.sql`
- `docs/adr/0002-mysql-oltp-database.md`
