# Hospital Management System

A modular, production-grade hospital management platform built with FastAPI, React, and MySQL.
This repository follows the strategic roadmap in `STRATEGIC_ENGINEERING_ROADMAP.md`.

## Status

Phase 0 — Governance and baseline complete. Phase 1 (modular architecture) in progress.

## Architecture

- **Backend**: FastAPI, SQLAlchemy 2.0 (async), MySQL 8, Pydantic v2, JWT (Argon2).
- **Frontend**: React 18, TypeScript, Vite, React Router v6, Axios.
- **Modules (target)**: patient, appointment, EHR, pharmacy, billing, staff, department, schedule,
  telemedicine, analytics.

See `docs/adr/` for architecture decision records.

## Repository Layout

```
backend/        FastAPI backend (modular monolith target)
frontend/       React + TypeScript frontend
database/       Schema and migrations
docs/           Architecture, ADRs, audit, metrics, runbooks
scripts/        Developer tooling
.github/        CI workflows and templates
```

## Getting Started

### Prerequisites

- Python 3.11
- Node.js 18 (see `.nvmrc`)
- MySQL 8.0

### Backend

```bash
cd backend
pip install -e ".[dev]"
cp ../.env.example .env
python init_tables.py
python seed_admin.py
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

API docs: http://localhost:8000/docs

## Quality Gates

```bash
cd backend
ruff check . && ruff format --check .
mypy core/
pytest tests/ -m "not integration" --cov --cov-fail-under=70
```

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```

## Documentation

- `STRATEGIC_ENGINEERING_ROADMAP.md` — phased plan and metrics targets.
- `docs/adr/` — architecture decision records.
- `docs/engineering-audit.md` — technical debt inventory.
- `CONTRIBUTING.md` — contribution guidelines.
- `SECURITY.md` — security policy and reporting.

## Governance

- Code owners: see `CODEOWNERS`.
- Pre-commit hooks: `pre-commit install`.
- Conventional commits; see `CONTRIBUTING.md`.

## License

MIT
