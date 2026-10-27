"""Correlation and request context helpers."""

from __future__ import annotations

import contextvars
import uuid
from typing import Optional

_request_id: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("request_id", default=None)
_trace_id: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("trace_id", default=None)
_actor_id: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("actor_id", default=None)


def new_request_id() -> str:
    return str(uuid.uuid4())


def set_request_id(value: str | None = None) -> str:
    rid = value or new_request_id()
    _request_id.set(rid)
    return rid


def get_request_id() -> str | None:
    return _request_id.get()


def set_trace_id(value: str | None) -> None:
    _trace_id.set(value)


def get_trace_id() -> str | None:
    return _trace_id.get()


def set_actor_id(value: str | None) -> None:
    _actor_id.set(value)


def get_actor_id() -> str | None:
    return _actor_id.get()


def clear_context() -> None:
    _request_id.set(None)
    _trace_id.set(None)
    _actor_id.set(None)


class RequestContext:
    """Context manager for binding request-scoped identifiers."""

    def __init__(self, request_id: str | None = None, trace_id: str | None = None, actor_id: str | None = None) -> None:
        self.request_id = request_id or new_request_id()
        self.trace_id = trace_id
        self.actor_id = actor_id
        self._tokens: list = []

    def __enter__(self) -> "RequestContext":
        self._tokens.append(_request_id.set(self.request_id))
        self._tokens.append(_trace_id.set(self.trace_id))
        self._tokens.append(_actor_id.set(self.actor_id))
        return self

    def __exit__(self, *exc: object) -> None:
        for token in reversed(self._tokens):
            try:
                token.var.reset(token)
            except Exception:
                pass
        self._tokens.clear()
