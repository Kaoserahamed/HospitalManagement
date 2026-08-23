# High-Level Architecture - Hospital Management System

## Architecture Overview

The Hospital Management System follows a **3-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│              (React Frontend - Browser)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
                     │ JSON
┌────────────────────┴────────────────────────────────────┐
│                  Application Layer                      │
│           (Node.js + Express.js Backend)                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │   API       │  │  Business    │  │ Authentication│   │
│  │   Routes    │─→│   Logic      │  │ & Auth        │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     │ Connection Pool
┌────────────────────┴────────────────────────────────────┐
│                    Data Layer                           │
│                 (MySQL Database)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  Users   │ │ Patients │ │ Doctors  │ │  Appts   │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. Frontend (Presentation Layer)
**Technology**: React + JavaScript

**Responsibilities**:
- User interface rendering
- User interaction handling
- Client-side validation
- State management
- API consumption
- Routing

**Key Components**:
- **Authentication Module**: Login, register, password reset
- **Patient Module**: Profile, appointments, medical records
- **Doctor Module**: Schedule, appointments, patient records
- **Admin Module**: User management, analytics, reports
- **Shared Components**: Layout, navigation, forms, tables

**Communication**:
- REST API calls to backend over HTTPS
- JWT token for authentication
- JSON data format

---

### 2. Backend (Application Layer)
**Technology**: Node.js + Express.js

**Responsibilities**:
- Business logic implementation
- API endpoint management
- Request validation
- Authentication & authorization
- Database operations
- Error handling
- Logging

**Key Components**:

#### a. API Layer
- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Middleware**: Authentication, validation, error handling

#### b. Business Logic Layer
- **Services**: Core business logic
- **Validators**: Input validation rules
- **Utilities**: Helper functions

#### c. Data Access Layer
- **Models**: Database schema representation
- **Repositories**: Database query abstraction
- **Database Connection**: Connection pooling

#### d. Security Layer
- **Authentication**: JWT token management
- **Authorization**: Role-based access control
- **Encryption**: Password hashing (bcrypt)

**Communication**:
- Receives HTTP/HTTPS requests from frontend
- Queries MySQL database
- Returns JSON responses

---

### 3. Database (Data Layer)
**Technology**: MySQL

**Responsibilities**:
- Data persistence
- Data integrity
- Transaction management
- Query optimization

**Key Features**:
- **Relational Schema**: Normalized database design
- **Indexes**: Optimized for common queries
- **Foreign Keys**: Referential integrity
- **Triggers**: Audit logging
- **Stored Procedures**: Complex operations

---

## Data Flow

### Example: Patient Books Appointment

```
1. User Action (Frontend)
   └─> Patient fills appointment form
       └─> Clicks "Book Appointment"

2. API Request (Frontend → Backend)
   └─> POST /api/v1/appointments
       └─> Headers: Authorization: Bearer {JWT}
       └─> Body: { doctorId, date, time, reason }

3. Backend Processing
   ├─> Authentication Middleware
   │   └─> Verify JWT token
   │   └─> Extract user info
   │
   ├─> Authorization Middleware
   │   └─> Check user role (patient)
   │
   ├─> Validation Middleware
   │   └─> Validate request data
   │
   ├─> Controller
   │   └─> Call appointment service
   │
   ├─> Service Layer
   │   ├─> Check doctor availability
   │   ├─> Check slot availability
   │   └─> Create appointment
   │
   └─> Repository Layer
       └─> Execute SQL INSERT

4. Database Transaction
   └─> Insert into appointments table
       └─> Update doctor schedule
       └─> Return appointment ID

5. Response (Backend → Frontend)
   └─> Status: 201 Created
       └─> Body: { success, data: {...} }

6. UI Update (Frontend)
   └─> Show success message
       └─> Redirect to appointment details
```

---

## Security Architecture

### Authentication Flow

```
┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │
└────┬─────┘                    └────┬─────┘
     │                               │
     │  POST /auth/login             │
     │  (email, password)            │
     ├──────────────────────────────>│
     │                               │
     │                          ┌────┴────┐
     │                          │ Verify  │
     │                          │Password │
     │                          └────┬────┘
     │                               │
     │                          ┌────┴────┐
     │                          │Generate │
     │                          │  JWT    │
     │                          └────┬────┘
     │                               │
     │  Response: { token, user }    │
     │<──────────────────────────────┤
     │                               │
     │  Store token in localStorage  │
     │                               │
     │  Subsequent requests:         │
     │  Authorization: Bearer {token}│
     ├──────────────────────────────>│
     │                               │
     │                          ┌────┴────┐
     │                          │ Verify  │
     │                          │  Token  │
     │                          └────┬────┘
     │                               │
     │  Protected resource           │
     │<──────────────────────────────┤
     │                               │
```

### Authorization Levels

1. **Public Routes**: No authentication required
   - `/auth/login`, `/auth/register`

2. **Authenticated Routes**: Valid JWT required
   - All `/api/v1/*` routes

3. **Role-Based Routes**:
   - **Patient**: Own profile, appointments, records
   - **Doctor**: Assigned patients, appointments, create records
   - **Admin**: All resources, user management, system config

---

## Scalability Considerations

### Horizontal Scaling

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐    ┌─────┴─────┐   ┌─────┴─────┐
    │ Backend   │    │ Backend   │   │ Backend   │
    │ Instance 1│    │ Instance 2│   │ Instance 3│
    └─────┬─────┘    └─────┬─────┘   └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────┴───────┐
                    │   MySQL      │
                    │   Primary    │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐    ┌─────┴─────┐   ┌─────┴─────┐
    │  Read     │    │  Read     │   │  Read     │
    │ Replica 1 │    │ Replica 2 │   │ Replica 3 │
    └───────────┘    └───────────┘   └───────────┘
```

**Key Points**:
- Stateless backend servers (JWT stored on client)
- Database connection pooling
- Read replicas for read-heavy operations
- Load balancer distributes traffic

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────┐
│                  Cloud Platform                     │
│               (AWS / Azure / GCP)                   │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │              CDN / CloudFront              │   │
│  │         (Static Assets, Frontend)          │   │
│  └────────────────────┬───────────────────────┘   │
│                       │                             │
│  ┌────────────────────┴───────────────────────┐   │
│  │          Application Load Balancer         │   │
│  └────────────────────┬───────────────────────┘   │
│                       │                             │
│  ┌────────────────────┴───────────────────────┐   │
│  │         Auto Scaling Group                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │   │
│  │  │ Backend  │  │ Backend  │  │ Backend  │ │   │
│  │  │ Server 1 │  │ Server 2 │  │ Server 3 │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘ │   │
│  └────────────────────┬───────────────────────┘   │
│                       │                             │
│  ┌────────────────────┴───────────────────────┐   │
│  │          RDS MySQL (Primary)               │   │
│  │          + Read Replicas                   │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────┐      ┌──────────────────┐   │
│  │   S3 Bucket     │      │  CloudWatch      │   │
│  │  (Backups/Logs) │      │  (Monitoring)    │   │
│  └─────────────────┘      └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack Summary

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **Routing**: React Router
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios
- **UI Library**: Material-UI / Bootstrap
- **Build Tool**: Vite / Create React App

### Backend
- **Runtime**: Node.js (LTS version)
- **Framework**: Express.js
- **Language**: JavaScript
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator / Joi
- **Database Client**: mysql2
- **Environment Config**: dotenv
- **Logging**: Winston / Morgan
- **Security**: helmet, cors

### Database
- **RDBMS**: MySQL 8.0+
- **Migration Tool**: Sequelize / Knex (optional)
- **Backup**: Automated daily backups

### DevOps
- **Version Control**: Git
- **Container**: Docker (optional)
- **CI/CD**: GitHub Actions / Jenkins
- **Monitoring**: PM2, CloudWatch
- **Testing**: Jest, Supertest

---

## Non-Functional Characteristics

### Performance
- API response time < 500ms
- Frontend initial load < 2s
- Database query optimization with indexes
- Connection pooling for database

### Security
- HTTPS/TLS encryption
- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention
- XSS protection

### Reliability
- Error handling and logging
- Database transactions
- Backup and recovery
- Health check endpoints

### Maintainability
- Modular code structure
- Clear separation of concerns
- Comprehensive documentation
- Code comments
- RESTful API design

---

## Integration Points

### External Systems (Future Extensions)
1. **Email Service**: SendGrid / AWS SES for notifications
2. **SMS Gateway**: Twilio for appointment reminders
3. **Payment Gateway**: Stripe / PayPal for billing
4. **Lab Systems**: Integration for test results
5. **Pharmacy Systems**: E-prescription integration
6. **Insurance Systems**: Claim processing
7. **Reporting Tools**: Business intelligence dashboards
