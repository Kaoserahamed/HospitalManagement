# ADR-0012: Infrastructure and Cloud Provisioning

## Status

Accepted

## Context

Need reproducible, scalable infrastructure for production.

## Decision

Use Docker + Kubernetes (Helm) for runtime, Terraform for cloud provisioning.
Managed database and Redis. Secrets via Vault/KMS.

## Consequences

### Positive

- Reproducible environments.
- Horizontal scaling.

### Negative / Trade-offs

- Operational complexity.
- Cost.

## Alternatives Considered

- VM-based deployment: rejected; less scalable.

## References

- `docs/deployment-guide.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 8
