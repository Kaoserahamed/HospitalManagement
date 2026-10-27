# Engineering Audit Baseline

Generated during Phase 0. Companion to `STRATEGIC_ENGINEERING_ROADMAP.md`.

## 1. Repository Snapshot

- Branch: `development`
- Commit count (all refs): ~61
- Contributors: 2
- Primary stack: FastAPI + SQLAlchemy 2.0 + MySQL 8 (backend); React 18 + TypeScript + Vite (frontend).

## 2. scc Baseline (Phase 0 start)

| Language | Files | Lines | Code |
|---|---:|---:|---:|
| Python | 84 | 7,320 | 5,602 |
| TypeScript | 42 | 6,534 | 5,899 |
| Markdown | 14 | 1,633 | 1,293 |
| Other | 23 | 1,2... | ... |
| **Total** | **163** | **16,788** | **13,882** |

DRYness: 0.52. COCOMO (organic): $427,730 / 9.96 months / 3.82 people.

## 3. Technical Debt Inventory

1. Flat backend layout; no module boundaries yet (target Phase 1).
2. No Alembic migrations; schema applied via SQL + init script.
3. Frontend test coverage minimal (1 setup file).
4. No EHR, pharmacy, billing, telemedicine, analytics modules.
5. No container hardening beyond basic Dockerfiles.
6. No Kubernetes/Terraform.
7. CI coverage gate 70% backend; no frontend coverage gate.
8. Legacy lint debt deferred (ruff scopes to core/ + touched files).
9. No observability beyond basic logging.
10. No ADRs prior to this phase.

## 4. Quality Gates (Phase 0)

- `ruff check` + `ruff format --check` on backend.
- `mypy` on `core/`.
- `tsc --noEmit` on frontend.
- `eslint` + `prettier --check` on frontend.
- `pytest tests/ -m "not integration"` with coverage >= 70%.
- `npm test -- --run`.
- `npm audit --audit-level=high`.

## 5. Target Metrics (Phase 0 exit)

- scc total lines: >= 18,788 (+2,000 over baseline).
- Commit count: >= 67 (+10 over baseline).
- New governance artifacts: CONTRIBUTING, SECURITY, CODEOWNERS, ADRs, pre-commit, audit.
- CI green on `development`.

## 6. Risks Carried Forward

- Single primary contributor; CODEOWNERS documents ownership.
- Legacy lint debt tracked, not blocking.
- Frontend test gap to be closed in Phase 7.

## 7. Next Phase

Phase 1 begins modular restructuring under `backend/modules/` using the strangler-fig
approach: new modules added without moving legacy code until tests are green.
