# ADR-0008: Data Encryption Strategy

## Status

Accepted

## Context

PHI must be protected at rest and in transit. Current system lacks encryption at rest.

## Decision

Use TLS 1.3 in transit. At rest: DB-level TDE plus field-level encryption for
highly sensitive PHI (SSN, insurance numbers). Key management via KMS/Vault with
rotation. Encryption is introduced in Phase 12.

## Consequences

### Positive

- Strong protection for PHI.
- Compliance alignment.

### Negative / Trade-offs

- Performance overhead.
- Key management complexity.

## Alternatives Considered

- Application-only encryption: rejected; misses DB backups and ad-hoc queries.

## References

- `docs/security-architecture.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 12
