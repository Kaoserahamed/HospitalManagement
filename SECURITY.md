# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `main` branch | ✅ |
| Older tags/branches | ❌ |

## Reporting a Vulnerability

**Do not open a public issue or pull request for a security vulnerability.**

1. Use GitHub's **Private vulnerability reporting** (Repository → Security →
   Report a vulnerability), or
2. Email the maintainers listed in `CODEOWNERS` with `[SECURITY]` in the subject.

Include: affected component, impact, reproduction steps, and any proof of
concept. You will receive an acknowledgement within **3 business days** and a
remediation plan within **14 days** for confirmed issues.

## Scope

In scope:

- The FastAPI backend (`backend/`) and its authentication/authorization model
- The React frontend (`frontend/`)
- Infrastructure as Code (`infra/terraform/`, `k8s/`) and CI pipelines
  (`.github/workflows/`)

Out of scope:

- Volumetric denial-of-service without a demonstrated application impact
- Social engineering of hospital staff
- Issues in third-party services (reported upstream instead)

## Security Model Summary

This system handles **protected health information (PHI)**. Key controls:

- **Authentication:** dual model — staff (email + Argon2-hashed password, JWT
  `type=staff`) and patients (JWT `type=patient`).
- **Authorization:** role-based (admin, doctor, receptionist) plus
  object-level ownership checks (patients see only their own records;
  doctors only their own appointments/prescriptions).
- **Transport:** TLS terminated at the ingress; HSTS enforced.
- **Secrets:** never in the repository or container images; injected via
  Kubernetes Secrets / environment at runtime.
- **Scanning:** gitleaks (secrets), pip-audit + npm audit (dependencies),
  bandit + semgrep (SAST), Trivy (containers) run in CI.

Full details: [`docs/security.md`](docs/security.md) and
[`docs/threat-model.md`](docs/threat-model.md).

## Security-Relevant Files

| File | Purpose |
|---|---|
| `backend/core/security.py` | JWT + password hashing |
| `backend/dependencies/auth.py` | Auth guards and role checks |
| `backend/core/config.py` | Secret/CORS configuration (validated) |
| `k8s/base/` | Workload security contexts, network policies |
| `.github/workflows/security.yml` | Automated security scanning |
