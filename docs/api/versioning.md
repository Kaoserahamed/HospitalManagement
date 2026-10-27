# API Versioning Strategy (Phase 0)

## 1. Current State

The API is served at the root path (`/`) with auto-generated OpenAPI at `/docs`.
No explicit versioning is applied yet.

## 2. Target Strategy

- Introduce URL-based versioning: `/api/v1/...` starting Phase 1.
- Maintain backward compatibility for at least one minor release.
- Deprecation headers (`Sunset`, `Deprecation`) for retired endpoints.
- Version documented in OpenAPI `info.version`.

## 3. Versioning Policy

| Change Type | Version Bump |
|---|---|
| Breaking (remove/rename field, change type) | Major |
| Additive (new endpoint, new optional field) | Minor |
| Fix (bug fix, no contract change) | Patch |

## 4. Migration Plan

1. Phase 1: add `/api/v1` prefix while keeping root aliases.
2. Phase 2: remove root aliases after deprecation window.
3. Phase 10: publish versioned OpenAPI and Redoc portal.

## 5. Client Compatibility

- Frontend pins to a specific API version.
- SDKs (if added) follow semver aligned with API version.

## 6. References

- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 1, Phase 10
- `docs/adr/0001-modular-monolith.md`
