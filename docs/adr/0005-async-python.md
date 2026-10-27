# ADR-0005: Async Python with SQLAlchemy 2.0

## Status

Accepted

## Context

The backend must handle concurrent I/O-bound requests efficiently. SQLAlchemy 2.0
supports async sessions; FastAPI is async-native.

## Decision

Use async SQLAlchemy sessions throughout the request path. Use `asyncmy` as the
MySQL driver. Blocking work (CPU-heavy or external) is offloaded to workers.

## Consequences

### Positive

- Better concurrency under load.
- Consistent async patterns.

### Negative / Trade-offs

- Async debugging is harder.
- Some libraries are sync-only; wrap carefully.

## Alternatives Considered

- Sync SQLAlchemy with threadpool: rejected; less efficient and inconsistent.

## References

- `backend/core/database.py`
- `docs/adr/0002-mysql-oltp-database.md`
