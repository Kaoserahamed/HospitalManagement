# ADR-0011: Observability and Telemetry

## Status

Accepted

## Context

Production operations require visibility into health and workflows.

## Decision

Use structured logging, Prometheus metrics, OpenTelemetry tracing, and Sentry.
PHI redaction mandatory. Dashboards and SLOs defined in Phase 11.

## Consequences

### Positive

- Faster incident response.
- Data-driven optimization.

### Negative / Trade-offs

- Telemetry overhead.
- PHI leakage risk if undisciplined.

## Alternatives Considered

- Vendor-only APM: deferred for cost.

## References

- `docs/observability-plan.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 11
