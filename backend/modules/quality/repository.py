"""Quality repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class QualityRepository:
    def __init__(self) -> None:
        self._measures: dict[int, dict] = {}
        self._results: dict[int, dict] = {}
        self._benchmarks: dict[int, dict] = {}
        self._counters = {"measure": 0, "result": 0, "benchmark": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_measure(self, data: dict) -> dict:
        mid = self._next("measure")
        record = {"id": mid, **data}
        self._measures[mid] = record
        return dict(record)

    def get_measure(self, measure_id: int) -> Optional[dict]:
        record = self._measures.get(measure_id)
        return dict(record) if record else None

    def list_measures(self, category: str | None = None) -> list[dict]:
        items = list(self._measures.values())
        if category is not None:
            items = [m for m in items if m.get("category") == category]
        return [dict(m) for m in items]

    def update_measure(self, measure_id: int, data: dict) -> dict:
        record = self._measures.get(measure_id)
        if record is None:
            raise KeyError(f"Measure {measure_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._measures[measure_id] = record
        return dict(record)

    def add_result(self, data: dict) -> dict:
        rid = self._next("result")
        record = {"id": rid, **data}
        self._results[rid] = record
        return dict(record)

    def list_results(self, measure_id: int | None = None, patient_id: int | None = None) -> list[dict]:
        items = list(self._results.values())
        if measure_id is not None:
            items = [r for r in items if r.get("measure_id") == measure_id]
        if patient_id is not None:
            items = [r for r in items if r.get("patient_id") == patient_id]
        return [dict(r) for r in items]

    def create_benchmark(self, data: dict) -> dict:
        bid = self._next("benchmark")
        record = {"id": bid, **data}
        self._benchmarks[bid] = record
        return dict(record)

    def list_benchmarks(self, measure_id: int | None = None) -> list[dict]:
        items = list(self._benchmarks.values())
        if measure_id is not None:
            items = [b for b in items if b.get("measure_id") == measure_id]
        return [dict(b) for b in items]

    def clear(self) -> None:
        self._measures.clear()
        self._results.clear()
        self._benchmarks.clear()
        for k in self._counters:
            self._counters[k] = 0
