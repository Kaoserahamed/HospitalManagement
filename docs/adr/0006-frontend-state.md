# ADR-0006: Frontend State Management

## Status

Accepted

## Context

The frontend needs to manage server state (API data) and UI state. Mixing them
leads to complexity and bugs.

## Decision

Use React Query for server state (caching, refetching, mutations) and React Context
for global UI/auth state. Local component state for ephemeral UI. React Hook Form + Zod
for forms.

## Consequences

### Positive

- Clear separation of concerns.
- Automatic caching and refetch.
- Less boilerplate.

### Negative / Trade-offs

- Additional dependency.
- Learning curve.

## Alternatives Considered

- Redux: rejected; too heavy for current scale.
- SWR: viable alternative; React Query chosen for features.

## References

- `docs/frontend-architecture.md`
