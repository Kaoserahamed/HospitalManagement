"""Shared pytest fixtures.

Unit tests run without any external service: environment variables provide
safe defaults so importing the application never requires a live database.
Integration tests (marked ``integration``) run against an ephemeral MySQL
instance in CI.
"""

import os
import pathlib
import sys

# Make backend package imports work regardless of the pytest invocation dir.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))

# Safe defaults for the test process. Individual tests may override these.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_hospital.db")
os.environ.setdefault("SECRET_KEY", "test-only-secret-key-not-for-production-42")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("LOG_LEVEL", "INFO")

import pytest


@pytest.fixture
def clean_env(monkeypatch):
    """Provide an environment baseline for Settings validation tests.

    Removes backend-relevant variables so each test controls the full set.
    """
    relevant = [
        "DATABASE_URL",
        "SECRET_KEY",
        "ALGORITHM",
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "ENVIRONMENT",
        "LOG_LEVEL",
        "CORS_ORIGINS",
        "DB_POOL_SIZE",
        "DB_MAX_OVERFLOW",
    ]
    saved = {key: os.environ.pop(key) for key in relevant if key in os.environ}
    yield
    for key, value in saved.items():
        os.environ[key] = value
