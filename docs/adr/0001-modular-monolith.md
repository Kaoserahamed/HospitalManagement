# ADR-0001: Adopt a Modular Monolith Architecture

## Status

Accepted

## Context

HospitalManagement currently mixes controllers, services, repositories, models, and schemas
in flat, type-based directories. As the platform grows toward EHR, pharmacy, billing,
telemedicine, and analytics, a flat layout will not scale and will invite circular
dependencies. We need clear module boundaries while avoiding the operational complexity
of microservices at this stage.

## Decision

Adopt a **modular monolith**: each business capability lives in its own module under
`backend/modules/<capability>/` with `api`, `service`, `repository`, `model`, and
`schema` subpackages. Modules communicate through well-defined service interfaces and
domain events, never by reaching into another module's repository or tables directly.
A shared kernel (`backend/shared/`) holds cross-cutting concerns (pagination, errors,
correlation IDs, auth primitives).

## Consequences

### Positive

- Clear ownership and boundaries without distributed-system overhead.
- Single deployable unit simplifies CI/CD and observability in Phase 0-8.
- Enables incremental extraction to services later (strangler fig).

### Negative / Trade-offs

- Module discipline must be enforced by lint/import rules; not automatic.
- A single process means a fault in one module can affect others; mitigated by
  error boundaries and health checks.

### Neutral

- Database remains shared; module-owned tables are namespaced by prefix.

## Alternatives Considered

- Microservices now: rejected due to operational cost and team size (3-4 people).
- Keep flat layout: rejected; does not scale to 150k LOC target.

## References

- STRATEGIC_ENGINEERING_ROADMAP.md Phase 1
- https://martinfowler.com/bliki/MonolithFirst.html
