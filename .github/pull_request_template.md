# Pull Request

## Summary

<!-- What does this change do, in 1-3 sentences? -->

## Type of Change

- [ ] `feat` — new functionality
- [ ] `fix` — bug fix
- [ ] `test` — test-only change
- [ ] `docs` — documentation
- [ ] `refactor` — no behavior change
- [ ] `chore` — tooling / dependencies / governance
- [ ] `security` — security hardening
- [ ] `build` / `ci` / `cd` — build, CI, or deployment pipeline

## Related Issues

<!-- e.g. Closes #12 -->

## What Changed & Why

<!-- Files/areas changed and the engineering reason. Preserve existing
     functionality unless the change is required for correctness, security,
     testability, or production readiness. -->

## Testing

- [ ] Backend tests added/updated (`pytest`)
- [ ] Frontend tests added/updated (`npm test`) — if UI changed
- [ ] Integration tests considered — if data/API behavior changed
- [ ] `./scripts/verify.sh` passes locally

## Security & Data Considerations

- [ ] No secrets, credentials, or `.env` files committed
- [ ] Auth/authorization behavior unchanged or improved — if touched, threat model reviewed
- [ ] No new PHI exposure paths introduced

## Documentation

- [ ] README / `docs/` updated to match behavior
- [ ] `CHANGELOG.md` updated (user-visible changes)

## Checklist

- [ ] Small, logical, conventional commits
- [ ] CI is green (all quality gates)
- [ ] No weakening of tests, coverage thresholds, or security checks
