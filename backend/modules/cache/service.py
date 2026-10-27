"""Cache service."""

from __future__ import annotations

from typing import Any, Callable, Optional

from .repository import CacheRepository


class CacheService:
    def __init__(self, repository: CacheRepository | None = None) -> None:
        self.repository = repository or CacheRepository()

    def get(self, key: str) -> Optional[Any]:
        return self.repository.get(key)

    def set(self, key: str, value: Any, ttl: int = 300) -> None:
        self.repository.set(key, value, ttl)

    def delete(self, key: str) -> bool:
        return self.repository.delete(key)

    def clear(self) -> None:
        self.repository.clear()

    def has(self, key: str) -> bool:
        return self.repository.has(key)

    def size(self) -> int:
        return self.repository.size()

    def keys(self) -> list[str]:
        return self.repository.keys()

    def purge_expired(self) -> int:
        return self.repository.purge_expired()

    def get_or_set(self, key: str, factory: Callable, ttl: int = 300) -> Any:
        return self.repository.get_or_set(key, factory, ttl)

    def increment(self, key: str, amount: int = 1, ttl: int = 300) -> int:
        return self.repository.increment(key, amount, ttl)

    def stats(self) -> dict:
        return self.repository.stats()

    def remember(self, key: str, ttl: int = 300):
        def decorator(func: Callable):
            def wrapper(*args, **kwargs):
                cached = self.get(key)
                if cached is not None:
                    return cached
                result = func(*args, **kwargs)
                self.set(key, result, ttl)
                return result
            return wrapper
        return decorator
