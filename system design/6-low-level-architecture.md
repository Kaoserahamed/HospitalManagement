# Low-Level Architecture - Hospital Management System

## Backend Architecture (Node.js + Express)

### Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Database connection configuration
│   │   ├── auth.js              # JWT configuration
│   │   └── constants.js         # Application constants
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── rbac.middleware.js   # Role-based access control
│   │   ├── validate.middleware.js # Request validation
│   │   ├── error.middleware.js  # Global error handler
│   │   └── logger.middleware.js # Request logging
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── patient.model.js
│   │   ├── doctor.model.js
│   │   ├── department.model.js
│   │   ├── appointment.model.js
│   │   ├── medicalRecord.model.js
│   │   ├── prescription.model.js
│   │   └── bill.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── doctor.controller.js
│   │   ├── department.controller.js
│   │   ├── appointment.controller.js
│   │   ├── medicalRecord.controller.js
│   │   ├── prescription.controller.js
│   │   ├── bill.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── patient.service.js
│   │   ├── doctor.service.js
│   │   ├── appointment.service.js
│   │   ├── medicalRecord.service.js
│   │   ├── prescription.service.js
│   │   └── bill.service.js
│   │
│   ├── routes/
│   │   ├── index.js             # Main router
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── doctor.routes.js
│   │   ├── department.routes.js
│   │   ├── appointment.routes.js
│   │   ├── medicalRecord.routes.js
│   │   ├── prescription.routes.js
│   │   ├── bill.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── patient.validator.js
│   │   ├── doctor.validator.js
│   │   ├── appointment.validator.js
│   │   └── common.validator.js
│   │
│   ├── utils/
│   │   ├── response.util.js     # Standard API responses
│   │   ├── token.util.js        # JWT utilities
│   │   ├── hash.util.js         # Password hashing
│   │   ├── date.util.js         # Date utilities
│   │   └── logger.util.js       # Winston logger
│   │
│   └── app.js                   # Express app setup
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env                         # Environment variables
├── .env.example
├── package.json
├── server.js                    # Entry point
└── README.md
```

---

## Component Details

### 1. Configuration Layer (`config/`)

#### database.js
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

#### auth.js
```javascript
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '24h',
  bcryptSaltRounds: 10
};
```

---

### 2. Middleware Layer (`middleware/`)

#### auth.middleware.js
- Verify JWT token from request header
- Extract user information
- Attach user to request object

#### rbac.middleware.js
- Check user role permissions
- Authorize access to resources
- Implement role-based rules (admin, doctor, patient)

#### validate.middleware.js
- Validate request body/params/query
- Return validation errors
- Use express-validator

#### error.middleware.js
- Catch all errors
- Format error responses
- Log errors
- Return appropriate HTTP status codes

---

### 3. Model Layer (`models/`)

**Purpose**: Database schema representation and query methods

#### Example: user.model.js
```javascript
class User {
  static async create(userData) {
    const query = `INSERT INTO users (...) VALUES (...)`;
    const [result] = await pool.execute(query, [values]);
    return result;
  }
  
  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
  
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }
  
  static async update(id, data) {
    // Update logic
  }
}
```

---

### 4. Controller Layer (`controllers/`)

**Purpose**: Handle HTTP requests and responses

#### Example: appointment.controller.js
```javascript
class AppointmentController {
  async createAppointment(req, res, next) {
    try {
      const appointmentData = req.body;
      const userId = req.user.id;
      
      const appointment = await appointmentService.create(
        userId, 
        appointmentData
      );
      
      return res.status(201).json({
        success: true,
        message: 'Appointment created',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getAppointments(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      const appointments = await appointmentService.getAll(
        userId, 
        userRole, 
        { page, limit, status }
      );
      
      return res.status(200).json({
        success: true,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

### 5. Service Layer (`services/`)

**Purpose**: Business logic implementation

#### Example: appointment.service.js
```javascript
class AppointmentService {
  async create(userId, appointmentData) {
    // 1. Get patient ID from userId
    const patient = await Patient.findByUserId(userId);
    
    // 2. Check doctor availability
    const isAvailable = await this.checkDoctorAvailability(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.time
    );
    
    if (!isAvailable) {
      throw new Error('Doctor not available at this time');
    }
    
    // 3. Create appointment
    const appointmentNumber = await this.generateAppointmentNumber();
    
    const appointment = await Appointment.create({
      appointmentNumber,
      patientId: patient.id,
      ...appointmentData,
      status: 'scheduled'
    });
    
    return appointment;
  }
  
  async checkDoctorAvailability(doctorId, date, time) {
    // Check doctor schedule
    // Check existing appointments
    // Return boolean
  }
  
  async getAll(userId, userRole, filters) {
    if (userRole === 'patient') {
      const patient = await Patient.findByUserId(userId);
      return Appointment.findByPatientId(patient.id, filters);
    }
    
    if (userRole === 'doctor') {
      const doctor = await Doctor.findByUserId(userId);
      return Appointment.findByDoctorId(doctor.id, filters);
    }
    
    if (userRole === 'admin') {
      return Appointment.findAll(filters);
    }
  }
}
```

---

### 6. Route Layer (`routes/`)

**Purpose**: Define API endpoints and apply middleware

#### Example: appointment.routes.js
```javascript
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validateAppointment } = require('../validators/appointment.validator');

// Create appointment (patients only)
router.post('/',
  authenticate,
  authorize(['patient']),
  validateAppointment,
  appointmentController.createAppointment
);

// Get appointments (all authenticated users)
router.get('/',
  authenticate,
  appointmentController.getAppointments
);

// Get appointment by ID
router.get('/:id',
  authenticate,
  appointmentController.getAppointmentById
);

// Update appointment
router.put('/:id',
  authenticate,
  authorize(['doctor', 'admin']),
  appointmentController.updateAppointment
);

// Cancel appointment
router.delete('/:id',
  authenticate,
  appointmentController.cancelAppointment
);

module.exports = router;
```

---

### 7. Validator Layer (`validators/`)

**Purpose**: Input validation using express-validator

#### Example: appointment.validator.js
```javascript
const { body, query } = require('express-validator');

const validateAppointment = [
  body('doctorId')
    .notEmpty().withMessage('Doctor ID is required')
    .isUUID().withMessage('Invalid doctor ID'),
  
  body('appointmentDate')
    .notEmpty().withMessage('Date is required')
    .isDate().withMessage('Invalid date format'),
  
  body('appointmentTime')
    .notEmpty().withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format'),
  
  body('reasonForVisit')
    .optional()
    .isLength({ max: 500 })
];

module.exports = { validateAppointment };
```

---

### 8. Utility Layer (`utils/`)

#### response.util.js
```javascript
class ResponseUtil {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  
  static error(res, message, statusCode = 500, error = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error
    });
  }
}
```

#### token.util.js
```javascript
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

class TokenUtil {
  static generate(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  }
  
  static verify(token) {
    return jwt.verify(token, jwtSecret);
  }
}
```

---

## Frontend Architecture (React + JavaScript)

### Directory Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── api/
│   │   ├── axios.config.js      # Axios instance with interceptors
│   │   ├── auth.api.js
│   │   ├── patient.api.js
│   │   ├── doctor.api.js
│   │   ├── appointment.api.js
│   │   ├── medicalRecord.api.js
│   │   └── dashboard.api.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Alert.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── patient/
│   │   │   ├── PatientProfile.jsx
│   │   │   ├── PatientList.jsx
│   │   │   └── PatientForm.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── DoctorList.jsx
│   │   │   └── DoctorProfile.jsx
│   │   │
│   │   ├── appointment/
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── AppointmentList.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   └── TimeSlotPicker.jsx
│   │   │
│   │   └── dashboard/
│   │       ├── AdminDashboard.jsx
│   │       ├── DoctorDashboard.jsx
│   │       └── PatientDashboard.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── AppContext.jsx      # Global app state
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useForm.js
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── patient/
│   │   │   ├── PatientProfilePage.jsx
│   │   │   ├── PatientListPage.jsx
│   │   │   └── MedicalRecordsPage.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorListPage.jsx
│   │   │   └── DoctorProfilePage.jsx
│   │   │
│   │   ├── appointment/
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── AppointmentListPage.jsx
│   │   │   └── AppointmentDetailsPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   └── NotFoundPage.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx        # React Router configuration
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── storage.js           # localStorage utilities
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   └── index.jsx
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Frontend Component Details

### 1. API Layer (`api/`)

#### axios.config.js
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### appointment.api.js
```javascript
import api from './axios.config';

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`)
};
```

---

### 2. Context Layer (`context/`)

#### AuthContext.jsx
```javascript
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 3. Custom Hooks (`hooks/`)

#### useAuth.js
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### useApi.js
```javascript
import { useState, useEffect } from 'react';

export const useApi = (apiFunc, params = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunc(params);
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
```

---

### 4. Routing (`routes/`)

#### AppRoutes.jsx
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentListPage from '../pages/appointment/AppointmentListPage';
import BookAppointmentPage from '../pages/appointment/BookAppointmentPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppointmentListPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments/book" element={
          <ProtectedRoute roles={['patient']}>
            <BookAppointmentPage />
          </ProtectedRoute>
        } />

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
```

---

## Request Flow Example

### Complete flow for "Book Appointment"

```
1. USER ACTION (Frontend)
   └─> User fills form in BookAppointmentPage.jsx
       └─> Clicks "Book Appointment" button

2. COMPONENT HANDLER
   └─> handleSubmit() in BookAppointmentPage.jsx
       └─> Calls appointmentAPI.create(formData)

3. API CALL
   └─> api/appointment.api.js
       └─> POST /api/v1/appointments
           └─> Interceptor adds JWT token to headers

4. BACKEND RECEIVES REQUEST
   └─> Express app
       └─> routes/appointment.routes.js
           └─> Middleware chain:
               a) authenticate (verify JWT)
               b) authorize(['patient'])
               c) validateAppointment
               d) appointmentController.createAppointment

5. CONTROLLER LAYER
   └─> controllers/appointment.controller.js
       └─> Extract data from req.body and req.user
       └─> Call appointmentService.create()

6. SERVICE LAYER (Business Logic)
   └─> services/appointment.service.js
       a) Get patient from userId
       b) Check doctor availability
       c) Generate appointment number
       d) Call model to save appointment

7. MODEL LAYER
   └─> models/appointment.model.js
       └─> Execute SQL INSERT query
       └─> Return created appointment

8. DATABASE
   └─> MySQL executes query
       └─> Returns inserted record with ID

9. RESPONSE BACK UP THE CHAIN
   Service → Controller → Express → Frontend

10. FRONTEND HANDLES RESPONSE
    └─> appointmentAPI.create() returns response
        └─> Component updates state
        └─> Show success message
        └─> Redirect to appointment list
```

---

## Security Implementation Details

### Password Hashing Flow

```
Registration:
User password → bcrypt.hash() → Hashed password → Store in DB

Login:
User password → bcrypt.compare(input, stored hash) → Boolean
```

### JWT Authentication Flow

```
Login Success:
User data → jwt.sign() → JWT token → Send to client

Client Storage:
JWT token → localStorage.setItem('token', jwt)

Subsequent Requests:
localStorage.getItem('token') → Add to headers → Verify on server
```

---

## Database Connection Pooling

```javascript
// config/database.js
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hospital_db',
  waitForConnections: true,
  connectionLimit: 10,        // Max connections
  queueLimit: 0,              // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Usage in models
const [rows] = await pool.execute(query, params);
// Connection automatically returned to pool
```

---

## Error Handling Strategy

### Backend Error Handling

```javascript
// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl}`);
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Frontend Error Handling

```javascript
// In components
try {
  const response = await appointmentAPI.create(data);
  // Success handling
} catch (error) {
  const errorMessage = error.response?.data?.message || 'An error occurred';
  setError(errorMessage);
  // Show error notification to user
}
```

---

## Performance Optimizations

### Backend
1. **Database Indexing**: Index frequently queried columns
2. **Query Optimization**: Use JOIN efficiently, avoid N+1 queries
3. **Connection Pooling**: Reuse database connections
4. **Caching**: Cache frequently accessed data (Redis optional)
5. **Pagination**: Limit query results
6. **Async Operations**: Non-blocking I/O with async/await

### Frontend
1. **Code Splitting**: Lazy load routes and components
2. **Memoization**: Use React.memo for expensive components
3. **Debouncing**: For search inputs
4. **Virtual Scrolling**: For large lists
5. **Image Optimization**: Compress and lazy load images

---

## Testing Strategy

### Backend Testing
```javascript
// Unit Test Example (Jest + Supertest)
describe('Appointment API', () => {
  test('POST /appointments - should create appointment', async () => {
    const response = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        doctorId: 'uuid',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00',
        reasonForVisit: 'Checkup'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('appointmentNumber');
  });
});
```

### Frontend Testing
```javascript
// Component Test Example (Jest + React Testing Library)
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('submits login form', async () => {
  const mockLogin = jest.fn();
  render(<LoginForm onSubmit={mockLogin} />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText(/login/i));
  
  expect(mockLogin).toHaveBeenCalled();
});
```

---

## Logging Strategy

```javascript
// utils/logger.util.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

**Log Levels**:
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `debug`: Debug-level messages

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=hospital_db

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

LOG_LEVEL=info
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
```

---

## Deployment Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Enable rate limiting
- [ ] Secure environment variables

### Frontend
- [ ] Build optimized production bundle
- [ ] Enable compression
- [ ] Configure CDN
- [ ] Set proper API URL
- [ ] Enable HTTPS
- [ ] Configure security headers

---

This low-level architecture provides a solid foundation for building a production-grade hospital management system with clear separation of concerns, security best practices, and scalability considerations.
