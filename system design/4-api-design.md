# API Design - Hospital Management System

## API Overview
- **Architecture**: RESTful API
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer Token
- **Base URL**: `/api/v1`

---

## Authentication & Authorization

### Authentication Endpoints

#### 1. Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "patient"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

#### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    }
  }
}
```

#### 3. Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

#### 4. Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }
}
```

---

## Patient Management

#### 1. Create Patient Profile
```http
POST /api/v1/patients
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "bloodGroup": "O+",
  "address": "123 Main St, City, State",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567890",
  "medicalHistory": "No major illnesses",
  "allergies": "Penicillin"
}

Response: 201 Created
{
  "success": true,
  "message": "Patient profile created",
  "data": {
    "id": "uuid",
    "patientCode": "PAT-2024-001",
    "userId": "uuid",
    ...
  }
}
```

#### 2. Get Patient Profile
```http
GET /api/v1/patients/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientCode": "PAT-2024-001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    ...
  }
}
```

#### 3. Update Patient Profile
```http
PUT /api/v1/patients/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "address": "456 New St, City, State",
  "allergies": "Penicillin, Sulfa drugs"
}

Response: 200 OK
```

#### 4. Get All Patients (Admin/Doctor)
```http
GET /api/v1/patients?page=1&limit=10&search=john
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "patients": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

## Doctor Management

#### 1. Create Doctor Profile
```http
POST /api/v1/doctors
Authorization: Bearer {token} (Admin only)
Content-Type: application/json

Request Body:
{
  "userId": "uuid",
  "departmentId": "uuid",
  "specialization": "Cardiology",
  "qualification": "MD, MBBS",
  "experienceYears": 10,
  "consultationFee": 150.00
}

Response: 201 Created
```

#### 2. Get All Doctors
```http
GET /api/v1/doctors?departmentId=uuid&search=smith&page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": "uuid",
        "doctorCode": "DOC-2024-001",
        "firstName": "Sarah",
        "lastName": "Smith",
        "specialization": "Cardiology",
        "consultationFee": 150.00,
        "department": {
          "id": "uuid",
          "name": "Cardiology"
        },
        "isAvailable": true
      }
    ],
    "pagination": {...}
  }
}
```

#### 3. Get Doctor Details
```http
GET /api/v1/doctors/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### 4. Update Doctor Profile
```http
PUT /api/v1/doctors/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### 5. Get Doctor Availability
```http
GET /api/v1/doctors/:id/availability?date=2024-01-15
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "doctorId": "uuid",
    "date": "2024-01-15",
    "availableSlots": [
      { "time": "09:00", "available": true },
      { "time": "09:30", "available": false },
      { "time": "10:00", "available": true }
    ]
  }
}
```

---

## Department Management

#### 1. Create Department
```http
POST /api/v1/departments
Authorization: Bearer {token} (Admin only)
Content-Type: application/json

Request Body:
{
  "name": "Cardiology",
  "description": "Heart and cardiovascular care"
}

Response: 201 Created
```

#### 2. Get All Departments
```http
GET /api/v1/departments
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cardiology",
      "description": "Heart and cardiovascular care",
      "doctorCount": 5
    }
  ]
}
```

#### 3. Update Department
```http
PUT /api/v1/departments/:id
Authorization: Bearer {token} (Admin only)

Response: 200 OK
```

#### 4. Delete Department
```http
DELETE /api/v1/departments/:id
Authorization: Bearer {token} (Admin only)

Response: 200 OK
```

---

## Appointment Management

#### 1. Create Appointment
```http
POST /api/v1/appointments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "doctorId": "uuid",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "reasonForVisit": "Regular checkup"
}

Response: 201 Created
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": "uuid",
    "appointmentNumber": "APT-2024-001",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:00",
    "status": "scheduled",
    "doctor": {...},
    "patient": {...}
  }
}
```

#### 2. Get Appointments
```http
GET /api/v1/appointments?status=scheduled&date=2024-01-15&page=1
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "appointments": [...],
    "pagination": {...}
  }
}
```

#### 3. Get Appointment Details
```http
GET /api/v1/appointments/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### 4. Update Appointment
```http
PUT /api/v1/appointments/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "status": "completed",
  "notes": "Patient examined, no issues found"
}

Response: 200 OK
```

#### 5. Cancel Appointment
```http
DELETE /api/v1/appointments/:id
Authorization: Bearer {token}

Response: 200 OK
```

---

## Medical Records

#### 1. Create Medical Record
```http
POST /api/v1/medical-records
Authorization: Bearer {token} (Doctor only)
Content-Type: application/json

Request Body:
{
  "patientId": "uuid",
  "appointmentId": "uuid",
  "chiefComplaint": "Chest pain",
  "diagnosis": "Mild angina",
  "symptoms": "Pain in chest, shortness of breath",
  "vitalSigns": {
    "bloodPressure": "120/80",
    "temperature": 98.6,
    "pulse": 72,
    "weight": 70,
    "height": 175
  },
  "treatmentPlan": "Medication and follow-up",
  "notes": "Patient advised rest"
}

Response: 201 Created
```

#### 2. Get Medical Records
```http
GET /api/v1/medical-records?patientId=uuid&page=1
Authorization: Bearer {token}

Response: 200 OK
```

#### 3. Get Medical Record Details
```http
GET /api/v1/medical-records/:id
Authorization: Bearer {token}

Response: 200 OK
```

---

## Prescription Management

#### 1. Create Prescription
```http
POST /api/v1/prescriptions
Authorization: Bearer {token} (Doctor only)
Content-Type: application/json

Request Body:
{
  "medicalRecordId": "uuid",
  "patientId": "uuid",
  "medications": [
    {
      "medicationName": "Aspirin",
      "dosage": "100mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take with food"
    }
  ]
}

Response: 201 Created
```

#### 2. Get Prescriptions
```http
GET /api/v1/prescriptions?patientId=uuid&page=1
Authorization: Bearer {token}

Response: 200 OK
```

---

## Billing & Payments

#### 1. Create Bill
```http
POST /api/v1/bills
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "patientId": "uuid",
  "appointmentId": "uuid",
  "totalAmount": 150.00,
  "description": "Consultation fee"
}

Response: 201 Created
```

#### 2. Get Bills
```http
GET /api/v1/bills?patientId=uuid&status=pending&page=1
Authorization: Bearer {token}

Response: 200 OK
```

#### 3. Update Bill / Record Payment
```http
PUT /api/v1/bills/:id/payment
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "paidAmount": 150.00,
  "paymentMethod": "card"
}

Response: 200 OK
```

---

## Dashboard & Analytics

#### 1. Admin Dashboard
```http
GET /api/v1/dashboard/admin
Authorization: Bearer {token} (Admin only)

Response: 200 OK
{
  "success": true,
  "data": {
    "totalPatients": 500,
    "totalDoctors": 50,
    "totalAppointments": 1200,
    "todayAppointments": 25,
    "revenue": {
      "today": 5000,
      "thisMonth": 150000
    },
    "recentAppointments": [...]
  }
}
```

#### 2. Doctor Dashboard
```http
GET /api/v1/dashboard/doctor
Authorization: Bearer {token} (Doctor only)

Response: 200 OK
{
  "success": true,
  "data": {
    "todayAppointments": 12,
    "upcomingAppointments": [...],
    "completedToday": 5,
    "pendingAppointments": 7
  }
}
```

#### 3. Patient Dashboard
```http
GET /api/v1/dashboard/patient
Authorization: Bearer {token} (Patient only)

Response: 200 OK
{
  "success": true,
  "data": {
    "upcomingAppointments": [...],
    "recentMedicalRecords": [...],
    "pendingBills": [...],
    "prescriptions": [...]
  }
}
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

---

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate entry)
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

## Security Headers

All API responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
