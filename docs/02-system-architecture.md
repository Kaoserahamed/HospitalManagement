# System Architecture

## High-Level Architecture
Frontend (React/Vite) communicates with Backend (FastAPI) over REST/JSON. Backend uses SQLAlchemy async to MySQL. In-memory repositories are used by many modules.

## Entry Points
- Backend: `backend/main.py`
- Frontend: `frontend/src/main.tsx` (Vite entry)
- Config: `backend/core/config.py`

## Backend Modules
Each module under `backend/modules/<name>/` contains:
- `api.py`: FastAPI router under `/{name}` (or domain-specific prefix)
- `service.py`: business logic
- `repository.py`: in-memory data access
- `schemas.py`: Pydantic models
- `models.py`: SQLAlchemy models where applicable

## Frontend
Feature folders under `frontend/src/features/<name>/` contain types, API client, React Query hooks, and pages.

## Request Lifecycle
```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant A as FastAPI
  participant S as Service
  participant R as Repository
  participant D as MySQL
  U->>F: Action
  F->>A: HTTP request
  A->>S: Service call
  S->>R: Repository call
  R->>D: SQL (where persisted)
  D-->>R: Result
  R-->>S: Data
  S-->>A: Response
  A-->>F: JSON
  F-->>U: UI update
```

## Authentication
JWT tokens with issuer/audience validation and RBAC. Passwords hashed with Argon2.

## Deployment
Docker, Kubernetes, Helm, and Terraform assets are provided under `infra/`.
