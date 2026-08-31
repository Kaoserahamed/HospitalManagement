# Hospital Management System - System Design

## Table of Contents
1. [Functional Requirements](#functional-requirements)
2. [Non-Functional Requirements](#non-functional-requirements)
3. [API Design](#api-design)
4. [High-Level Architecture](#high-level-architecture)
5. [Database Schema](#database-schema)

---

## Functional Requirements

### 1. User Management & Authentication

#### FR1.1: Seed Admin Credentials
- **Description**: System must provide default administrator credentials for initial setup
- **Acceptance Criteria**:
  - Default admin account exists on system deployment
  - Credentials: `admin@hospital.com` / `Admin@123`
  - Admin has full system access upon login

#### FR1.2: Staff User Creation
- **Description**: Admin can create doctor and receptionist accounts
- **Acceptance Criteria**:
  - Admin can create users with roles: `doctor`, `receptionist`
  - Required fields: first_name, last_name, email, phone, role
  - System generates temporary passwords for new users
  - New users must change password on first login

#### FR1.3: Password Management
- **Description**: Users can update their passwords after initial login
- **Acceptance Criteria**:
  - Doctors and receptionists can change passwords
  - Secure password hashing (bcrypt)

### 2. Department Management

#### FR2.1: Department Creation
- **Description**: Admin can create and manage hospital departments
- **Acceptance Criteria**:
  - Admin can create departments with name and description
  - Department status can be active/inactive
  - Unique department names enforced

#### FR2.2: Doctor-Department Assignment
- **Description**: Admin can assign doctors to specific departments
- **Acceptance Criteria**:
  - Doctors can be assigned to one department at a time
  - Assignment includes specialization field
  - Only active departments available for assignment

### 3. Schedule Management

#### FR3.1: Doctor Schedule Creation
- **Description**: Admin can create weekly schedules for doctors
- **Acceptance Criteria**:
  - Schedule includes: doctor, day of week, start/end time, slot duration
  - Prevents conflicting schedules for same doctor
  - Supports multiple time slots per day
  - Schedule can be activated/deactivated

### 4. Patient Management

#### FR4.1: Patient Registration
- **Description**: Patients can self-register or be registered by reception
- **Acceptance Criteria**:
  - Patient registration with: name, NID, phone, DOB, gender, address
  - Medical history and allergies fields
  - Emergency contact information
  - Unique NID and phone validation

#### FR4.2: Patient Authentication
- **Description**: Patients can log in to access their portal
- **Acceptance Criteria**:
  - Login using phone number and password
  - Session management

### 5. Appointment Management

#### FR5.1: Appointment Booking
- **Description**: Patients can book appointments with available doctors
- **Acceptance Criteria**:
  - View available time slots by doctor/department
  - Book appointments for future dates only
  - Appointment reason and notes fields

#### FR5.2: Appointment Status Management
- **Description**: Staff can manage appointment statuses
- **Acceptance Criteria**:
  - Status transitions: scheduled → confirmed → completed
  - Cancellation by patient or staff
  - No-show marking by staff
  - Status change notifications

### 6. Prescription Management

#### FR6.1: Prescription Creation
- **Description**: Doctors can create prescriptions for patients
- **Acceptance Criteria**:
  - Link prescriptions to appointments
  - Multiple medications per prescription
  - Medication details: name, dosage, frequency, duration
  - Doctor instructions and follow-up dates

#### FR6.2: Prescription History
- **Description**: Patients and doctors can view prescription history
- **Acceptance Criteria**:
  - Patients view their own prescription history
  - Doctors view prescriptions they created
  - Staff can view any patient's prescriptions

---

## Non-Functional Requirements 

Later
---

## API Design

### Authentication & User Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/login` | POST | User authentication with credentials | No |
| `/users` | GET | Retrieve all staff users | Admin |
| `/users` | POST | Create new staff user | Admin |
| `/users/{id}` | PUT | Update user information | Admin/Self |

### Department Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/departments` | GET | List all departments | Yes |
| `/departments` | POST | Create new department | Admin |
| `/departments/{id}` | PUT | Update department | Admin |
| `/departments/{id}/assign-doctor` | POST | Assign doctor to department | Admin |
| `/departments/doctors` | GET | Get doctors with department info | Admin |

### Schedule Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/schedules` | GET | Get all doctor schedules | Staff |
| `/schedules` | POST | Create doctor schedule | Admin |
| `/schedules/{id}` | DELETE | Remove schedule | Admin |
| `/schedules/my-schedule` | GET | Get doctor's own schedule | Doctor |

### Appointment Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/appointments` | GET | Get appointments (filtered by role) | Yes |
| `/appointments` | POST | Book new appointment | Patient/Staff |
| `/appointments/{id}/status` | PUT | Update appointment status | Staff |
| `/appointments/my-appointments` | GET | Get user's appointments | Patient/Doctor |
| `/appointments/{id}/cancel` | DELETE | Cancel appointment | Patient/Staff |

### Prescription Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/prescriptions` | POST | Create prescription | Doctor |
| `/prescriptions/my-prescriptions` | GET | Get doctor's prescriptions | Doctor |
| `/prescriptions/patient/my-prescriptions` | GET | Get patient's prescriptions | Patient |
| `/prescriptions/patient/{id}` | GET | Get patient prescriptions | Staff |
| `/prescriptions/{id}` | PUT | Update prescription | Doctor |
| `/prescriptions/{id}` | DELETE | Delete prescription | Doctor |

### Patient Management

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/patients/register` | POST | Patient self-registration | No |
| `/patients/login` | POST | Patient authentication | No |
| `/patients` | GET | Get all patients | Staff |
| `/patients/{id}` | GET | Get patient details | Staff/Self |
| `/patients/{id}` | PUT | Update patient information | Staff/Self |



## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   Admin Panel   │ Doctor Portal   │Patient Portal   │Receptionist   │
│   (React SPA)   │  (React SPA)    │ (React SPA)     │Portal(React)  │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
                                    │
                               HTTPS/REST API
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                    • CORS Management                                │
│                    • Request Routing                                │
│                    • Rate Limiting                                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                      FastAPI Backend                                │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Auth     │  │    Users    │  │Appointments │  │Prescriptions│ │
│  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                 │                 │                 │     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Auth     │  │    User     │  │Appointment  │  │Prescription │ │
│  │ Controllers │  │Controllers  │  │Controllers  │  │Controllers  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                 │                 │                 │     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Auth     │  │    User     │  │Appointment  │  │Prescription │ │
│  │   Services  │  │  Services   │  │  Services   │  │  Services   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                 │                 │                 │     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    User     │  │    User     │  │Appointment  │  │Prescription │ │
│  │Repository   │  │Repository   │  │Repository   │  │Repository   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│                      MySQL Database                                 │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Users    │  │ Departments │  │  Patients   │  │Appointments │ │
│  │   Table     │  │   Table     │  │   Table     │  │   Table     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │Doctor       │  │Doctor       │  │Prescriptions│                  │
│  │Profiles     │  │Schedules    │  │   Table     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Frontend Layer
- **Admin Panel**: User management, department management, schedule management
- **Doctor Portal**: Appointment management, prescription creation, schedule viewing
- **Patient Portal**: Appointment booking, prescription history, profile management
- **Receptionist Portal**: Patient registration, appointment management

#### Backend Layer
- **Routes**: HTTP request handling, input validation, response formatting
- **Controllers**: Business logic orchestration, request/response transformation
- **Services**: Core business logic, transaction management, validation rules
- **Repositories**: Data access layer, database query abstraction

#### Data Layer
- **MySQL Database**: Persistent data storage with ACID compliance
- **Connection Pool**: Efficient database connection management
- **Migrations**: Schema version control and deployment

## Database Schema

### Entity Relationship Overview

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Users    │────►│ Doctor_Profiles │────►│  Departments    │
│ (Staff)     │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
      │                       │                       │
      │                       │                       │
      ▼                       ▼                       ▼
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│Doctor       │     │  Appointments   │     │    Patients     │
│Schedules    │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │ Prescriptions   │
                    │                 │
                    └─────────────────┘
```



### Role-Based Access Control Matrix

| Resource | Admin | Doctor | Receptionist | Patient |
|----------|-------|--------|--------------|---------|
| Create Users | ✅ | ❌ | ❌ | ❌ |
| Manage Departments | ✅ | ❌ | ❌ | ❌ |
| Assign Doctors | ✅ | ❌ | ❌ | ❌ |
| Create Schedules | ✅ | ❌ | ❌ | ❌ |
| View All Appointments | ✅ | Own Only | ✅ | Own Only |
| Create Prescriptions | ❌ | ✅ | ❌ | ❌ |
| Patient Registration | ✅ | ❌ | ✅ | Self Only |
| Book Appointments | ❌ | ❌ | For Patients | Self Only |
| View Prescriptions | All | Own Created | All | Own Only |

