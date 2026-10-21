# Day 2 Architecture: Service Boundaries, Database Schema, API Contracts

## Repository
`HospitalManagement` — Hospital Management System (FastAPI + React + MySQL)

## Proposed Concept
Comprehensive hospital management system with EHR integration, appointment scheduling, pharmacy inventory, staff scheduling, billing/insurance claims, and patient portal.

## Service Boundaries
| Service | Responsibility | Technology |
|---------|---------------|------------|
| Patient Service | Patient demographics, medical history, allergies, insurance, emergency contacts | FastAPI, SQLAlchemy, MySQL |
| Appointment Service | Booking, calendar, slot management, conflict detection | FastAPI, SQLAlchemy, MySQL |
| EHR Service | Encounters, diagnoses, prescriptions, lab results, vitals, SOAP notes | FastAPI, SQLAlchemy, MySQL |
| Pharmacy Service | Medication stock, dispensing, drug interaction checks | FastAPI, SQLAlchemy, MySQL |
| Billing Service | Charges, payments, invoices, insurance claims, coding | FastAPI, SQLAlchemy, MySQL |
| Staff Service | Staff profiles, credentials, scheduling, shifts | FastAPI, SQLAlchemy, MySQL |
| Auth Service | Doctor/nurse/patient/admin/pharmacist roles, JWT, MFA | FastAPI, PyJWT, Argon2 |

## Database Schema (MySQL 8.0+)
- `users` — id, email, password_hash, role (admin/doctor/receptionist/patient), created_at
- `patients` — id, user_id, demographics, medical_history, allergies, insurance, emergency_contacts, created_at
- `staff` — id, user_id, credentials, specialty, license_number, department_id, schedule, created_at
- `departments` — id, name, rooms, equipment, created_at
- `appointments` — id, patient_id, doctor_id, department_id, room_id, type, status, scheduled_at, created_at
- `doctor_schedules` — id, doctor_id, day_of_week, start_time, end_time, is_available, created_at
- `ehr_encounters` — id, patient_id, doctor_id, diagnosis, prescriptions, lab_results, vitals, soap_notes, created_at
- `prescriptions` — id, encounter_id, medication, dosage, instructions, created_at
- `pharmacy_inventory` — id, medication_name, stock_level, reorder_point, supplier, created_at
- `pharmacy_dispensing` — id, prescription_id, medication, quantity, dispensed_at, pharmacist_id
- `drug_interactions` — id, medication1, medication2, severity, description, created_at
- `billing_charges` — id, patient_id, encounter_id, amount, status, created_at
- `insurance_claims` — id, charge_id, claim_id, status, submitted_at, denials, created_at
- `medical_codes` — id, code (ICD-10/CPT/HCPCS), description, category, created_at
- `audit_logs` — id, user_id, action, entity_type, entity_id, phi_accessed, timestamp, immutable

## API Contracts
### Authentication
- `POST /auth/login` → {access_token}
- `POST /auth/register-patient` → {patient}
- `POST /auth/create-user` (Admin only) → {user}

### Departments
- `GET /departments` → list
- `POST /departments` → {department}
- `PUT /departments/{id}` → {department}

### Appointments
- `GET /appointments` → list (filtered by role)
- `POST /appointments` — {patientId, doctorId, datetime, type} → {appointment}
- `PUT /appointments/{id}` — {status} → {appointment}

### EHR
- `GET /prescriptions` → list
- `POST /prescriptions` — {encounterId, medication, dosage} → {prescription}
- `GET /ehr/encounters/{id}` → {encounter, prescriptions, vitals}

### Pharmacy
- `GET /pharmacy/inventory` → list (stock levels, low-stock alerts)
- `POST /pharmacy/dispense` — {prescriptionId, quantity} → {dispensing}
- `GET /pharmacy/interactions` — {med1, med2} → {severity}

### Billing
- `GET /billing/charges` → list
- `POST /billing/claims` — {chargeId} → {claim}
- `GET /billing/claims/{id}` → {status}

### Staff
- `GET /staff/schedules` → list
- `POST /staff/schedules` — {doctorId, day, start, end} → {schedule}

## Technical Notes
- JWT-based authentication with issuer/audience-pinned claims
- Password hashing: pwdlib with Argon2
- Roles: Admin, Doctor, Receptionist, Patient
- Token expiration: configurable (default 60 minutes)
- FHIR/HL7 integration planned (not yet implemented)
- No telemedicine, no pharmacy inventory, no insurance claims yet
- No HIPAA audit logging or encryption at rest yet

## Day 2 Outcome
Architecture design documented. No code changes. 0 PRs. Ready for Day 3 (CI/CD pipeline).