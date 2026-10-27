"""Performance repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class PerformanceRepository:
    def __init__(self) -> None:
        self._metrics: list[dict] = []
        self._slow_queries: list[dict] = []
        self._cache_stats: list[dict] = {}
        self._counters = {"metric": 0, "slow": 0, "cache": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def record_metric(self, data: dict) -> dict:
        mid = self._next("metric")
        record = {"id": mid, **data}
        self._metrics.append(record)
        return dict(record)

    def list_metrics(self, params: PageParams, endpoint: str | None = None) -> PageResult:
        items = list(self._metrics)
        if endpoint is not None:
            items = [m for m in items if m.get("endpoint") == endpoint]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def record_slow_query(self, data: dict) -> dict:
        sid = self._next("slow")
        record = {"id": sid, **data}
        self._slow_queries.append(record)
        return dict(record)

    def list_slow_queries(self, limit: int = 20) -> list[dict]:
        items = sorted(self._slow_queries, key=lambda x: x.get("duration_ms", 0), reverse=True)
        return [dict(q) for q in items[:limit]]

    def record_cache_stats(self, data: dict) -> dict:
        cid = self._next("cache")
        record = {"id": cid, **data}
        self._cache_stats[cid] = record
        return dict(record)

    def list_cache_stats(self, cache_name: str | None = None) -> list[dict]:
        items = list(self._cache_stats.values())
        if cache_name is not None:
            items = [c for c in items if c.get("cache_name") == cache_name]
        return [dict(c) for c in items]

    def clear(self) -> None:
        self._metrics.clear()
        self._slow_queries.clear()
        self._cache_stats.clear()
        for k in self._counters:
            self._counters[k] = 0
