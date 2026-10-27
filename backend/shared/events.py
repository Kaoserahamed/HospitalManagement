"""In-process domain event bus."""

from __future__ import annotations

import logging
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List

logger = logging.getLogger(__name__)

EventHandler = Callable[["DomainEvent"], None]


@dataclass
class DomainEvent:
    """Base domain event."""

    name: str
    payload: dict[str, Any] = field(default_factory=dict)
    occurred_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    correlation_id: str | None = None


class EventBus:
    """Simple synchronous event bus with handler registration."""

    def __init__(self) -> None:
        self._handlers: Dict[str, List[EventHandler]] = defaultdict(list)

    def subscribe(self, event_name: str, handler: EventHandler) -> None:
        self._handlers[event_name].append(handler)

    def unsubscribe(self, event_name: str, handler: EventHandler) -> None:
        if handler in self._handlers[event_name]:
            self._handlers[event_name].remove(handler)

    def publish(self, event: DomainEvent) -> None:
        for handler in list(self._handlers.get(event.name, [])):
            try:
                handler(event)
            except Exception:  # noqa: BLE001 - isolate handler failures
                logger.exception("event handler failed for %s", event.name)
        # wildcard handlers
        for handler in list(self._handlers.get("*", [])):
            try:
                handler(event)
            except Exception:  # noqa: BLE001
                logger.exception("wildcard handler failed for %s", event.name)

    def clear(self) -> None:
        self._handlers.clear()


# Module-level default bus
default_bus = EventBus()


def publish(event_name: str, payload: dict[str, Any] | None = None, correlation_id: str | None = None) -> None:
    default_bus.publish(DomainEvent(name=event_name, payload=payload or {}, correlation_id=correlation_id))
