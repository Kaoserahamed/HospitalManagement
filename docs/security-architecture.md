# Security Architecture

## 1. Principles

- Defense in depth.
- Least privilege and minimum necessary.
- Secure by default.
- Fail closed.

## 2. Layers

### Network

- TLS 1.3 termination at ingress.
- Network policies between pods.
- WAF for public endpoints.

### Application

- JWT auth with issuer/audience pinning.
- RBAC + ABAC enforcement.
- Input validation (Pydantic).
- Output encoding (XSS prevention).
- CSRF protection for state-changing requests.
- Rate limiting.

### Data

- Encryption at rest (Phase 12).
- Field-level encryption for PHI.
- Parameterized queries (SQL injection prevention).
- Backups encrypted.

### Secrets

- Environment variables / secret manager.
- No secrets in code or logs.
- Rotation policy.

## 3. Threat Model (high level)

| Threat | Mitigation |
|---|---|
| Credential stuffing | MFA, rate limiting, lockout |
| PHI exfiltration | RBAC, audit, encryption |
| SQL injection | ORM, parameterization |
| XSS | Output encoding, CSP |
| CSRF | Tokens, SameSite cookies |
| Supply chain | Dependency scanning, SBOM, signing |

## 4. Audit and Monitoring

- Immutable audit log for PHI access.
- Security event monitoring.
- Anomaly detection (Phase 11).

## 5. Compliance Mapping

- HIPAA Security Rule: administrative, physical, technical safeguards.
- GDPR: consent, access, erasure, portability.

## 6. References

- `SECURITY.md`
- `docs/compliance/hipaa.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 9, 12
