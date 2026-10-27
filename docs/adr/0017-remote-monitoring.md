# ADR-0017: Remote Patient Monitoring

## Status

Accepted

## Context

Need ingest vitals from devices and alert on thresholds.

## Decision

Store readings in time-series friendly tables, evaluate thresholds on ingest, generate alerts.

## Consequences

- Near real-time alerting.
- Storage growth.

## References

- `backend/modules/monitoring`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 4
