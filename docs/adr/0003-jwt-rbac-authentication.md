# ADR-0003: JWT-Based Authentication with RBAC and Future MFA/SSO

## Status

Accepted

## Context

The application serves multiple roles (Admin, Doctor, Receptionist, Patient) with
different capabilities. We need stateless authentication for horizontal scaling, clear
role enforcement, and a path to MFA and enterprise SSO without reworking the core.

## Decision

Use JWT (PyJWT) with issuer- and audience-pinned claims and short-lived access tokens.
Passwords are hashed with Argon2 via pwdlib. Role-based access control is enforced in
the dependency layer (`backend/dependencies/auth.py`) and service layer. MFA (TOTP)
and SSO (SAML/OIDC) are added in Phase 12 without changing the token format, via
additional claims and an identity-provider abstraction.

## Consequences

### Positive

- Stateless tokens scale horizontally; no session store required for access tokens.
- RBAC is centralized and testable.
- Clear extension path for MFA and SSO.

### Negative / Trade-offs

- Token revocation requires a denylist or short expiry plus refresh tokens (planned).
- JWT size grows with claims; keep claims minimal.

### Neutral

- Refresh tokens and denylist arrive in Phase 3 alongside billing hardening.

## Alternatives Considered

- Server-side sessions: rejected; complicates horizontal scaling.
- OAuth2 only (external IdP): rejected for Phase 0; local auth needed for bootstrap.

## References

- backend/core/security.py
- backend/dependencies/auth.py
- STRATEGIC_ENGINEERING_ROADMAP.md Phase 12
