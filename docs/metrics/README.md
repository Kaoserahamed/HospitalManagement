# Metrics Artifacts

This directory stores scc (Sloc, Cloc, and Code) snapshots per phase.

## Files

- `baseline.json` — Phase 0 baseline capture.

## Process

1. Run `scc --format json > docs/metrics/phase<N>-exit.json`.
2. Commit the snapshot with the phase exit commit.
3. Update `STRATEGIC_ENGINEERING_ROADMAP.md` with the new totals.

## Targets

- Phase 0: >= 18,788 total lines, >= 71 commits.
- Final: >= 150,000 total lines, >= 250 commits.

## References

- `STRATEGIC_ENGINEERING_ROADMAP.md`
- `docs/phase0-exit-report.md`
