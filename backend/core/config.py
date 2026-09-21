"""Application configuration with environment validation.

All configuration comes from environment variables (12-factor). Validation
runs at startup so misconfiguration fails fast with an actionable error
instead of producing a subtly broken runtime (e.g. a weak JWT secret in
production).

Usage:
    from core.config import get_settings
    settings = get_settings()
"""

from functools import lru_cache

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ALLOWED_ENVIRONMENTS = {"local", "test", "staging", "production"}
ALLOWED_LOG_LEVELS = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
ALLOWED_JWT_ALGORITHMS = {"HS256", "HS384", "HS512"}

#: Values that must never be used as SECRET_KEY in a production deployment.
INSECURE_SECRET_MARKERS = {
    "your-secret-key-here-generate-a-secure-random-string",
    "your-secret-key-here",
    "changeme",
    "change-me",
    "insecure-dev-secret",
}

#: Minimum SECRET_KEY length when ENVIRONMENT=production.
PRODUCTION_SECRET_MIN_LENGTH = 32


class Settings(BaseSettings):
    """Validated application settings.

    Required variables must be provided via environment (or a local ``.env``
    file during development); optional variables have safe defaults that are
    rejected in production when insecure.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # -- Application ---------------------------------------------------------
    APP_NAME: str = "Hospital Management System API"
    ENVIRONMENT: str = "local"
    LOG_LEVEL: str = "INFO"

    # -- Database ------------------------------------------------------------
    DATABASE_URL: str
    DB_POOL_SIZE: int = Field(default=5, ge=1, le=50)
    DB_MAX_OVERFLOW: int = Field(default=10, ge=0, le=100)
    DB_POOL_RECYCLE: int = Field(default=3600, ge=1)
    DB_ECHO: bool = False

    # -- Security --------------------------------------------------------------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, ge=5, le=480)
    # Standard JWT claims bound at issue and verified on every decode so that
    # tokens minted by other systems (or with a different issuer key) are
    # rejected even when the signature is valid.
    JWT_ISSUER: str = "hospital-management-api"
    JWT_AUDIENCE: str = "hospital-management-clients"

    # -- Abuse protection ------------------------------------------------------
    # Per-client-IP sliding window applied to credential endpoints. Limits
    # are per API process; a shared store is needed for global budgets.
    LOGIN_RATE_LIMIT_MAX: int = Field(default=10, ge=1, le=1000)
    LOGIN_RATE_LIMIT_WINDOW_SECONDS: int = Field(default=300, ge=1, le=86400)

    # -- CORS ------------------------------------------------------------------
    # Comma-separated list of allowed origins. Must be overridden per
    # environment; production rejects wildcard origins.
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,"
        "https://hospital-frontend-tau-snowy.vercel.app,"
        "https://backend-api-black.vercel.app"
    )

    # -- Derived helpers -------------------------------------------------------
    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    # -- Validation --------------------------------------------------------------
    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in ALLOWED_ENVIRONMENTS:
            raise ValueError(
                f"ENVIRONMENT must be one of {sorted(ALLOWED_ENVIRONMENTS)}, got '{value}'"
            )
        return normalized

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in ALLOWED_LOG_LEVELS:
            raise ValueError(
                f"LOG_LEVEL must be one of {sorted(ALLOWED_LOG_LEVELS)}, got '{value}'"
            )
        return normalized

    @field_validator("ALGORITHM")
    @classmethod
    def validate_algorithm(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in ALLOWED_JWT_ALGORITHMS:
            raise ValueError(
                f"ALGORITHM must be one of {sorted(ALLOWED_JWT_ALGORITHMS)}, got '{value}'"
            )
        return normalized

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        if len(value) < 16:
            raise ValueError("SECRET_KEY must be at least 16 characters long")
        return value

    @field_validator("CORS_ORIGINS")
    @classmethod
    def validate_cors_origins(cls, value: str) -> str:
        origins = [origin.strip() for origin in value.split(",") if origin.strip()]
        if not origins:
            raise ValueError("CORS_ORIGINS must contain at least one origin")
        if any(origin == "*" for origin in origins):
            # Wildcard CORS combined with credentials is never allowed.
            raise ValueError("CORS_ORIGINS must not contain '*'; list explicit origins")
        return value

    @model_validator(mode="after")
    def validate_production_hardening(self) -> "Settings":
        """Reject configuration that is unsafe for a production deployment."""
        if self.is_production:
            if len(self.SECRET_KEY) < PRODUCTION_SECRET_MIN_LENGTH:
                raise ValueError(
                    "SECRET_KEY must be at least "
                    f"{PRODUCTION_SECRET_MIN_LENGTH} characters in production"
                )
            if any(marker in self.SECRET_KEY.lower() for marker in INSECURE_SECRET_MARKERS):
                raise ValueError("SECRET_KEY must not be a known insecure default in production")
        return self


@lru_cache
def get_settings() -> Settings:
    """Return the cached settings instance.

    Cached so that repeated calls across the application share one object;
    tests that need fresh settings can use ``get_settings.cache_clear()``.
    """
    return Settings()  # type: ignore[call-arg]  # pydantic-settings resolves fields from env


# Application-wide settings instance (import-time creation is intentional:
# configuration errors should abort startup, not surface at first request).
settings = get_settings()
