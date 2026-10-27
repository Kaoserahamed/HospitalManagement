# HIPAA Compliance Baseline (Phase 0)

## 1. Scope

This document captures the current HIPAA posture and planned controls. Full compliance
documentation is delivered in Phase 10.

## 2. Current Controls

- JWT authentication with role-based access control.
- Password hashing with Argon2.
- Parameterized queries via SQLAlchemy (injection protection).
- HTTPS in production (deployment dependent).
- No PHI committed to version control (enforced by `scripts/check_secrets.py`).

## 3. Gaps

- No encryption at rest for PHI (Phase 12).
- No field-level encryption (Phase 12).
- No immutable audit log (Phase 12).
- No formal breach notification procedure (Phase 10).
- No data export/deletion workflow (GDPR/HIPAA) (Phase 12).
- No MFA or SSO (Phase 12).
- No disaster recovery drill (Phase 8).

## 4. Data Classification

| Class | Examples | Handling |
|---|---|---|
| PHI | Patient demographics, diagnoses, prescriptions | Encrypt, audit, minimum necessary |
| PII | Staff names, emails | Access-controlled, retained per policy |
| Operational | Appointment slots, schedules | Standard controls |
| Public | Department names | No restrictions |

## 5. Minimum Necessary

Service-layer authorization enforces role-scoped data access. Break-glass access is
planned for Phase 12 with mandatory justification and audit.

## 6. Retention

Retention periods are defined in Phase 10. Until then, retain all clinical records
indefinitely and never delete without legal review.

## 7. Training

All contributors handling PHI must complete HIPAA awareness training before
accessing production data (process defined Phase 10).

## 8. References

- `SECURITY.md`
- `docs/runbooks/incident-response.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 12
