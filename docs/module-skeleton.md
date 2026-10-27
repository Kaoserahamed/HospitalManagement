# Module Skeleton Guide

## 1. Purpose

Defines the standard layout for new modules under `backend/modules/` introduced in
Phase 1 using the strangler-fig approach.

## 2. Layout

```
backend/modules/<capability>/
  __init__.py
  api.py          # FastAPI routers
  service.py      # Business logic
  repository.py   # Data access
  models.py       # SQLAlchemy models
  schemas.py      # Pydantic schemas
  events.py       # Domain events
  README.md       # Module purpose and ownership
```

## 3. Rules

- Modules depend on `shared/`, never on each other's internals.
- Cross-module calls go through service interfaces.
- No direct repository access across modules.
- Each module owns its tables (prefixed by module name).

## 4. Migration Strategy

1. Create new module skeleton.
2. Implement new functionality in the module.
3. Gradually move legacy code into the module.
4. Update imports and tests.
5. Remove legacy code once tests pass.

## 5. Shared Kernel

`backend/shared/` contains:
- `pagination.py`
- `errors.py`
- `correlation.py`
- `auth.py` (primitives)
- `events.py` (bus)

## 6. References

- `docs/adr/0001-modular-monolith.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 1
