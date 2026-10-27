# ADR-0004: Module Boundaries and Ownership

## Status

Accepted

## Context

As modules are introduced, we need clear rules about what each module owns and how
they interact to avoid tight coupling and circular dependencies.

## Decision

Each module owns its data (tables), business logic, and API surface. Modules may
depend on `shared/` and on other modules' public service interfaces only. Direct
database access across modules is forbidden. Cross-module calls are synchronous
service calls or domain events.

## Consequences

### Positive

- Clear ownership and testability.
- Enables future extraction.

### Negative / Trade-offs

- Requires discipline and lint rules.
- Some duplication possible at boundaries.

## Alternatives Considered

- Shared database with no boundaries: rejected; leads to coupling.

## References

- `docs/module-skeleton.md`
- `docs/adr/0001-modular-monolith.md`
