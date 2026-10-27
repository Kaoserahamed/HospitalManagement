# Authentication and Security

## Authentication
- JWT with issuer/audience validation.
- Password hashing via Argon2.
- RBAC roles: admin, doctor, receptionist, patient.

## Protections
- CORS configured with explicit origins.
- Rate limiting on login endpoints.
- Pydantic validation.
- Correlation ID middleware.

## Risks
- Some secrets were previously hardcoded in infra manifests (fixed).
- Demo admin credentials removed.
- Many modules are in-memory and lack persistence/audit controls.
