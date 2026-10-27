# Frequently Asked Questions

## General

**Q: What is HospitalManagement?**
A: A web-based hospital management system (FastAPI + React + MySQL) evolving into a
production-grade platform.

**Q: Is it production-ready?**
A: Not yet. Phase 0-1 establish governance and modular architecture; GA is Phase 13.

**Q: What license?**
A: MIT.

## Development

**Q: Which Python version?**
A: 3.11 (see `.python-version`).

**Q: Which Node version?**
A: 18 (see `.nvmrc`).

**Q: How do I run tests?**
A: Backend: `pytest`. Frontend: `npm test`.

**Q: Why are some lint errors deferred?**
A: Legacy code lint debt is tracked in `docs/engineering-audit.md` and addressed
incrementally.

## Architecture

**Q: Why modular monolith over microservices?**
A: Operational simplicity at current scale; extraction possible later (ADR-0001).

**Q: Why MySQL over PostgreSQL?**
A: Existing investment and schema; migration cost (ADR-0002).

**Q: How is auth handled?**
A: JWT with RBAC; MFA/SSO in Phase 12 (ADR-0003).

## Compliance

**Q: Is it HIPAA compliant?**
A: In progress; see `docs/compliance/hipaa.md`.

**Q: Can I use real patient data?**
A: No. Synthetic data only.

## Contributing

**Q: Do I need to open a PR?**
A: During Phase 0, no—direct commits. Later phases use PRs.

**Q: How do I report a security issue?**
A: See `SECURITY.md`.
