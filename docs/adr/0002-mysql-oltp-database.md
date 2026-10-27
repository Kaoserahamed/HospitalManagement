# ADR-0002: Retain MySQL 8 as Primary OLTP Database

## Status

Accepted

## Context

The system already uses MySQL 8 with SQLAlchemy 2.0 async and asyncmy. Migrating the
primary OLTP store would cost significant effort and risk with limited benefit. The
platform needs relational integrity for clinical and billing data, plus future read
replicas for analytics.

## Decision

Retain MySQL 8.0+ as the primary OLTP database. Add Alembic for versioned migrations,
read replicas for analytics/reporting, and Redis for caching and queues. Object storage
holds imaging and documents; only metadata lives in MySQL.

## Consequences

### Positive

- No migration risk; preserves existing schema and tests.
- Strong relational integrity for PHI and financial records.
- Alembic gives reproducible, reviewable schema changes.

### Negative / Trade-offs

- Horizontal write scaling requires sharding later (not needed for target scale).
- Full-text and vector search needs external engine (planned Phase 6).

### Neutral

- Analytics queries run against read replicas to protect OLTP performance.

## Alternatives Considered

- PostgreSQL: rejected; migration cost outweighs benefits at current scale.
- NoSQL primary store: rejected; relational model fits clinical/billing domain.

## References

- STRATEGIC_ENGINEERING_ROADMAP.md Phase 8 (infra), Phase 6 (analytics)
- database/complete_schema.sql
