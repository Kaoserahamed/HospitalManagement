# Testing Strategy

## 1. Goals

- Catch regressions before merge.
- Enforce coverage gates.
- Validate end-to-end clinical workflows.
- Provide confidence for refactoring toward modular architecture.

## 2. Test Pyramid

### Unit Tests

- Scope: pure functions, validators, mappers, service logic with mocked repos.
- Backend: pytest, pytest-asyncio.
- Frontend: Vitest, React Testing Library.
- Target: 85% backend, 75% frontend (Phase 7).

### Integration Tests

- Scope: service + repository against real database.
- Use Testcontainers (MySQL) in CI.
- Mark with `@pytest.mark.integration`.
- Run in a separate CI job.

### End-to-End Tests

- Scope: full user journeys via browser.
- Tool: Playwright.
- Journeys: patient registration, appointment booking, doctor EHR entry,
  prescription creation, pharmacy dispensing, billing.

### Regression Tests

- Golden-master fixtures for critical calculations (billing, scheduling).
- Snapshot tests for API responses where stable.

### Performance Tests

- Tool: k6 / Locust.
- Scenarios: concurrent appointment booking, patient search, EHR load.
- Run nightly or on release candidates.

### Chaos Tests

- Tool: toxiproxy.
- Scenarios: DB latency, service restart, network partition.
- Validate graceful degradation.

## 3. Coverage Gates

| Scope | Phase 0 | Phase 7 |
|---|---:|---:|
| Backend | 70% | 85% |
| Frontend | 0% (none) | 75% |

## 4. Test Data

- Synthetic data only; no real or realistic PHI.
- Factories/fixtures in `tests/factories/`.
- Deterministic seeds for reproducibility.

## 5. CI Execution

- PR/commit: unit + lint + typecheck.
- Nightly: integration + E2E + performance.
- Release: full suite + chaos.

## 6. Flaky Test Policy

- Quarantine flaky tests within 24 hours.
- Fix or remove within one sprint.
- Track flaky rate as a metric.

## 7. References

- `backend/pyproject.toml` (pytest config)
- `frontend/vitest.config.ts`
- `.github/workflows/ci.yml`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 7
