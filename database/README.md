# Database Schema

## Quick Setup

Use the complete schema file for a fresh installation:

```bash
mysql -u root -p < database/complete_schema.sql
```

This creates all tables and seeds the admin user.

## Database Structure

### Staff Management (users table)
- **users** - Staff only (admin, doctor, receptionist)
  - Authentication via email/password
  - Roles: admin, doctor, receptionist

### Patient Management (patients table)
- **patients** - Separate from staff
  - Authentication via NID + Phone (no email/password)
  - Medical information included

### Clinical Management
- **departments** - Hospital departments
- **doctor_profiles** - Links doctors to departments
- **doctor_schedules** - Doctor working hours and time slots
- **appointments** - Links patients to doctors

## Key Design Decisions

1. **Separated Patients from Staff** - Patients have their own table with NID/phone auth
2. **Doctor Schedules** - Enables appointment availability checking
3. **Soft Deletes** - Uses `is_active` flags instead of hard deletes
4. **UUIDs** - All primary keys use UUID for better distribution

## Default Credentials

- **Admin**: admin@hospital.com / Admin@123

## Migrations

Individual migrations are in `/database/migrations/` folder:
- `002_departments_and_doctors.sql`
- `003_appointments.sql`
- `006_separate_patients_simple.sql`

Run migrations only if you need incremental updates on an existing database.
