# Phase 1 Detailed Plan

## 1. Objective

Establish modular architecture and shared kernel while preserving existing functionality.

## 2. Workstreams

### 2.1 Module Skeleton (Week 3)
- Create `backend/modules/` with all capability modules.
- Move shared utilities to `backend/shared/`.
- Add module-level README and ownership.

### 2.2 Patient Module (Week 4)
- Migrate patient models, schemas, repository, service.
- API router under `/api/v1/patients`.
- Unit tests for service logic.

### 2.3 Appointment Module (Week 5)
- Migrate appointment models, scheduling, conflict detection.
- API router under `/api/v1/appointments`.
- Integration tests with patient module.

### 2.4 Department & Schedule (Week 6)
- Department CRUD and room assignment.
- Doctor schedule management.
- Frontend feature folders.

### 2.5 Shared Kernel (Week 7)
- Pagination, filtering, sorting.
- Error contract and exception handlers.
- Correlation IDs and logging context.

### 2.6 OpenAPI and Docs (Week 8)
- Regenerate OpenAPI under `/api/v1`.
- Update frontend API client.
- Phase 1 retrospective and tag.

## 3. Exit Criteria

- All modules importable without circular deps.
- OpenAPI spec generated and versioned.
- CI green.
- No regression in existing features.

## 4. Risks

- Migration may introduce regressions; mitigate with tests.
- Legacy code coupling; use strangler-fig.

## 5. References

- `docs/module-skeleton.md`
- `docs/adr/0001-modular-monolith.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 1
