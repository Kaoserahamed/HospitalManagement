"""Structured logging with request correlation.

Every log record carries ``request_id`` (from the correlation contextvar) and
is emitted as a single-line JSON document so it can be ingested by log
aggregators (CloudWatch, Loki, ELK) without custom parsing.

Local development may set ``ENVIRONMENT=local`` and ``LOG_FORMAT=text`` to get
human-readable output; the JSON format is the default everywhere.
"""

import contextvars
import json
import logging
import sys
from datetime import UTC, datetime

# Correlation ID for the current async task. "-" when logging outside a
# request (startup, background jobs before instrumentation, tests).
request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "request_id", default="-"
)

#: Attribute name attached to every log record.
REQUEST_ID_ATTRIBUTE = "request_id"


class RequestIdFilter(logging.Filter):
    """Attach the current correlation ID to every log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        setattr(record, REQUEST_ID_ATTRIBUTE, request_id_var.get())
        return True


class JsonFormatter(logging.Formatter):
    """Format log records as single-line JSON documents."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.now(UTC).isoformat(timespec="milliseconds"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            REQUEST_ID_ATTRIBUTE: getattr(record, REQUEST_ID_ATTRIBUTE, "-"),
        }
        # Structured extras (path, method, status, duration, ...) if provided.
        standard = set(logging.LogRecord("", 0, "", 0, "", (), None).__dict__) | {
            "asctime", "message", REQUEST_ID_ATTRIBUTE,
        }
        for key, value in record.__dict__.items():
            if key not in standard and not key.startswith("_"):
                payload[key] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, default=str)


class TextFormatter(logging.Formatter):
    """Human-readable formatter for local development."""

    def format(self, record: logging.LogRecord) -> str:
        base = super().format(record)
        return f"{base} [request_id={getattr(record, REQUEST_ID_ATTRIBUTE, '-')}]"


def get_logger(name: str) -> logging.Logger:
    """Return a namespaced application logger."""
    if not name.startswith("hospital."):
        name = f"hospital.{name}" if name else "hospital"
    return logging.getLogger(name)


def configure_logging(level: str = "INFO", json_format: bool = True) -> None:
    """Configure root logging once; safe to call multiple times.

    Args:
        level: Logging level name (validated by Settings).
        json_format: Emit JSON (default, production) or human-readable text.
    """
    root = logging.getLogger()
    # Remove previously configured handlers so repeated calls are idempotent
    # (important for tests and for ASGI reload workers).
    for handler in list(root.handlers):
        if getattr(handler, "_hospital_management", False):
            root.removeHandler(handler)

    handler = logging.StreamHandler(sys.stdout)
    handler._hospital_management = True  # type: ignore[attr-defined]
    handler.setFormatter(JsonFormatter() if json_format else TextFormatter())
    handler.addFilter(RequestIdFilter())

    root.addHandler(handler)
    root.setLevel(level)

    # Align uvicorn loggers with the application format.
    for name in ("uvicorn", "uvicorn.access", "uvicorn.error"):
        logger = logging.getLogger(name)
        logger.handlers = []
        logger.propagate = True
