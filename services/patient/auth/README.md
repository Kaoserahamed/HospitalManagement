# HospitalManagement Authentication Module

## Overview
Authentication system for doctor/nurse/patient/admin/pharmacist roles with OAuth2, JWT, and MFA (HIPAA-compliant).

## Files
- `services/patient/auth.py` - Authentication logic
- `services/patient/models.py` - User and role models
- `services/patient/middleware.py` - Auth middleware and RBAC
- `services/patient/routes/auth.py` - Auth API routes
- `services/patient/mfa.py` - Multi-factor authentication
- `services/patient/audit.py` - HIPAA audit logging

## Features
- Doctor, nurse, patient, admin, and pharmacist account registration/login
- JWT-based session management
- OAuth2 provider integration
- Role-Based Access Control (RBAC)
- Multi-factor authentication (MFA)
- Password hashing with bcrypt
- Session timeout handling
- HIPAA-compliant audit logging for PHI access
- Break-glass access for emergencies

## Tech Stack
- Python/FastAPI
- MySQL (encrypted)
- JWT (PyJWT)
- OAuth2
- bcrypt for password hashing
- Field-level encryption for PHI

## Day 5 Outcome
Authentication module implemented. 1 PR created targeting development.