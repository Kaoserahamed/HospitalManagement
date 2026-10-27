# ADR-0009: API Versioning

## Status

Accepted

## Context

APIs evolve; breaking changes must not disrupt clients.

## Decision

Use URL-based versioning (`/api/v1`). Maintain backward compatibility for one minor
release. Deprecate via headers. Full versioning policy in `docs/api/versioning.md`.

## Consequences

### Positive

- Clear contract boundaries.
- Safe evolution.

### Negative / Trade-offs

- Duplicate route maintenance during deprecation.

## Alternatives Considered

- Header-based versioning: rejected; less discoverable.

## References

- `docs/api/versioning.md`
- `docs/api-design.md`
