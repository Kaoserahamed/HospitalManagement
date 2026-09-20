"""Configuration contract tests.

These tests define the configuration surface of the application: which
variables exist, what validation applies, and which combinations are rejected.
A misconfigured deployment must fail at startup, never at runtime.
"""

import pytest
from pydantic import ValidationError

from core import config


def _build_settings(monkeypatch, **overrides):
    """Construct a Settings object from a controlled environment."""
    base = {
        "DATABASE_URL": "mysql+asyncmy://user:pass@localhost:3306/hospital_db",
        "SECRET_KEY": "a-sufficiently-long-secret-key-for-testing",
        "ALGORITHM": "HS256",
        "ACCESS_TOKEN_EXPIRE_MINUTES": "60",
        "ENVIRONMENT": "local",
        "LOG_LEVEL": "INFO",
        "CORS_ORIGINS": "http://localhost:3000",
    }
    base.update(overrides)
    for key, value in base.items():
        monkeypatch.setenv(key, value)
    return config.Settings()


class TestEnvironmentValidation:
    def test_valid_environment_accepted(self, monkeypatch):
        assert _build_settings(monkeypatch, ENVIRONMENT="Production").ENVIRONMENT == "production"

    @pytest.mark.parametrize("bad", ["dev", "prod", ""])
    def test_invalid_environment_rejected(self, monkeypatch, bad):
        with pytest.raises(ValidationError, match="ENVIRONMENT"):
            _build_settings(monkeypatch, ENVIRONMENT=bad)

    @pytest.mark.parametrize("level", ["debug", "Info", "WARNING"])
    def test_log_level_normalized(self, monkeypatch, level):
        assert _build_settings(monkeypatch, LOG_LEVEL=level).LOG_LEVEL == level.upper()

    def test_invalid_log_level_rejected(self, monkeypatch):
        with pytest.raises(ValidationError, match="LOG_LEVEL"):
            _build_settings(monkeypatch, LOG_LEVEL="VERBOSE")


class TestSecurityValidation:
    def test_valid_algorithm_accepted(self, monkeypatch):
        assert _build_settings(monkeypatch, ALGORITHM="hs256").ALGORITHM == "HS256"

    def test_unsupported_algorithm_rejected(self, monkeypatch):
        # Prevents an operator typo from silently weakening token signing.
        with pytest.raises(ValidationError, match="ALGORITHM"):
            _build_settings(monkeypatch, ALGORITHM="HS999")

    @pytest.mark.parametrize("algo", ["none", "RS256"])
    def test_algorithm_confusion_prevented(self, monkeypatch, algo):
        # HS whitelist blocks JWT algorithm-confusion attacks via env config.
        with pytest.raises(ValidationError, match="ALGORITHM"):
            _build_settings(monkeypatch, ALGORITHM=algo)

    def test_short_secret_rejected(self, monkeypatch):
        with pytest.raises(ValidationError, match="SECRET_KEY"):
            _build_settings(monkeypatch, SECRET_KEY="short")

    def test_production_requires_long_secret(self, monkeypatch):
        with pytest.raises(ValidationError, match="production"):
            _build_settings(monkeypatch, ENVIRONMENT="production", SECRET_KEY="x" * 20)

    def test_production_rejects_known_insecure_marker(self, monkeypatch):
        with pytest.raises(ValidationError, match="insecure default"):
            _build_settings(
                monkeypatch,
                ENVIRONMENT="production",
                SECRET_KEY="ChangeMe-ChangeMe-ChangeMe-ChangeMe-01",
            )

    def test_production_accepts_strong_secret(self, monkeypatch):
        settings = _build_settings(monkeypatch, ENVIRONMENT="production", SECRET_KEY="x" * 40)
        assert settings.is_production

    def test_token_expiry_bounded(self, monkeypatch):
        with pytest.raises(ValidationError):
            _build_settings(monkeypatch, ACCESS_TOKEN_EXPIRE_MINUTES="100000")


class TestCorsValidation:
    def test_cors_origin_list_parsed(self, monkeypatch):
        settings = _build_settings(
            monkeypatch,
            CORS_ORIGINS="http://a.com, http://b.com ,http://c.com",
        )
        assert settings.cors_origin_list == ["http://a.com", "http://b.com", "http://c.com"]

    def test_wildcard_cors_rejected(self, monkeypatch):
        # Wildcard + credentials is a dangerous combination; must never load.
        with pytest.raises(ValidationError, match="CORS_ORIGINS"):
            _build_settings(monkeypatch, CORS_ORIGINS="*")

    def test_empty_cors_rejected(self, monkeypatch):
        with pytest.raises(ValidationError, match="CORS_ORIGINS"):
            _build_settings(monkeypatch, CORS_ORIGINS=",")


class TestDatabaseValidation:
    def test_pool_size_bounds(self, monkeypatch):
        with pytest.raises(ValidationError):
            _build_settings(monkeypatch, DB_POOL_SIZE="0")
        settings = _build_settings(monkeypatch, DB_POOL_SIZE="10")
        assert settings.DB_POOL_SIZE == 10

    def test_database_url_required(self, monkeypatch, clean_env):
        monkeypatch.setenv("SECRET_KEY", "a-sufficiently-long-secret-key-for-testing")
        with pytest.raises(ValidationError, match="DATABASE_URL"):
            config.Settings()


class TestSettingsCaching:
    def test_get_settings_is_cached(self):
        first = config.get_settings()
        second = config.get_settings()
        assert first is second

    def test_module_settings_usable(self):
        # The application imports `settings` directly; it must be a Settings.
        from core.config import settings

        assert settings.DATABASE_URL


class TestDefaults:
    def test_defaults_are_development_safe(self, clean_env, monkeypatch):
        """A fresh clone with only required vars set must boot in local mode."""
        monkeypatch.setenv("DATABASE_URL", "mysql+asyncmy://u:p@localhost/hospital_db")
        monkeypatch.setenv("SECRET_KEY", "a-sufficiently-long-secret-key-for-testing")
        settings = config.Settings()
        assert settings.ENVIRONMENT == "local"
        assert settings.LOG_LEVEL == "INFO"
        assert "http://localhost:3000" in settings.cors_origin_list
