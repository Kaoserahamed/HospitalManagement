#!/usr/bin/env bash
# verify.sh — local verification script mirroring CI quality gates.
#
# Usage:  ./scripts/verify.sh
#
# Exits non-zero on the first failing gate. Each gate prints a header so
# you can see exactly where the pipeline stopped.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

PASS=0
FAIL=0

run_gate() {
  local label="$1"
  local expected="${2:-0}"
  shift 2
  echo "========================================================"
  echo "GATE: $label"
  echo "CMD:  $*"
  echo "========================================================"
  if "$@" >/tmp/verify_output.txt 2>&1; then
    local code=$?
  else
    local code=$?
  fi
  cat /tmp/verify_output.txt | tail -n 20
  if [ "$code" -eq "$expected" ]; then
    echo "  ✔  $label passed (exit $code)"
    PASS=$((PASS + 1))
  else
    echo "  ✗  $label FAILED (exit $code, expected $expected)"
    FAIL=$((FAIL + 1))
  fi
}

# ---------------------------------------------------------------------------
# Backend
# ---------------------------------------------------------------------------
cd "$ROOT_DIR/backend"
run_gate "Backend: ruff check"       0 ruff check .
run_gate "Backend: ruff format --check"  0 ruff format --check .
run_gate "Backend: mypy"             0 mypy .
run_gate "Backend: pytest (unit)"    0 pytest tests/ -m "not integration" --cov --cov-report=term-missing --cov-fail-under=70

# ---------------------------------------------------------------------------
# Frontend
# ---------------------------------------------------------------------------
cd "$ROOT_DIR/frontend"
run_gate "Frontend: npm ci (deps)"   0 npm ci
run_gate "Frontend: eslint"          0 npm run lint
run_gate "Frontend: prettier --check" 0 npx prettier --check .
run_gate "Frontend: tsc --noEmit"    0 npx tsc --noEmit
run_gate "Frontend: build"           0 npm run build
run_gate "Frontend: test (vitest)"   0 npm test -- --run

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "========================================================"
echo "RESULTS: $PASS passed, $FAIL failed"
echo "========================================================"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0