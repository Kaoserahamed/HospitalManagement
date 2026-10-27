# Domain Model

## 1. Overview

This document describes the domain model for the HospitalManagement platform. It complements
the data dictionary with behavior, invariants, and relationships.

## 2. Bounded Contexts

### 2.1 Identity & Access

Entities: User, Role, Permission, Session.
- User has one Role; Role has many Permissions.
- Authentication via credentials; authorization via RBAC.
- Break-glass access (Phase 12) grants temporary elevated permissions with audit.

### 2.2 Patient

Entities: Patient, Insurance, EmergencyContact, Allergy, MedicalHistory.
- Patient may exist without a User account (staff-created).
- Allergies and medical history are PHI and audited.
- Insurance tracked for billing.

### 2.3 Clinical (EHR)

Entities: Encounter, Diagnosis, Vital, Medication, Prescription, LabResult, ImagingStudy.
- Encounter belongs to Patient and Doctor; has many Diagnoses, Vitals, Prescriptions.
- SOAP notes attach to Encounter.
- E-signatures required for finalized notes (Phase 2).

### 2.4 Scheduling

Entities: Department, Doctor, Schedule, Appointment, Queue.
- Schedule defines availability; Appointment consumes a slot.
- Conflict detection prevents double booking.
- Queue tracks check-in and wait times.

### 2.5 Pharmacy

Entities: Medication, Stock, Lot, Supplier, Dispense, Interaction.
- Stock tracked by lot with expiry.
- Dispense checks interactions and allergies.
- Reorder points trigger alerts.

### 2.6 Billing & Insurance

Entities: Charge, Invoice, Payment, Claim, Denial, Appeal.
- Charges generated from encounters/prescriptions.
- Invoice aggregates charges; Payment settles.
- Claim submitted to payer; Denial/Appeal track resolution.

### 2.7 Staff & Operations

Entities: StaffProfile, Shift, TimeOff, Roster, Room, Equipment.
- Shift assignments with conflict detection.
- Time-off approval workflow.
- Coverage alerts for gaps.

### 2.8 Telemedicine

Entities: VirtualVisit, WaitingRoom, Session, Recording (metadata).
- Visit links to Appointment and Encounter.
- Session quality metrics captured.

### 2.9 Analytics

Entities: Registry, Outcome, QualityMeasure, Report.
- Aggregated, de-identified where possible.
- Scheduled report delivery.

## 3. Key Invariants

- An Appointment cannot overlap for the same Doctor.
- A Prescription requires a valid Doctor and Patient.
- A Dispense requires sufficient stock and no blocking interaction.
- A Claim requires a finalized Encounter and coding.
- PHI access is always audited.

## 4. Domain Events

- PatientRegistered
- AppointmentBooked, AppointmentCancelled, AppointmentCompleted
- EncounterCreated, EncounterFinalized
- PrescriptionIssued
- DispenseCompleted
- InvoiceGenerated, PaymentReceived
- ClaimSubmitted, ClaimDenied

## 5. Aggregates

- Patient aggregate: Patient + Insurance + Allergy + MedicalHistory.
- Encounter aggregate: Encounter + Diagnoses + Vitals + Prescriptions.
- Invoice aggregate: Invoice + Charges + Payments.

## 6. Repositories

Each aggregate has a repository interface in its module; implementations use SQLAlchemy.
Repositories never leak ORM objects beyond the module boundary; they return domain/DTO objects.

## 7. Services

Services orchestrate use cases, enforce invariants, and publish domain events.
They depend on repository interfaces, not concrete implementations.

## 8. Validation

- Input validation at API boundary (Pydantic).
- Business rule validation in services.
- Database constraints as last line of defense.

## 9. Concurrency

- Optimistic locking via version columns for mutable aggregates.
- Pessimistic locks for slot booking (short-lived).

## 10. Extensibility

- New modules added under `backend/modules/`.
- Domain events allow loose coupling.
- Feature flags gate new capabilities.

## 11. References

- `docs/data-dictionary.md`
- `docs/architecture.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md`
