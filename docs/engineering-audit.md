# Engineering Audit — Hospital Management System

**Date:** 2026-09-20 · **Commit audited:** `f066675` (main) · **Auditor:** Lead Engineer

This document records the state of the repository before the modernization effort,
identifies strengths, weaknesses, technical debt, security risks, CI/CD and
infrastructure gaps, and defines the prioritized roadmap that the rest of the
work in this repository follows.

---

## 1. Current Architecture

### 1.1 Repository layout (as audited)

```
HospitalManagement/
├── README.md                 # Feature/stack overview (pre-modernization)
├── SYSTEM_DESIGN.md          # Functional requirements + ER overview
├── .env.example              # Documented env vars (safe, tracked)
├── backend/                  # FastAPI application (Vercel serverless target)
│   ├── main.py               # App factory-less module; routers + CORS
│   ├── api/index.py          # Mangum wrapper for Vercel/Lambda
│   ├── routes/               # HTTP layer (6 routers)
│   ├── controllers/          # Request/response orchestration
│   ├── services/             # Business rules + validation
│   ├── repositories/         # SQLAlchemy data access
│   ├── models/               # SQLAlchemy 2.0 declarative models
│   ├── schemas/              # Pydantic v2 request/response models
│   ├── dependencies/         # FastAPI DI wiring + auth guards
│   ├── core/                 # config, database (async engine), security (JWT/Argon2)
│   ├── init_tables.py        # create_all() bootstrap (not versioned)
│   ├── seed_admin.py         # Imperative admin seed script
│   └── requirements.txt      # 11 pinned direct dependencies
├── frontend/                 # React 18 + TypeScript + Vite SPA
│   └── src/
│       ├── api/              # axios instance + per-domain API modules
│       ├── context/          # AuthContext (localStorage JWT)
│       ├── components/       # 7 modal/table components
│       ├── pages/            # 9 page components
│       └── types/            # Single types module (4 interfaces)
└── database/
    ├── complete_schema.sql   # Full DDL + seed admin (bcrypt hash!)
    ├── migrations/           # EMPTY directory
    └── README.md             # Schema documentation
```

### 1.2 Backend layering

Request flow: `routes → dependencies (auth guards) → controllers → services → repositories → models`.

- **routes/** define endpoints, response models, and role requirements.
- **dependencies/auth.py** implements dual authentication:
  - Staff (`users` table): email + password → JWT `type=staff`, roles `admin|doctor|receptionist`.
  - Patients (`patients` table): NID + phone → JWT `type=patient` (no password).
  - `require_roles(*roles)` factory for RBAC.
- **services/** contain business rules (doctor availability validation,
  appointment conflict checks, prescription ownership checks).
- **repositories/** encapsulate SQLAlchemy queries; appointments use
  `selectinload` to avoid N+1 on list endpoints.

### 1.3 Frontend structure

- `App.tsx` holds routing + role-based redirects; `ProtectedRoute` enforces
  client-side role gating; `AuthContext` stores JWT + `auth_type` in
  `localStorage` and re-fetches the profile on load.
- Per-domain API modules (`api/auth.ts`, `api/appointment.ts`, …) wrap axios.
- Pages mix data fetching, layout, navigation, and presentation
  (see §3.2).

### 1.4 Database

MySQL 8 schema with 7 tables: `users`, `patients`, `departments`,
`doctor_profiles`, `doctor_schedules`, `appointments`, `prescriptions`.
UUID `CHAR(36)` PKs, FKs with `CASCADE`/`RESTRICT`/`SET NULL`, indexes on all
FKs plus domain-specific composite indexes
(`doctor_id+appointment_date`, `patient_id+appointment_date`).
Schema management is **not versioned**: `database/complete_schema.sql` for fresh
installs, `backend/init_tables.py` (`create_all`) as an alternative — no Alembic,
no migration history, `database/migrations/` is empty.

### 1.5 Deployment posture (pre-modernization)

Backend deployed as a Vercel serverless function (Mangum/Lambda) with a
hardcoded pool of `pool_size=1, max_overflow=0`; frontend deployed as a static
Vercel build. Hardcoded CORS origins point at two Vercel URLs. There is no
container, Kubernetes, or IaC story.



---

## 2. Strengths

1. **Consistent layering.** Route → controller → service → repository is applied
   uniformly across all six domains; responsibilities are reasonably separated.
2. **Modern stack choices.** SQLAlchemy 2.0 typed `Mapped[]` models, Pydantic v2,
   async driver (`asyncmy`), Argon2 hashing via `pwdlib.recommended()`.
3. **N+1 awareness.** Appointment repositories preload relationships with
   `selectinload`.
4. **Business-rule validation in services.** Doctor availability per
   day/time-window, doctor↔department consistency, appointment conflict
   checking, prescription ownership (doctor can only mutate own prescriptions).
5. **Schema discipline.** FKs everywhere with deliberate delete semantics,
   unique constraints on natural keys (`users.email`, `patients.nid`,
   `patients.phone`, `departments.name`), composite indexes for hot queries.
6. **Pydantic input validation.** Future-date enforcement on appointments,
   NID/phone normalization, DOB plausibility (0–150 years).
7. **Dual auth separation.** Patients are fully segregated from staff
   identities; tokens carry a `type` claim checked by both guards.

---

## 3. Weaknesses & Technical Debt

### 3.1 Configuration & runtime

- `core/config.Settings()` is instantiated at **import time** with no defaults
  and no environment differentiation; any missing variable crashes the process
  before an actionable error can be produced.
- `ALGORITHM` is a free-form env string (an operator typo silently weakens
  token signing); no `ENVIRONMENT`, `CORS_ORIGINS`, or pool-size settings.
- Hardcoded CORS origins in `main.py` (two Vercel URLs + localhost); history
  includes a commit enabling `allow_origins=["*"]`.

### 3.2 Frontend

- **Oversized, coupled pages.** `Dashboard.tsx` (~290 lines) mixes data
  fetching, inline-styled navigation, table columns, and business logic.
  The doctor/receptionist/patient dashboards follow the same pattern.
- **Untyped/unreliable seams.** `authAPI.getCurrentPatient()` fabricates
  `{ role: 'patient', email: '' }` to satisfy the `User` type; `DataTable`
  column renderers use `any`; `Login.tsx` catches `err: any`.
- **Duplicated logic.** Role→dashboard path mapping repeated in `App.tsx` and
  `Login.tsx`; user table column definitions duplicated inline.
- **No shared loading/empty/error components;** errors surface via
  `console.error` or raw `alert`.
- **No linting/format/testing toolchain** (no ESLint, Prettier, Vitest,
  React Testing Library), no frontend lockfile guarantee in CI.

### 3.3 Backend consistency

- **Enum drift.** `UserRole.PATIENT` exists in the Python model but the SQL
  `ENUM('admin','doctor','receptionist')` excludes it — schema and code disagree.
- **Type drift.** `Prescription` uses `CHAR(36)` keys while every other model
  uses `String(36)`; harmless but inconsistent.
- **Fabricated response fields.** `AppointmentWithDetails.patient_email=""`
  placeholder — the contract models a field that cannot exist.
- **No pagination.** `get_all()` endpoints return unbounded lists (appointments,
  patients, users, schedules).
- **No transaction-boundary discipline.** Repositories commit internally;
  services cannot compose multi-repository writes atomically.
- **No request correlation IDs, structured logging, or standardized error
  envelope** (errors are ad-hoc `HTTPException.detail` strings).
- **No idempotency** on retryable writes (appointment booking can double-book
  on client retry despite the check-then-insert race).

### 3.4 Database engineering

- **No versioned migrations.** `create_all()` cannot express column changes,
  backfills, or data migrations; `database/migrations/` is empty.
- **Race condition on booking.** Conflict check is read-then-write with no DB
  constraint; two concurrent bookings for the same doctor/date/time both succeed.
- **Seed-data defect.** `complete_schema.sql` seeds the admin with a **bcrypt**
  hash (`$2b$12$…`) while the app hashes with **Argon2**; the seeded admin
  cannot log in (the password check fails against the wrong algorithm).
  `seed_admin.py` works around this but duplicates credentials in code.
- `medications` stored as a `TEXT` JSON blob with no DB-level validation.

### 3.5 Reproducibility

- Backend: `requirements.txt` pins direct dependencies only — no lockfile with
  transitive versions/hashes; no `pyproject.toml`; no declared Python version.
- Frontend: `package-lock.json` exists locally but there is no CI guarantee and
  no pinned Node version (`.nvmrc` absent).
- No formatting/lint/type-check configuration for either stack.



---

## 4. Missing Tests

The repository contains **zero automated tests**:

| Layer | Status |
|---|---|
| Backend unit (services, auth rules, validators) | Missing |
| Backend API/contract (FastAPI TestClient, schema contracts) | Missing |
| Repository tests (DB-backed) | Missing |
| Integration (ephemeral MySQL) | Missing |
| Frontend component tests | Missing |
| E2E (login, role access, booking, prescriptions) | Missing |
| Security tests (cross-role access, invalid/expired JWT) | Missing |
| Migration/schema integrity tests | Missing |

Coverage cannot be measured; there is no coverage floor.

---

## 5. Security Risks

Ranked by severity:

1. **Patient authentication has no secret.** Patients authenticate with
   **NID + phone number only** (`/auth/patients/login`); both values are
   semi-public identifiers with no password or second factor. Anyone who learns
   a patient's NID and phone gains full access to their PHI (appointments,
   prescriptions, medical history). *Highest-risk finding.*
2. **Object-level authorization gaps.**
   - `GET /appointments/{id}`: any authenticated user (any role) can read any
     appointment by ID.
   - `GET /prescriptions/{id}`: any staff user can read any prescription.
   - `GET /patients/{id}`: any doctor can read any patient regardless of
     care relationship.
   - `GET /prescriptions/patient/{patient_id}`: receptionists can enumerate
     any patient's prescriptions.
3. **JWT hygiene.** `python-jose` is deprecated with known CVEs; no `iss`/`aud`
   claims, no refresh/revocation story, 60-minute tokens, algorithm taken from
   env (misconfiguration risk), no rate limiting on token endpoints.
4. **Hardcoded demo credentials** (`admin@hospital.com` / `Admin@123`) in the
   login page UI, `SYSTEM_DESIGN.md`, `seed_admin.py`, and the SQL seed — a
   built-in publicly documented privileged account.
5. **No brute-force protection** on `/auth/login` or `/auth/patients/login`;
   NID/phone login additionally acts as a credential oracle.
6. **CORS posture.** Origins hardcoded in code; project history shows
   `allow_origins=["*"]` with `allow_credentials=True` (dangerous combination).
7. **Weak password policy.** Six-character minimum only enforced on password
   change — **not** on admin-created users (`UserCreate.password` unvalidated).
8. **Information disclosure.** Duplicate-resource errors ("NID already
   registered") enable enumeration; no generic error envelope.
9. **No dependency scanning, secret scanning, or SAST** anywhere in CI.
   Local `.env`/`.env.local` files contain live Railway DB credentials and a
   Vercel OIDC token; they are correctly **untracked** by git (verified via
   `git ls-files`), but nothing in CI would catch a future leak.
10. **No security headers** (HSTS, CSP, X-Content-Type-Options) at any layer.

---

## 6. CI/CD Gaps

- **No GitHub Actions workflows at all** (no `.github/` directory).
- Nothing runs on PR: no formatting, linting, type checks, tests, coverage,
  dependency audit, secret scan, SAST, or image builds.
- No artifact publication, no environments, no deployment gates, no approval
  flow, no rollback procedure, no immutable image tags.

---

## 7. Infrastructure Gaps

- No `Dockerfile` for either stack (backend currently targets Vercel serverless).
- No `.dockerignore`, no container vulnerability scanning.
- No `docker-compose` for reproducible local/CI integration testing.
- No Kubernetes manifests (namespace, deployments, services, probes, HPA, PDB,
  NetworkPolicy, RBAC, SecurityContext).
- No Terraform/IaC (no `infra/terraform/`, no pinned providers, no lockfile).
- No observability: no metrics endpoint, no tracing, no structured logs, no
  health/readiness endpoints beyond a static `/health` JSON.

---

## 8. Documentation Gaps

- Existing docs (`README.md`, `SYSTEM_DESIGN.md`) describe features but not
  operations: no supported Python/Node versions, no CI command reference,
  no environment-variable contract, no security model, no threat model.
- Missing governance files: `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`,
  `CODEOWNERS`, PR/issue templates, `.editorconfig`.
- Missing engineering docs: architecture, configuration, API, database,
  testing, CI/CD, Kubernetes, Terraform, observability, SLOs, disaster
  recovery, deployment, and operational runbooks.



---

## 9. Prioritized Implementation Roadmap

Ordered to deliver risk reduction and verification capability first while
preserving existing behavior.

| # | Phase | Deliverables | Rationale |
|---|---|---|---|
| 1 | **Repository foundation** | README/CONTRIBUTING/SECURITY/CHANGELOG/CODEOWNERS, PR+issue templates, `.editorconfig`, ruff/black/mypy + ESLint/Prettier configs, `.python-version`/`.nvmrc`, lockfiles, `pyproject.toml` | Everything downstream depends on reproducible, governed tooling |
| 2 | **Backend quality** | Validated settings, structured logging + correlation IDs, standardized error envelope + handlers, pagination, transaction boundaries, idempotency keys for booking — each with tests | Highest code-quality leverage; fixes config fragility and unbounded lists |
| 3 | **Database engineering** | Alembic baseline + versioned migrations, DB-level uniqueness for booking slots (race fix), schema integrity tests, ephemeral-MySQL integration tests | Correctness and data-integrity foundations |
| 4 | **Auth & security hardening** | Replace `python-jose` → PyJWT, password policy on creation, login rate limiting, object-level authorization fixes, CORS from settings, remove demo credentials, secret/dependency/SAST scanning in CI | Directly addresses PHI exposure risks |
| 5 | **Frontend quality** | Centralized typed API client + error handling, hooks for data fetching, decomposed pages, shared loading/empty/error components, Vitest + RTL, build verification in CI | Maintainability and testability of UI |
| 6 | **Containerization** | Multi-stage non-root Dockerfiles with healthchecks, `.dockerignore`, compose for integration tests, Trivy scanning | Deployment unit for K8s |
| 7 | **CI quality gates** | `ci.yml`, `security.yml`, `container.yml`, `k8s.yml`, `terraform.yml`, `e2e.yml`, `release.yml` with artifacts and coverage floors | Make quality mechanical, not aspirational |
| 8 | **Kubernetes** | Base + overlay manifests (probes, HPA, PDB, SecurityContext, NetworkPolicy), kubeconform/kube-linter validation | Production runtime target |
| 9 | **Terraform/IaC** | `infra/terraform/` modules + environments, pinned providers, `.terraform.lock.hcl`, fmt/validate/IaC scan in CI | Reproducible infrastructure |
| 10 | **Observability & reliability** | OTel tracing, Prometheus metrics (request/error/latency/business), `/ready` dependency checks, Grafana dashboard + alerts, SLOs | Operability |
| 11 | **Operations** | Runbooks, DR plan (RPO/RTO, backup/restore validation), `scripts/verify.sh`, release readiness checklist | Incident readiness |
| 12 | **Final audit** | `docs/release-readiness.md` with evidence for every gate | Submission quality assurance |

### Engineering principles for the work

- Preserve existing functionality; change only for correctness, security,
  testability, or production readiness.
- Every production-code change ships with tests in the same change.
- Never weaken tests, coverage thresholds, or security checks to pass CI.
- No speculative architecture: every component must integrate and be validated.
- Small, logical, genuine commits with conventional messages.
