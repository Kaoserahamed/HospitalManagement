"""ASGI middleware.

Currently contains the request correlation middleware which assigns/propagates
an ``X-Request-ID`` on every HTTP request and binds it to the logging context.
"""

import re
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from core.logging import get_logger, request_id_var

REQUEST_ID_HEADER = "X-Request-ID"

#: Client-supplied IDs must be short and opaque; anything else is replaced.
_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{8,64}$")

logger = get_logger(__name__)


def _sanitize_request_id(value: str | None) -> str | None:
    """Accept a client-supplied request ID only if it is safe to echo."""
    if value and _REQUEST_ID_PATTERN.fullmatch(value):
        return value
    return None


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Assign or propagate ``X-Request-ID`` and bind it to the logging context.

    - Incoming ``X-Request-ID`` headers are echoed when syntactically valid
      (load balancers and gateways may generate IDs upstream).
    - Otherwise a random 32-hex-character ID is generated.
    - The ID is attached to every log record emitted while the request runs
      and returned in the response header so clients can quote it in support
      tickets and incident reports.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = _sanitize_request_id(
            request.headers.get(REQUEST_ID_HEADER)
        ) or uuid.uuid4().hex

        token = request_id_var.set(request_id)
        start = time.perf_counter()
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.info(
                "request completed",
                extra={
                    "http_method": request.method,
                    "http_path": request.url.path,
                    "http_status": status_code,
                    "duration_ms": duration_ms,
                },
            )
            response.headers[REQUEST_ID_HEADER] = request_id
            return response
        finally:
            # Restores the parent context even when an exception escapes,
            # so error handlers still log under the same request ID.
            request_id_var.reset(token)
