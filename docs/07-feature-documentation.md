# Feature Documentation

## Implemented Features
- Patient management
- Appointments and scheduling
- EHR, pharmacy, billing, insurance
- Staff and departments
- Telemedicine, monitoring, analytics
- 100+ additional domain modules (see backend/modules)

## Feature Status
Many modules are CRUD scaffolds with in-memory storage. Domain-specific validation varies.

## Common Flow
1. Frontend calls API client.
2. React Query hooks manage state.
3. FastAPI route delegates to service.
4. Service delegates to repository.
5. Repository stores in memory or MySQL.
