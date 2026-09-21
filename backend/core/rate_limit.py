"""Rate limiting for authentication endpoints.

A per-process sliding-window limiter keyed by client IP. Chosen over a
shared store (Redis) because the current deployment runs a single API
process; limits are therefore per replica. This still rate-limits
credential-stuffing from any single source and bounds token-endpoint
abuse. A distributed limiter should replace this if/when the API scales
to replicas where per-IP budgets must be global (tracked in the threat
model).
"""

import time
from collections import defaultdict, deque

from fastapi import Depends, HTTPException, Request, status

from core.config import settings

#: Upper bound on tracked keys to keep memory bounded behind spoofed IPs.
MAX_TRACKED_KEYS = 10_000


class SlidingWindowLimiter:
    """Fixed-memory sliding-window counter (allow/deny) keyed by string."""

    def __init__(self, max_events: int, window_seconds: float):
        self.max_events = max_events
        self.window_seconds = window_seconds
        self._events: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> bool:
        """Record an event for ``key``; True if within the allowed budget."""
        now = time.monotonic()
        cutoff = now - self.window_seconds
        window = self._events[key]
        while window and window[0] <= cutoff:
            window.popleft()
        if len(window) >= self.max_events:
            return False
        window.append(now)
        self._prune(cutoff)
        return True

    def _prune(self, cutoff: float) -> None:
        """Drop exhausted keys when the table grows beyond its bound."""
        if len(self._events) <= MAX_TRACKED_KEYS:
            return
        stale = [key for key, window in self._events.items() if not window or window[-1] <= cutoff]
        for key in stale:
            del self._events[key]

    def reset(self) -> None:
        self._events.clear()


_login_limiter: SlidingWindowLimiter | None = None


def get_login_rate_limiter() -> SlidingWindowLimiter:
    """Process-wide limiter for credential endpoints (override in tests)."""
    global _login_limiter
    if _login_limiter is None:
        _login_limiter = SlidingWindowLimiter(
            max_events=settings.LOGIN_RATE_LIMIT_MAX,
            window_seconds=settings.LOGIN_RATE_LIMIT_WINDOW_SECONDS,
        )
    return _login_limiter


def login_rate_limit(
    request: Request,
    limiter: SlidingWindowLimiter = Depends(get_login_rate_limiter),
) -> None:
    """FastAPI dependency: throttle login attempts per client IP."""
    key = f"login:{request.client.host if request.client else 'unknown'}"
    if not limiter.check(key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later.",
            headers={"Retry-After": str(int(limiter.window_seconds))},
        )
