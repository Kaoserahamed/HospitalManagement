# Onboarding Guide

## 1. Welcome

Welcome to HospitalManagement. This guide helps new contributors get productive quickly.

## 2. First Steps

1. Clone the repository.
2. Read `README.md` and `STRATEGIC_ENGINEERING_ROADMAP.md`.
3. Set up the development environment (see `CONTRIBUTING.md`).
4. Run the test suites to confirm a green baseline.
5. Review `docs/adr/` for architectural context.

## 3. Key Documents

- `README.md` — project overview.
- `CONTRIBUTING.md` — coding standards and workflow.
- `SECURITY.md` — security policy.
- `docs/architecture.md` — system architecture.
- `docs/engineering-audit.md` — technical debt.
- `docs/glossary.md` — terminology.

## 4. Development Workflow (Phase 0)

- Work on `development` branch.
- Make atomic commits with conventional messages.
- Run pre-commit hooks (`pre-commit install`).
- Keep CI green.

## 5. Areas of Ownership

See `CODEOWNERS`. Primary maintainers: `@kaoser`, `@Kaoserahamed`.

## 6. Communication

- Issues: `.github/ISSUE_TEMPLATE/`.
- Security: `SECURITY.md`.

## 7. Learning Path

1. Backend: FastAPI, SQLAlchemy, Pydantic.
2. Frontend: React, TypeScript, Vite.
3. Domain: healthcare workflows, HIPAA basics.
4. Infra: Docker, (later) Kubernetes, Terraform.

## 8. First Contribution Ideas

- Improve test coverage.
- Add a small utility to shared kernel.
- Write documentation.
- Fix a lint warning.

## 9. References

- `docs/troubleshooting.md`
- `docs/glossary.md`
