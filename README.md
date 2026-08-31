# 🏥 Hospital Management System

A comprehensive web-based hospital management system built with modern technologies. This application streamlines hospital operations by managing patients, appointments, prescriptions, departments, and staff with role-based access control.

## ✨ Features

### 👨‍💼 Admin Dashboard
- **User Management**: Create and manage doctor and receptionist accounts
- **Department Management**: Add, update, and organize hospital departments
- **Doctor Assignment**: Assign doctors to specific departments
- **Schedule Management**: Create and manage doctor availability schedules

### 👨‍⚕️ Doctor Portal
- **Appointment Management**: View and manage scheduled appointments
- **Prescription Creation**: Create and issue prescriptions for patients
- **Patient History**: Access complete patient medical history
- **Appointment Status**: Update appointment status (completed, cancelled)

### 👤 Patient Portal
- **Self Registration**: Register new patient account with personal details
- **Appointment Booking**: Book appointments with available doctors
- **Appointment History**: View past and upcoming appointments
- **Prescription Access**: View and download prescription history

### 👩‍💼 Receptionist Portal
- **Patient Registration**: Register new patients into the system
- **Appointment Management**: Schedule and manage patient appointments
- **Patient Information**: Access patient details and records

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy 2.0
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens) with python-jose
- **Password Hashing**: pwdlib with Argon2
- **Async Database Driver**: asyncmy
- **API Documentation**: Auto-generated OpenAPI (Swagger)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS Modules

### Database
- **RDBMS**: MySQL 8.0+
- **Schema**: Complete relational schema with foreign keys
- **Tables**: Users, Patients, Departments, Doctors, Appointments, Schedules, Prescriptions

## 📋 Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18.0 or higher
- **MySQL**: 8.0 or higher
- **pip**: Latest version
- **npm**: Latest version

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HospitalManagement
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE hospital_db;
```

Run the schema setup:

```bash
mysql -u root -p hospital_db < database/complete_schema.sql
```

### 3. Backend Setup

Navigate to backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Configure environment variables in `.env`:

```env
DATABASE_URL=mysql+asyncmy://username:password@localhost/hospital_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Initialize database tables and seed admin user:

```bash
python init_tables.py
python seed_admin.py
```

Start the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 4. Frontend Setup

Navigate to frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Configure environment variables (create `.env` file):

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

**Default Admin Credentials:**
- Email: `admin@hospital.com`
- Password: `Admin@123`

## 📁 Project Structure

```
HospitalManagement/
├── backend/
│   ├── controllers/           # Request handlers
│   ├── services/             # Business logic layer
│   ├── repositories/         # Data access layer
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── routes/               # API route definitions
│   ├── dependencies/         # Dependency injection
│   ├── core/
│   │   ├── config.py        # Configuration management
│   │   ├── database.py      # Database connection
│   │   └── security.py      # Security utilities
│   ├── main.py              # FastAPI application
│   ├── init_tables.py       # Database initialization
│   ├── seed_admin.py        # Admin user seeding
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client modules
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (Auth)
│   │   ├── App.tsx          # Main application
│   │   └── main.tsx         # Entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   └── tsconfig.json        # TypeScript config
│
└── database/
    ├── complete_schema.sql   # Database schema
    └── migrations/           # Migration scripts
```

## 🔐 Authentication & Authorization

The system implements JWT-based authentication with role-based access control (RBAC):

- **Roles**: Admin, Doctor, Receptionist, Patient
- **Token Expiration**: Configurable (default: 60 minutes)
- **Password Security**: Argon2 hashing algorithm
- **Protected Routes**: All API endpoints require authentication

## 🗄️ Database Schema

### Core Tables
- **users**: Admin, doctor, and receptionist accounts
- **patients**: Patient information (separate from staff)
- **departments**: Hospital departments
- **doctor_profiles**: Doctor-specific information
- **doctor_schedules**: Doctor availability schedules
- **appointments**: Patient appointments
- **prescriptions**: Medical prescriptions

### Key Relationships
- Doctors belong to departments
- Appointments link patients with doctors
- Prescriptions are created by doctors for patients
- Schedules define doctor availability

## 🎯 API Endpoints

### Authentication
- `POST /auth/login` - User/Patient login
- `POST /auth/register-patient` - Patient self-registration
- `POST /auth/create-user` - Create staff user (Admin only)

### Departments
- `GET /departments` - List all departments
- `POST /departments` - Create department
- `PUT /departments/{id}` - Update department

### Appointments
- `GET /appointments` - List appointments (filtered by role)
- `POST /appointments` - Book appointment
- `PUT /appointments/{id}` - Update appointment

### Prescriptions
- `GET /prescriptions` - List prescriptions
- `POST /prescriptions` - Create prescription

### Schedules
- `GET /doctor-schedules` - List doctor schedules
- `POST /doctor-schedules` - Create schedule

Full API documentation available at: `http://localhost:8000/docs`

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql+asyncmy://root:password@localhost/hospital_db` |
| `SECRET_KEY` | JWT secret key | Random secure string |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `60` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## 📦 Dependencies

### Backend (Python)
- fastapi==0.115.0
- uvicorn[standard]==0.32.0
- sqlalchemy==2.0.36
- asyncmy==0.2.9
- pydantic==2.9.2
- pydantic-settings==2.6.1
- python-jose[cryptography]==3.3.0
- pwdlib[argon2]==0.2.1
- python-multipart==0.0.12

### Frontend (Node.js)
- react@^18.2.0
- react-router-dom@^6.20.0
- typescript@^5.3.3
- vite@^5.0.8
- axios@^1.6.2
- lucide-react@^0.294.0

## 🧪 Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

### Building for Production

Frontend build:
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

Backend runs as-is with production ASGI server (Uvicorn/Gunicorn)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.




