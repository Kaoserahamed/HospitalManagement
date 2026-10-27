# ADR-0018: Caching Strategy

## Status

Accepted

## Context

Need reduce latency for hot paths.

## Decision

Use Redis for distributed caching with TTL; in-memory cache for single-instance. Cache patient search and schedules.

## Consequences

- Faster reads.
- Cache invalidation complexity.

## References

- `backend/modules/cache`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 13
