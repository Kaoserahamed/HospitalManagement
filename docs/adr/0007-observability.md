# ADR-0007: Observability Stack

## Status

Accepted

## Context

We need metrics, logs, and traces for production operations.

## Decision

Use Prometheus + Grafana for metrics, structured JSON logs aggregated via Loki/ELK,
and OpenTelemetry for tracing (Jaeger/Tempo). Sentry for error tracking. PHI is
redacted from all telemetry.

## Consequences

### Positive

- Industry-standard, well-supported tools.
- Unified correlation via trace IDs.

### Negative / Trade-offs

- Operational overhead.
- Requires discipline to avoid PHI leakage.

## Alternatives Considered

- Vendor APM (Datadog): rejected for cost at this stage; revisit later.

## References

- `docs/observability-plan.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 11
