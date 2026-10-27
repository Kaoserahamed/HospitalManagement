# Hospital Management System

A modular hospital management platform built with FastAPI, React, TypeScript, and MySQL. The repository contains a modular monolith backend, a feature-based React frontend, infrastructure manifests, and extensive documentation.

## Key Capabilities
- Patient, appointment, EHR, pharmacy, billing, insurance, staff, department, telemedicine, analytics, and 100+ additional domain modules.
- JWT authentication with role-based access control.
- In-memory and database-backed repositories depending on module.
- Frontend feature modules with React Query data fetching.
- Docker, Kubernetes, Helm, and Terraform assets.

## Technology Stack
- Backend: Python 3.11, FastAPI, SQLAlchemy 2.0 async, Pydantic v2, PyJWT, Argon2.
- Frontend: React 18, TypeScript, Vite, React Router v6, Axios, React Query.
- Database: MySQL 8.
- Infrastructure: Docker, Kubernetes, Helm, Terraform.
- Testing: pytest, Vitest.

## Quick Start

Backend:
```bash
cd backend
pip install -e ".[dev]"
cp ../.env.example .env
python init_tables.py
python seed_admin.py
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm ci
npm run dev
```

## Quality Commands
Backend:
```bash
cd backend
ruff check . && ruff format --check .
mypy core/
pytest tests/ -m "not integration" --cov --cov-fail-under=70
```

Frontend:
```bash
cd frontend
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

## Documentation
- [Project Overview](docs/01-project-overview.md)
- [System Architecture](docs/02-system-architecture.md)
- [Setup and Installation](docs/03-setup-and-installation.md)
- [Configuration](docs/04-configuration.md)
- [Database Design](docs/05-database-design.md)
- [API Reference](docs/06-api-reference.md)
- [Feature Documentation](docs/07-feature-documentation.md)
- [Authentication and Security](docs/08-authentication-and-security.md)
- [Testing](docs/09-testing.md)
- [Deployment and DevOps](docs/10-deployment-and-devops.md)
- [Troubleshooting](docs/11-troubleshooting.md)
- [Contribution Guide](docs/12-contribution-guide.md)
- [User Guide](docs/13-user-guide.md)

## Known Limitations
- Many backend modules are in-memory and not persisted.
- Database migrations are placeholder files.
- Frontend feature modules are registered but not all are linked to navigation.
- 111 integration tests are skipped without a live MySQL instance.

