# Hospital Management System

A comprehensive Hospital Management System built with FastAPI and MySQL.


User Management:
1. Admin can create role(doctor, receptionist) based users. 
2. Role based login (Admin, doctor, receptionist). 

## Project Structure

```
HospitalManagement/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── core/            # Core configuration and utilities
│   ├── dependencies/    # Dependency injection
│   ├── models/          # SQLAlchemy models
│   ├── repositories/    # Database access layer
│   ├── routes/          # API route definitions
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── .env            # Environment variables
│   └── main.py         # Application entry point
├── database/
│   └── schema.sql      # Database schema
└── system design/      # System design documentation
```

## Setup

1. **Install Dependencies**
```bash
pip install fastapi uvicorn sqlalchemy aiomysql pydantic-settings python-jose pwdlib
```

2. **Configure Database**
- Update `backend/.env` with your MySQL credentials
- Run the SQL schema from `database/schema.sql`

3. **Run the Application**
```bash
cd D:\HospitalManagement
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get access token
- `GET /auth/me` - Get current user details
- `GET /auth/admin-only` - Admin-only endpoint (example)


## User Roles

- `admin` - System administrators
- `doctor` - Medical practitioners
- `patient` - Hospital patients
- `receptionist` - Front desk staff



