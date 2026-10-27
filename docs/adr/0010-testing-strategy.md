# ADR-0010: Testing Strategy

## Status

Accepted

## Context

Need a comprehensive, layered testing approach to support refactoring and growth.

## Decision

Adopt the test pyramid: unit, integration, E2E, regression, performance, chaos.
Use pytest, Testcontainers, Playwright, k6, toxiproxy. Coverage gates enforced in CI.

## Consequences

### Positive

- Confidence in changes.
- Regression protection.

### Negative / Trade-offs

- Slower CI.
- Maintenance cost.

## Alternatives Considered

- Unit-only: rejected; insufficient for integration risks.

## References

- `docs/testing-strategy.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 7
