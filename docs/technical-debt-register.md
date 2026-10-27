# Technical Debt Register

## 1. Purpose

Track known technical debt items with priority and owner. Reviewed each phase.

## 2. Items

| ID | Area | Description | Priority | Phase |
|---|---|---|---|---|
| TD-001 | Backend layout | Flat structure, no module boundaries | High | 1 |
| TD-002 | Migrations | No Alembic; SQL + init script | High | 1 |
| TD-003 | Frontend tests | Minimal coverage (1 setup file) | High | 7 |
| TD-004 | Lint debt | Ruff scoped to core/ only | Medium | 1,7 |
| TD-005 | Observability | Basic logging only | Medium | 11 |
| TD-006 | Security | No encryption at rest | High | 12 |
| TD-007 | Audit | No immutable audit log | High | 12 |
| TD-008 | Performance | No caching layer | Medium | 13 |
| TD-009 | Docs | No ADRs (resolved Phase 0) | Low | 0 |
| TD-010 | CI | No SAST/DAST | Medium | 9 |
| TD-011 | Infra | No K8s/Terraform | Medium | 8 |
| TD-012 | DB | No read replicas | Low | 6 |
| TD-013 | Auth | No MFA/SSO | Medium | 12 |
| TD-014 | Testing | No E2E tests | High | 7 |
| TD-015 | Testing | No load/chaos tests | Medium | 7 |

## 3. Process

- Add new items during development.
- Review at each phase retrospective.
- Close items with commit references.

## 4. Metrics

- Track open debt count and age.
- Target: reduce high-priority items to zero by Phase 7.

## 5. References

- `docs/engineering-audit.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md`
