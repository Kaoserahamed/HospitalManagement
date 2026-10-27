# Observability Plan

## 1. Goals

- Provide visibility into system health and clinical workflows.
- Enable rapid incident detection and diagnosis.
- Support SLO-based alerting.
- Ensure PHI is never leaked in telemetry.

## 2. Pillars

### Logging

- Structured JSON logs with correlation/trace IDs.
- Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL.
- PHI redaction filters (denylist of fields).
- Centralized aggregation (ELK/Loki) in Phase 11.

### Metrics

- Prometheus exposition from backend (`/metrics`).
- RED metrics: rate, errors, duration per endpoint.
- Business metrics: appointments booked, prescriptions issued, queue length.
- Resource metrics: CPU, memory, DB connections.

### Tracing

- OpenTelemetry SDK (backend + frontend).
- W3C trace context propagation.
- Export to Jaeger/Tempo.
- Span attributes exclude PHI.

### Alerting

- SLO-based alerts (availability, latency, error rate).
- PagerDuty/Slack integration.
- Runbook links in alert payloads.

## 3. SLOs (target)

| Service | Availability | p95 Latency |
|---|---:|---:|
| Auth API | 99.9% | 200ms |
| Appointment API | 99.9% | 300ms |
| EHR API | 99.5% | 500ms |
| Frontend | 99.9% | 2s (LCP) |

## 4. Dashboards

- Service overview (RED).
- Database performance.
- Business KPIs (appointments, revenue, satisfaction).
- Infrastructure (K8s, nodes).

## 5. PHI Safety

- Never log patient identifiers, diagnoses, or notes.
- Redact by field name and pattern.
- Audit log separate from app logs; immutable.

## 6. Implementation Phases

- Phase 0: structured logging baseline (partial).
- Phase 11: full metrics, tracing, dashboards, alerting.

## 7. References

- `docs/runbooks/incident-response.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 11
