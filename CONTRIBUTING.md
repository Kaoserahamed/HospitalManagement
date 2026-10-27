# Contributing Guide

Welcome to HospitalManagement. This guide explains how to contribute to the project under the
Phase 0 governance model. All contributions are made as direct commits on the working branch;
no pull requests or feature branches are required for this phase.

## 1. Code of Conduct

All contributors are expected to be respectful, inclusive, and professional. Harassment,
discrimination, or abusive language will not be tolerated. Report concerns to the maintainers
listed in `CODEOWNERS`.

## 2. Development Environment

### Prerequisites

- Python 3.11.x
- Node.js 18.x (see `.nvmrc`)
- MySQL 8.0+
- Git 2.40+

### Backend setup

```bash
cd backend
pip install -e ".[dev]"
cp ../.env.example .env  # adjust values
python init_tables.py
python seed_admin.py
uvicorn main:app --reload
```

### Frontend setup

```bash
cd frontend
npm ci
npm run dev
```

## 3. Branching and Commit Policy

- Work happens on the active integration branch (`development`).
- Do not create feature branches or open pull requests during Phase 0.
- Write atomic commits with imperative subject lines under 72 characters.
- Reference the roadmap phase in the commit body when relevant, e.g. `Phase 0`.
- Group related changes; avoid mixing refactors with feature work.

### Commit message format

```
<type>: <short summary>

<body explaining why, not what>

Phase: <n>
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `security`.

## 4. Coding Standards

### Python (backend)

- Format with `ruff format`; lint with `ruff check`.
- Type-check with `mypy` (strict where configured).
- Line length 100 characters.
- Use async SQLAlchemy 2.0 patterns; avoid sync DB calls in request paths.
- Prefer repository pattern for data access; services contain business logic.
- Pydantic v2 schemas for all request/response payloads.
- No secrets or PHI in code, tests, or logs.

### TypeScript (frontend)

- Format with Prettier; lint with ESLint.
- Strict TypeScript (`tsc --noEmit`).
- Functional components with hooks; avoid class components.
- CSS Modules for styling; no inline styles in production code.

## 5. Testing Requirements

- Backend: pytest with `asyncio_mode = auto`.
- Frontend: Vitest + React Testing Library.
- New logic requires tests; bug fixes require regression tests.
- Coverage must not drop below configured gates (70% backend, 60% frontend Phase 0).
- Mark integration tests with `@pytest.mark.integration`.

## 6. Pull Request / Review Checklist (for later phases)

Although Phase 0 uses direct commits, the following checklist applies once PRs are reintroduced:

- [ ] Tests added/updated and passing.
- [ ] Lint and typecheck clean.
- [ ] No secrets or PHI.
- [ ] ADR added for architectural changes.
- [ ] Documentation updated.
- [ ] CHANGELOG entry added.

## 7. Documentation

- Update `docs/` for architectural or operational changes.
- Add an ADR under `docs/adr/` for any decision with long-term impact.
- Keep `STRATEGIC_ENGINEERING_ROADMAP.md` in sync with phase progress.

## 8. Security and Compliance

- Never commit secrets, tokens, or credentials.
- Never commit real or realistic PHI; use synthetic data only.
- Report vulnerabilities per `SECURITY.md`.
- Follow least-privilege and minimum-necessary access principles.

## 9. Release Process

- Phase tags follow `v<major>.<minor>.<patch>-<stage>`.
- Update `CHANGELOG.md` with every user-visible change.
- Run the full CI pipeline before tagging.

## 10. Getting Help

Open an issue using the templates in `.github/ISSUE_TEMPLATE/` or contact a maintainer
listed in `CODEOWNERS`.
