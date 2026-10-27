# Performance Budget

## 1. Targets

| Metric | Target |
|---|---|
| API p95 latency | < 300ms |
| Frontend LCP | < 2.5s |
| Frontend TTI | < 3.5s |
| Bundle size (initial) | < 250KB gzipped |
| DB query p95 | < 50ms |

## 2. Measurement

- Backend: middleware timing, Prometheus histograms.
- Frontend: Web Vitals, Lighthouse CI.
- Load tests: k6 scenarios in Phase 7.

## 3. Budgets by Feature

- Appointment booking: < 400ms end-to-end.
- Patient search: < 200ms.
- EHR load: < 800ms.
- Report generation: async, < 30s.

## 4. Regression Policy

- Performance tests in CI for critical paths.
- Fail build on > 20% regression.
- Track trends over time.

## 5. Optimization Levers

- Caching (Redis).
- Query optimization and indexes.
- Pagination and lazy loading.
- CDN for static assets.

## 6. References

- `docs/observability-plan.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 7, 13
