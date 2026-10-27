# Test Data and Factories

## 1. Principles

- Synthetic data only; no real or realistic PHI.
- Deterministic factories for reproducible tests.
- Factories live in `tests/factories/`.

## 2. Factory Pattern

```python
def make_patient(**overrides) -> dict:
    base = {
        "first_name": "Test",
        "last_name": "Patient",
        "dob": "1990-01-01",
        "gender": "unspecified",
    }
    base.update(overrides)
    return base
```

## 3. PHI Safety

- Use obviously fake names (e.g., "Test Patient").
- Use reserved test domains (@example.com).
- Never use real SSNs, insurance numbers, or addresses.

## 4. Database Seeding

- Seed scripts in `backend/seed_*.py`.
- Test fixtures create and tear down data.
- Integration tests use a dedicated test database.

## 5. References

- `docs/testing-strategy.md`
- `backend/tests/conftest.py`
