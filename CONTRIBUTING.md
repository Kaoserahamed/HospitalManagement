# Contributing to Hospital Management System

Thank you for contributing. This document defines how to work in this
repository so that changes remain reviewable, reproducible, and safe for a
system that handles patient data.

## Code of Conduct

Be professional and constructive. Patient-data handling topics are treated
with extra care — when in doubt, raise it in review.

## Getting Started

1. Read [`README.md`](../README.md) for environment setup and
   [`docs/architecture.md`](architecture.md) for system structure.
2. Supported tool versions are pinned in `.python-version` (backend) and
   `.nvmrc` (frontend). CI enforces these same versions.
3. Install dependencies:
   - Backend: `cd backend && pip install -r requirements.lock && pip install -r requirements-dev.lock` (or `make backend-install`)
   - Frontend: `cd frontend && npm ci` (or `make frontend-install`)

## Development Workflow

1. Create a branch from `main`:
   `git checkout -b feat/short-description`
2. Make small, focused changes. One logical change per commit.
3. Add or update tests for every production-code change (backend pytest,
   frontend Vitest). Changes without tests will not pass CI.
4. Run the local verification suite before pushing:
   ```bash
   ./scripts/verify.sh          # full pass (same commands CI runs)
   ```
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new functionality
   - `fix:` bug fix
   - `test:` test-only change
   - `docs:` documentation
   - `refactor:` no behavior change
   - `chore:` tooling/deps/governance
   - `ci:` pipeline changes
   - `security:` security hardening
   - `build:` build/container changes
   - `cd:` deployment pipeline changes
6. Open a Pull Request using the PR template. CI must be green.

## Quality Gates (enforced in CI)

| Gate | Command | Scope |
|---|---|---|
| Format check | `ruff format --check .` / `prettier --check .` | backend / frontend |
| Lint | `ruff check .` / `npm run lint` | backend / frontend |
| Type check | `mypy .` / `tsc --noEmit` | backend / frontend |
| Unit tests | `pytest -m "not integration"` / `npm test -- --run` | backend / frontend |
| Integration tests | `pytest -m integration` (ephemeral MySQL) | backend |
| Coverage floor | `pytest --cov --cov-fail-under=70` | backend |
| Build | `npm run build` | frontend |
| Security | gitleaks, pip-audit, npm audit, bandit, semgrep | repo-wide |

## Security Expectations

- **Never** commit secrets (`.env`, credentials, keys, tokens). Secret
  scanning runs on every push and PR.
- Any change touching authentication, authorization, or PHI flows requires
  review from a `CODEOWNERS` security reviewer and an updated
  [`docs/threat-model.md`](threat-model.md) if the threat surface changes.
- Report vulnerabilities per [`SECURITY.md`](../SECURITY.md) — do not open
  public issues for them.

## Database Changes

Schema changes must ship as versioned Alembic migrations in
`backend/alembic/versions/` — never by editing `database/complete_schema.sql`
alone. Include a migration test when the change affects constraints or
integrity rules. See [`docs/database.md`](database.md).

## Documentation

Behavior changes require documentation updates in the same PR. CI checks that
referenced docs exist; stale documentation is treated as a defect.
