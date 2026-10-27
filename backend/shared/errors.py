"""Shared error types and HTTP exception helpers."""

from __future__ import annotations

from typing import Any


class DomainError(Exception):
    """Base class for domain-level errors."""

    def __init__(self, message: str, code: str = "DOMAIN_ERROR", details: Any = None) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details


class NotFoundError(DomainError):
    def __init__(self, resource: str, identifier: Any = None) -> None:
        super().__init__(
            message=f"{resource} not found",
            code="NOT_FOUND",
            details={"resource": resource, "id": identifier},
        )


class ConflictError(DomainError):
    def __init__(self, message: str, details: Any = None) -> None:
        super().__init__(message=message, code="CONFLICT", details=details)


class ValidationError(DomainError):
    def __init__(self, message: str, details: Any = None) -> None:
        super().__init__(message=message, code="VALIDATION_ERROR", details=details)


class PermissionDeniedError(DomainError):
    def __init__(self, message: str = "Permission denied", details: Any = None) -> None:
        super().__init__(message=message, code="PERMISSION_DENIED", details=details)


class UnauthorizedError(DomainError):
    def __init__(self, message: str = "Unauthorized", details: Any = None) -> None:
        super().__init__(message=message, code="UNAUTHORIZED", details=details)


def error_envelope(code: str, message: str, details: Any = None) -> dict:
    """Standard error response envelope."""
    return {"error": {"code": code, "message": message, "details": details}}


def http_status_for(error: DomainError) -> int:
    """Map a domain error to an HTTP status code."""
    mapping = {
        "NOT_FOUND": 404,
        "CONFLICT": 409,
        "VALIDATION_ERROR": 422,
        "PERMISSION_DENIED": 403,
        "UNAUTHORIZED": 401,
    }
    return mapping.get(error.code, 400)
