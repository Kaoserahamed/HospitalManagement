# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| development (current) | Yes |
| main (stable) | Yes |
| < 1.0.0 | No |

## Reporting a Vulnerability

Please do **not** open public issues for security vulnerabilities. Instead, report
privately to the maintainers listed in `CODEOWNERS` via email. Include:

- A description of the vulnerability and its impact.
- Steps to reproduce (proof of concept if available).
- Affected versions and components.
- Any suggested remediation.

You will receive an acknowledgment within 72 hours and a status update within 7 days.
Coordinated disclosure is preferred; we ask for 90 days before public disclosure.

## Scope

In scope:

- Backend API (`backend/`)
- Frontend application (`frontend/`)
- Authentication and authorization (JWT, RBAC)
- Database access and migrations
- CI/CD workflows (`.github/workflows/`)
- Container images and deployment configuration

Out of scope:

- Third-party dependencies (report upstream, but notify us)
- Denial of service via resource exhaustion on dev instances
- Social engineering of maintainers

## Security Controls

### Authentication

- JWT with issuer/audience-pinned claims.
- Argon2 password hashing.
- Role-based access control (Admin, Doctor, Receptionist, Patient).
- MFA planned for Phase 12.

### Data Protection

- TLS in transit (production).
- Encryption at rest planned for Phase 12 (DB TDE + field-level PHI).
- No PHI in logs, tests, or version control.
- Minimum-necessary access enforced in service layer.

### Secrets Management

- Secrets live in environment variables or a secret manager (Vault/KMS in production).
- `.env` files are gitignored; only `.env.example` is committed.
- CI uses scoped, short-lived credentials.
- Secret scanning runs in CI (gitleaks/trufflehog planned Phase 9).

### Dependency Security

- `pip audit` / `safety` for Python.
- `npm audit` for frontend.
- Dependabot configured in `.github/dependabot.yml`.

## Compliance

This project targets HIPAA and GDPR alignment. PHI handling, audit logging, and
data retention policies are documented in `docs/compliance/` (planned Phase 10).
Until then, treat all patient data as PHI and apply minimum-necessary access.

## Secure Development Lifecycle

- Lint and security scanning in CI.
- Code review for all changes (post-Phase 0).
- Threat modeling for new features.
- Penetration testing planned for Phase 12.

## Incident Response

Security incidents follow the runbook in `docs/runbooks/incident-response.md`
(planned Phase 10). Until available, contact maintainers immediately and preserve
logs without modification.
