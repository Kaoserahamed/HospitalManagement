# Incident Response Runbook (Phase 0 draft)

## 1. Purpose

This runbook defines the initial incident response process for HospitalManagement until
the full observability and on-call tooling is delivered in Phases 10-11.

## 2. Severity Levels

| Level | Description | Response Time |
|---|---|---|
| SEV1 | Production down or PHI exposure | 15 minutes |
| SEV2 | Major feature unavailable | 1 hour |
| SEV3 | Degraded performance or non-critical bug | 4 hours |
| SEV4 | Minor issue, cosmetic | Next business day |

## 3. Roles

- **Incident Commander (IC)**: coordinates response and communication.
- **Technical Lead**: investigates and implements fix.
- **Communications Lead**: updates stakeholders and status page.
- **Scribe**: records timeline and decisions.

## 4. Response Flow

1. Detect and triage: confirm scope and severity.
2. Page on-call via configured channel (Phase 11).
3. Open an incident record with timestamp, symptoms, and impact.
4. Assemble responders; assign IC.
5. Diagnose using logs, metrics, and traces.
6. Mitigate (rollback, feature flag, or hotfix).
7. Verify recovery and monitor for recurrence.
8. Post-incident review within 5 business days.

## 5. Communication

- Internal: maintainers channel.
- External: status page and customer notification for SEV1/SEV2.
- PHI incidents follow breach-notification procedures (HIPAA 72-hour rule).

## 6. Evidence Preservation

- Do not modify or delete logs.
- Capture relevant metrics snapshots.
- Preserve database state via backup before changes.

## 7. Post-Incident Review

- Timeline reconstruction.
- Root cause analysis (5 whys).
- Action items with owners and due dates.
- Update runbooks and monitoring.

## 8. Contacts

- Maintainers: see `CODEOWNERS`.
- Security reports: see `SECURITY.md`.

## 9. Related

- `docs/compliance/hipaa.md`
- `docs/adr/`
- `STRATEGIC_ENGINEERING_ROADMAP.md`
