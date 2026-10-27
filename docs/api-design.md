# API Design Guidelines

## 1. Principles

- RESTful, resource-oriented.
- Consistent naming and response shapes.
- Versioned and documented (OpenAPI 3.1).
- Idempotent where appropriate.

## 2. URL Design

- `/api/v1/<resource>` (plural nouns).
- Nested resources for ownership: `/patients/{id}/appointments`.
- Query params for filtering, sorting, pagination.

## 3. HTTP Methods

| Method | Usage |
|---|---|
| GET | Read (safe, idempotent) |
| POST | Create |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Remove (soft delete preferred) |

## 4. Response Format

```json
{
  "data": { ... },
  "meta": { "page": 1, "per_page": 20, "total": 100 }
}
```

Errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ { "field": "email", "message": "Invalid" } ]
  }
}
```

## 5. Pagination

- Cursor-based for large datasets; offset for small.
- Default page size 20; max 100.

## 6. Status Codes

- 200 OK, 201 Created, 204 No Content.
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found.
- 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests.
- 500 Internal Server Error.

## 7. Versioning

See `docs/api/versioning.md`.

## 8. Security

- Bearer token in Authorization header.
- HTTPS only in production.
- Rate limiting per client.

## 9. References

- `docs/api/versioning.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 1, 10
