# CI/CD Strategy

## 1. Overview

Extends the Day 3 pipeline into a comprehensive, multi-stage workflow delivered in
Phase 9.

## 2. Stages

1. Lint and format (ruff, eslint, prettier).
2. Typecheck (mypy, tsc).
3. Unit tests (pytest, vitest) with coverage.
4. Integration tests (Testcontainers).
5. Build (Docker images, frontend bundle).
6. Security scan (SAST, dependency audit, secrets).
7. Container scan (Trivy, SBOM).
8. Deploy (staging, then production via canary).

## 3. Triggers

- Pull request: stages 1-6.
- Merge to development: stages 1-7 + staging deploy.
- Tag: full pipeline + production deploy.

## 4. Quality Gates

- All stages green.
- Coverage thresholds met.
- No high/critical vulnerabilities.
- No secrets detected.

## 5. Artifacts

- Docker images (signed).
- Test and coverage reports.
- SBOM (SPDX/CycloneDX).
- Deployment manifests.

## 6. Rollback

- Automated rollback on failed health checks.
- Manual rollback via previous image digest.

## 7. References

- `.github/workflows/ci.yml`
- `DAY3_CI_CD.md` (legacy)
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 9
