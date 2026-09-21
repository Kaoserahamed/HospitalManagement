"""ASGI middleware.

Currently contains the request correlation middleware which assigns/propagates
an ``X-Request-ID`` on every HTTP request and binds it to the logging context.

Implementation note: this is a *pure ASGI* middleware rather than a
``BaseHTTPMiddleware``. BaseHTTPMiddleware executes the downstream application
in a separate task, which breaks contextvar propagation — routes and exception
handlers would not see the correlation ID. Pure ASGI runs in the same task, so
``request_id_var`` is visible everywhere in the request lifecycle.
"""

import json
import re
import time
import uuid

from starlette.datastructures import Headers, MutableHeaders
from starlette.types import ASGIApp, Receive, Scope, Send

from core.errors import error_envelope
from core.logging import get_logger, request_id_var

REQUEST_ID_HEADER = "X-Request-ID"

#: Client-supplied IDs must be short and opaque; anything else is replaced.
_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{8,64}$")

logger = get_logger("middleware")


def _sanitize_request_id(value: str | None) -> str | None:
    """Accept a client-supplied request ID only if it is safe to echo."""
    if value and _REQUEST_ID_PATTERN.fullmatch(value):
        return value
    return None


class CorrelationIdMiddleware:
    """Assign or propagate ``X-Request-ID`` and bind it to the logging context.

    - Incoming ``X-Request-ID`` headers are echoed when syntactically valid
      (load balancers and gateways may generate IDs upstream).
    - Otherwise a random 32-hex-character ID is generated.
    - The ID is attached to every log record emitted while the request runs
      and returned in the response header so clients can quote it in support
      tickets and incident reports.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        request_id = _sanitize_request_id(headers.get(REQUEST_ID_HEADER)) or uuid.uuid4().hex

        token = request_id_var.set(request_id)
        status_code = 500
        response_started = False
        start = time.perf_counter()

        async def send_with_request_id(message) -> None:
            nonlocal status_code, response_started
            if message["type"] == "http.response.start":
                status_code = message["status"]
                response_started = True
                # Echo the ID on the response headers.
                MutableHeaders(scope=message).append(REQUEST_ID_HEADER, request_id)
            await send(message)

        try:
            await self.app(scope, receive, send_with_request_id)
        except Exception as exc:  # noqa: BLE001 - deliberate 500 boundary
            # Unhandled exceptions are logged with the correlation ID and a
            # full traceback, but the client only receives a generic envelope.
            # Handled HERE (not via app.exception_handler(Exception)) because
            # Starlette routes that handler to the outermost server-error
            # middleware, which runs outside the correlation scope — the
            # envelope would lose the request ID and response header.
            logger.error(
                "unhandled exception",
                exc_info=exc,
                extra={
                    "http_method": scope.get("method", ""),
                    "http_path": scope.get("path", ""),
                },
            )
            if not response_started:
                body = json.dumps(error_envelope(500, "Internal server error")).encode()
                await send_with_request_id(
                    {
                        "type": "http.response.start",
                        "status": 500,
                        "headers": [
                            (b"content-type", b"application/json"),
                            (b"content-length", str(len(body)).encode()),
                        ],
                    }
                )
                await send({"type": "http.response.body", "body": body})
                status_code = 500
            else:
                # Response headers already sent; re-raise so the server logs it.
                raise
        finally:
            # Log while the correlation context is still bound, then restore.
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.info(
                "request completed",
                extra={
                    "http_method": scope.get("method", ""),
                    "http_path": scope.get("path", ""),
                    "http_status": status_code,
                    "duration_ms": duration_ms,
                },
            )
            request_id_var.reset(token)
