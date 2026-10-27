"""Performance service."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from backend.shared.errors import NotFoundError
from backend.shared.events import default_bus, DomainEvent
from backend.shared.pagination import PageParams, PageResult

from .repository import PerformanceRepository
from .schemas import CacheStatsCreate, PerformanceMetricCreate, SlowQueryCreate


class PerformanceService:
    def __init__(self, repository: PerformanceRepository | None = None) -> None:
        self.repository = repository or PerformanceRepository()

    def record_metric(self, data: PerformanceMetricCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.record_metric(payload)
        default_bus.publish(DomainEvent(name="PerformanceMetricRecorded", payload={"metric_id": record["id"]}))
        return record

    def list_metrics(self, params: PageParams, endpoint: str | None = None) -> PageResult:
        return self.repository.list_metrics(params, endpoint=endpoint)

    def record_slow_query(self, data: SlowQueryCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.record_slow_query(payload)
        default_bus.publish(DomainEvent(name="SlowQueryRecorded", payload={"query_id": record["id"]}))
        return record

    def list_slow_queries(self, limit: int = 20) -> list[dict]:
        return self.repository.list_slow_queries(limit=limit)

    def record_cache_stats(self, data: CacheStatsCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.record_cache_stats(payload)
        return record

    def list_cache_stats(self, cache_name: str | None = None) -> list[dict]:
        return self.repository.list_cache_stats(cache_name=cache_name)

    def summary(self, endpoint: str | None = None) -> list[dict]:
        params = PageParams(page=1, per_page=10000)
        result = self.repository.list_metrics(params, endpoint=endpoint)
        items = list(result.items)
        # group by endpoint
        groups: dict[str, list] = {}
        for m in items:
            groups.setdefault(m.get("endpoint", "unknown"), []).append(m)
        summaries = []
        for ep, ms in groups.items():
            durations = [m.get("duration_ms", 0) for m in ms]
            errors = [m for m in ms if m.get("status_code", 200) >= 400]
            import statistics
            avg = statistics.mean(durations) if durations else 0.0
            p95 = sorted(durations)[int(len(durations) * 0.95)] if durations else 0.0
            summaries.append({
                "endpoint": ep,
                "request_count": len(ms),
                "avg_duration_ms": round(avg, 2),
                "p95_duration_ms": round(p95, 2),
                "error_rate": round(len(errors) / len(ms), 3) if ms else 0.0,
            })
        return summaries

    def slowest_endpoints(self, limit: int = 5) -> list[dict]:
        summaries = self.summary()
        summaries.sort(key=lambda x: x["p95_duration_ms"], reverse=True)
        return summaries[:limit]

    def cache_hit_rate(self, cache_name: str) -> float:
        stats = self.repository.list_cache_stats(cache_name=cache_name)
        if not stats:
            return 0.0
        latest = stats[-1]
        hits = latest.get("hits", 0)
        misses = latest.get("misses", 0)
        total = hits + misses
        return hits / total if total > 0 else 0.0

    def profile_function(self, func_name: str, call_count: int, total_time_ms: float) -> dict:
        return {
            "function_name": func_name,
            "call_count": call_count,
            "total_time_ms": total_time_ms,
            "avg_time_ms": total_time_ms / call_count if call_count > 0 else 0.0,
        }

    def top_slow_queries(self, limit: int = 10) -> list[dict]:
        return self.repository.list_slow_queries(limit=limit)

    def clear(self) -> None:
        self.repository.clear()
