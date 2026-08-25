# Hospital Management System - Database Schema

## Overview
This directory contains the complete database schema for the Hospital Management System.

## Files
- **complete_schema.sql** - Complete database schema with all tables and seed admin user

## Database Setup

### Fresh Installation
```bash
mysql -u root -p < complete_schema.sql
```

This will:
1. Create the `hospital_db` database
2. Create all required tables
3. Seed the default admin user

### Default Credentials
- **Email:** admin@hospital.com
- **Password:** Admin@123

## Database Tables

### 1. users (Staff Only)
Staff authentication table for admin, doctor, and receptionist roles.
- Authentication: Email + Password
- Fields: id, email, password_hash, role, first_name, last_name, phone, is_active, created_at, updated_at

### 2. patients (Separate from Staff)
Patient records completely independent from staff users.
- Authentication: NID + Phone (no email/password)
- Fields: id, nid, phone, first_name, last_name, date_of_birth, gender, blood_group, address, emergency contacts, medical_history, allergies, is_active, created_at, updated_at

### 3. departments
Hospital departments.
- Fields: id, name, description, is_active, created_at, updated_at

### 4. doctor_profiles
Links doctors (users) to departments with specialization.
- Fields: id, user_id (FK→users), department_id (FK→departments), specialization, created_at, updated_at

### 5. doctor_schedules
Doctor working schedules with time slots.
- Fields: id, doctor_id (FK→users), day_of_week, start_time, end_time, slot_duration, is_active, created_at, updated_at

### 6. appointments
Patient appointments with doctors.
- Fields: id, patient_id (FK→patients), doctor_id (FK→users), department_id (FK→departments), appointment_date, appointment_time, status, reason, notes, created_at, updated_at
- Status: scheduled, confirmed, completed, cancelled, no_show

### 7. prescriptions
Prescriptions issued by doctors to patients.
- Fields: id, appointment_id (FK→appointments), patient_id (FK→patients), doctor_id (FK→users), diagnosis, medications (JSON), instructions, follow_up_date, created_at, updated_at

## Authentication Architecture

### Staff Authentication (Email + Password)
- Used by: Admin, Doctor, Receptionist
- JWT Token: Contains `sub` (user_id), `role`, `type: "staff"`
- Login Endpoint: POST /auth/login

### Patient Authentication (NID + Phone)
- Used by: Patients
- JWT Token: Contains `sub` (patient_id), `type: "patient"`
- Login Endpoint: POST /auth/patients/login
- Registration: Public endpoint at POST /auth/patients/register

## Key Design Decisions

1. **Separate Patient Table**: Patients are NOT in the users table. They have their own authentication system using NID + phone.

2. **Staff Only in Users Table**: The users table contains ONLY staff (admin, doctor, receptionist) with email/password authentication.

3. **No Patient Role in Users**: The UserRole enum does NOT include 'patient' - it only has admin, doctor, receptionist.

4. **Dual Authentication System**: 
   - Staff use `get_current_user()` dependency
   - Patients use `get_current_patient()` dependency

5. **Public Endpoints**: Department and schedule information is publicly accessible for appointment booking.

## Indexes

All foreign keys are indexed. Additional indexes on:
- users: email, role, is_active
- patients: nid, phone, is_active, date_of_birth
- departments: name, is_active
- doctor_schedules: doctor_id, day_of_week, is_active, unique(doctor_id, day_of_week, start_time, end_time)
- appointments: patient_id, doctor_id, department_id, appointment_date, status, doctor+date, patient+date
- prescriptions: appointment_id, patient_id, doctor_id, created_at

## Foreign Key Constraints

- CASCADE: When parent is deleted, child is deleted
  - users → doctor_profiles (doctor deleted → profile deleted)
  - departments → departments (department deleted → assignment removed)
  - patients → appointments (patient deleted → appointments deleted)
  - appointments → prescriptions (appointment deleted → prescriptions deleted)

- RESTRICT: Cannot delete parent if child exists
  - users/doctors → appointments (cannot delete doctor with appointments)
  - departments → appointments (cannot delete department with appointments)
  - users/doctors → prescriptions (cannot delete doctor with prescriptions)
