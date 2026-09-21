"""Standardized API error responses.

Every error response uses the same envelope so clients (and incident
responder) get consistent, machine-readable errors::

    {
        "detail": "Appointment not found",   # human-readable message
        "code": "NOT_FOUND",                 # stable machine-readable code
        "request_id": "a1b2c3..."           # correlation ID for log lookup
    }

``detail`` keeps the pre-existing response shape (the frontend reads
``response.data.detail``); ``code`` and ``request_id`` are additive.
Unhandled exceptions are logged with the correlation ID and traceback but
never leak internals to the client.
"""

from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from core.logging import get_logger, request_id_var

logger = get_logger("errors")

#: Stable error codes by HTTP status; unmapped statuses fall back to
#: ``HTTP_ERROR`` to avoid inventing codes per endpoint.
ERROR_CODE_BY_STATUS = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
    500: "INTERNAL_ERROR",
    503: "SERVICE_UNAVAILABLE",
}


def error_envelope(
    status_code: int,
    message: str,
    details: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Build the standard error response body."""
    body: dict[str, Any] = {
        "detail": message,
        "code": ERROR_CODE_BY_STATUS.get(status_code, "HTTP_ERROR"),
        "request_id": request_id_var.get(),
    }
    if details:
        body["details"] = details
    return body


def _validation_details(exc: RequestValidationError) -> list[dict[str, Any]]:
    """Convert pydantic validation errors into stable client-facing details.

    Only primitive fields are exposed; exception contexts (which may contain
    internal values) are deliberately omitted.
    """
    details = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []))
        details.append(
            {
                "field": location,
                "message": error.get("msg", "invalid value"),
                "type": error.get("type", "value_error"),
            }
        )
    return details


def register_exception_handlers(app: FastAPI) -> None:
    """Attach the standard error contract to an application."""

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "Request failed"
        return JSONResponse(
            status_code=exc.status_code,
            content=error_envelope(exc.status_code, message),
            headers=getattr(exc, "headers", None),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content=error_envelope(
                422, "Request validation failed", details=_validation_details(exc)
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        # Log the full traceback server-side with the correlation ID; the
        # client receives a generic message (no internals leakage).
        logger.error(
            "unhandled exception",
            exc_info=exc,
            extra={
                "http_method": request.method,
                "http_path": request.url.path,
            },
        )
        return JSONResponse(
            status_code=500,
            content=error_envelope(500, "Internal server error"),
        )
