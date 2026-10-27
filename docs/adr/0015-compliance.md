# ADR-0015: Compliance Strategy

## Status

Accepted

## Context

Healthcare platform must align with HIPAA/GDPR.

## Decision

Implement encryption, audit logging, access controls, data export/deletion, and
breach procedures across Phases 10 and 12. Document in `docs/compliance/`.

## Consequences

### Positive

- Regulatory alignment.
- Patient trust.

### Negative / Trade-offs

- Significant effort.
- Ongoing maintenance.

## References

- `docs/compliance/hipaa.md`
- `SECURITY.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 10, 12
