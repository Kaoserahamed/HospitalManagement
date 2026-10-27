# Database Design

## Technology
- MySQL 8
- SQLAlchemy 2.0 async ORM
- In-memory repositories for many modules

## Schema
- Core tables defined in `backend/models/` and `database/schema.sql`.
- Module-level models in `backend/modules/*/models.py`.
- Migrations under `database/migrations/` are currently placeholders.

## Key Entities
- User, Patient, Department, Appointment, Prescription, and 100+ domain entities.

## ER Diagram (Simplified)
```mermaid
erDiagram
  USER ||--o{ PATIENT : manages
  DEPARTMENT ||--o{ ROOM : contains
  PATIENT ||--o{ APPOINTMENT : books
  DOCTOR ||--o{ APPOINTMENT : attends
```

## Notes
- Many modules are not persisted to MySQL.
- Migration files are placeholders and require real Alembic migrations.
