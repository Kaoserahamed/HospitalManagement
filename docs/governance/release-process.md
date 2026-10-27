# Release Process

## 1. Overview

This document defines the release process for HospitalManagement. It applies from Phase 0
forward and is refined in Phase 10 (documentation and governance).

## 2. Versioning

Semantic versioning: `MAJOR.MINOR.PATCH`.

- MAJOR: breaking API or data changes.
- MINOR: backward-compatible features.
- PATCH: bug fixes and security patches.

Pre-release suffixes: `-alpha`, `-beta`, `-rc.N`, `-foundation`, `-core`, `-ga`.

## 3. Branching (post-Phase 0)

- `main`: stable, released code.
- `development`: integration branch.
- `feature/<ticket>-<description>`: feature work (reintroduced after Phase 0).
- `hotfix/<ticket>`: production fixes.

## 4. Release Checklist

1. Freeze feature scope for the release.
2. Run full CI pipeline (lint, typecheck, tests, security, build).
3. Update `CHANGELOG.md` with all user-visible changes.
4. Bump version in `backend/pyproject.toml`, `frontend/package.json`.
5. Tag the release: `git tag -a v<version> -m "Release v<version>"`.
6. Build and publish container images (Phase 8/9).
7. Deploy to staging; run smoke and E2E tests.
8. Canary rollout to production (Phase 9).
9. Monitor SLOs for 24-48 hours.
10. Publish release notes.

## 5. Hotfix Process

1. Branch from the release tag.
2. Apply minimal fix with regression test.
3. Run targeted CI.
4. Tag patch release.
5. Merge back to `development` and `main`.

## 6. Rollback

- Revert to previous container image digest.
- Restore database from backup if schema changed (backward-compatible migrations preferred).
- Document incident and post-mortem.

## 7. Phase 0 Note

During Phase 0, work lands as direct commits on `development` with no PRs or feature
branches, per the strategic roadmap constraints. Normal branching resumes in Phase 1.

## 8. References

- `CONTRIBUTING.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md`
- `docs/runbooks/incident-response.md`
