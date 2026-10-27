# ADR-0016: Telemedicine Architecture

## Status

Accepted

## Context

Need video consultations and remote monitoring.

## Decision

Use WebRTC for media, signaling service for session management, recording metadata in object storage.

## Consequences

- Low latency media.
- Operational complexity for TURN servers.

## References

- `docs/telemedicine` (planned)
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 4
