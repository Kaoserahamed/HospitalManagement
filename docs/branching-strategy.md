# Branching Strategy (Post-Phase 0)

## 1. Branches

- `main`: production-ready, released.
- `development`: integration.
- `feature/<ticket>-<slug>`: feature work.
- `fix/<ticket>-<slug>`: bug fixes.
- `hotfix/<ticket>`: production hotfixes.
- `release/<version>`: release preparation.

## 2. Workflow

1. Branch from `development`.
2. Implement with tests and docs.
3. Open PR to `development`.
4. Review and merge.
5. Delete feature branch.

## 3. Phase 0 Exception

During Phase 0, work lands as direct commits on `development` with no branches or PRs.

## 4. Protection Rules

- `main` and `development` protected.
- Require CI green and review (post-Phase 0).
- No force push.

## 5. References

- `CONTRIBUTING.md`
- `docs/governance/release-process.md`
