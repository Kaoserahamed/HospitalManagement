# Day 3 CI/CD: Build / Test / Deploy Pipeline

## Repository
`HospitalManagement` — Hospital Management System (FastAPI + React + MySQL)

## Pipeline Overview
GitHub Actions CI/CD for FastAPI + React application.

### Trigger
- Push/Pull Request to `main`
- Manual workflow dispatch

### Stages

#### 1. Lint & Format
- Backend: Ruff/Black (Python)
- Frontend: ESLint + Prettier (TypeScript/React)

#### 2. Typecheck
- Backend: `mypy` (Python strict mode)
- Frontend: `tsc --noEmit` (TypeScript)

#### 3. Test
- Backend: `pytest` (unit + integration)
- Frontend: `npm test` (Vitest)
- Coverage: pytest-cov + frontend coverage

#### 4. Build
- Backend: Docker image (`Dockerfile` in backend/)
- Frontend: `npm run build` (Vite production build)
- Multi-arch Docker images

#### 5. Security Scan
- `pip audit` / `safety` (Python dependencies)
- `npm audit` (frontend dependencies)
- Secret detection (no database URLs, no JWT secrets, no API keys)
- HIPAA-relevant: no PHI in test data

#### 6. Deploy (on merge to `main`)
- Build and push Docker images
- Deploy with `docker-compose up -d` (MySQL + backend + frontend)
- Run database schema: `mysql -u root -p hospital_db < database/complete_schema.sql`
- Initialize tables: `python init_tables.py`
- Seed admin: `python seed_admin.py`
- Health check: `GET /docs` (Swagger UI)

### Quality Gates
- All tests pass (backend + frontend)
- TypeScript strict mode clean
- `mypy` clean
- No secrets committed
- Build succeeds

### Artifacts
- Docker images (backend + frontend)
- Test reports
- Coverage reports
- Deployment URL

## Day 3 Outcome
CI/CD pipeline documented. No code changes. 0 PRs. Ready for Day 4 (project restructuring).
<!-- Feature branch commit for PR -->
