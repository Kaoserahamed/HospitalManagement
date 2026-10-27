"""Cache domain (in-memory TTL cache)."""

from __future__ import annotations

import time
from typing import Any, Optional


class CacheEntry:
    def __init__(self, value: Any, ttl: int) -> None:
        self.value = value
        self.expires_at = time.time() + ttl

    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class CacheRepository:
    def __init__(self) -> None:
        self._store: dict[str, CacheEntry] = {}

    def get(self, key: str) -> Optional[Any]:
        entry = self._store.get(key)
        if entry is None:
            return None
        if entry.is_expired():
            del self._store[key]
            return None
        return entry.value

    def set(self, key: str, value: Any, ttl: int = 300) -> None:
        self._store[key] = CacheEntry(value, ttl)

    def delete(self, key: str) -> bool:
        return self._store.pop(key, None) is not None

    def clear(self) -> None:
        self._store.clear()

    def has(self, key: str) -> bool:
        return self.get(key) is not None

    def size(self) -> int:
        # purge expired
        expired = [k for k, v in self._store.items() if v.is_expired()]
        for k in expired:
            del self._store[k]
        return len(self._store)

    def keys(self) -> list[str]:
        return list(self._store.keys())

    def purge_expired(self) -> int:
        expired = [k for k, v in self._store.items() if v.is_expired()]
        for k in expired:
            del self._store[k]
        return len(expired)

    def get_or_set(self, key: str, factory, ttl: int = 300) -> Any:
        value = self.get(key)
        if value is None:
            value = factory()
            self.set(key, value, ttl)
        return value

    def increment(self, key: str, amount: int = 1, ttl: int = 300) -> int:
        current = self.get(key)
        if current is None:
            current = 0
        new_value = int(current) + amount
        self.set(key, new_value, ttl)
        return new_value

    def stats(self) -> dict:
        return {"size": self.size(), "keys": self.keys()}
