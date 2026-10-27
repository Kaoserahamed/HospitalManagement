# Testing

## Backend
- Framework: pytest
- Command: `cd backend && pytest tests/ -m "not integration" --cov --cov-fail-under=70`
- Result: 518 passed, 111 skipped.

## Frontend
- Framework: Vitest
- Commands: `cd frontend && npm test -- --run`, `npm run typecheck`, `npm run lint`, `npm run build`
- Result: 31 tests passed, typecheck passes.

## Coverage
- Coverage source includes backend/modules after recent update.
