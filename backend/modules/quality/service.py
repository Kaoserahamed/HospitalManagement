"""Quality service."""

from __future__ import annotations

from typing import Any

from backend.shared.errors import NotFoundError, ValidationError
from backend.shared.events import default_bus, DomainEvent

from .repository import QualityRepository
from .schemas import BenchmarkCreate, QualityMeasureCreate, QualityResultCreate


class QualityService:
    def __init__(self, repository: QualityRepository | None = None) -> None:
        self.repository = repository or QualityRepository()

    def create_measure(self, data: QualityMeasureCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_measure(payload)
        default_bus.publish(DomainEvent(name="QualityMeasureCreated", payload={"measure_id": record["id"]}))
        return record

    def get_measure(self, measure_id: int) -> dict:
        record = self.repository.get_measure(measure_id)
        if record is None:
            raise NotFoundError("QualityMeasure", measure_id)
        return record

    def list_measures(self, category: str | None = None) -> list[dict]:
        return self.repository.list_measures(category=category)

    def update_measure(self, measure_id: int, data: dict) -> dict:
        return self.repository.update_measure(measure_id, data)

    def record_result(self, data: QualityResultCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if self.repository.get_measure(payload["measure_id"]) is None:
            raise NotFoundError("QualityMeasure", payload["measure_id"])
        record = self.repository.add_result(payload)
        default_bus.publish(DomainEvent(name="QualityResultRecorded", payload={"result_id": record["id"]}))
        # update numerator/denominator
        measure = self.repository.get_measure(payload["measure_id"])
        if measure:
            measure["denominator"] = measure.get("denominator", 0) + 1
            if payload.get("numerator_met"):
                measure["numerator"] = measure.get("numerator", 0) + 1
            self.repository.update_measure(payload["measure_id"], {"numerator": measure["numerator"], "denominator": measure["denominator"]})
        return record

    def list_results(self, measure_id: int | None = None, patient_id: int | None = None) -> list[dict]:
        return self.repository.list_results(measure_id=measure_id, patient_id=patient_id)

    def create_benchmark(self, data: BenchmarkCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_benchmark(payload)
        default_bus.publish(DomainEvent(name="BenchmarkCreated", payload={"benchmark_id": record["id"]}))
        return record

    def list_benchmarks(self, measure_id: int | None = None) -> list[dict]:
        return self.repository.list_benchmarks(measure_id=measure_id)

    def rate(self, measure_id: int) -> float:
        measure = self.get_measure(measure_id)
        denom = measure.get("denominator", 0)
        if denom == 0:
            return 0.0
        return measure.get("numerator", 0) / denom

    def gap(self, measure_id: int) -> float:
        measure = self.get_measure(measure_id)
        r = self.rate(measure_id)
        return measure.get("target", 0.0) - r

    def summary(self, measure_id: int) -> dict:
        measure = self.get_measure(measure_id)
        r = self.rate(measure_id)
        g = self.gap(measure_id)
        benchmarks = self.repository.list_benchmarks(measure_id=measure_id)
        bm = benchmarks[0]["benchmark_value"] if benchmarks else None
        status = "on_track" if r >= measure.get("target", 0) else "behind"
        return {
            "measure_id": measure_id,
            "name": measure["name"],
            "rate": round(r, 3),
            "target": measure.get("target", 0),
            "gap": round(g, 3),
            "status": status,
            "benchmark": bm,
        }

    def all_summaries(self) -> list[dict]:
        return [self.summary(m["id"]) for m in self.list_measures()]

    def top_performers(self, limit: int = 5) -> list[dict]:
        summaries = self.all_summaries()
        summaries.sort(key=lambda x: x["rate"], reverse=True)
        return summaries[:limit]

    def clear(self) -> None:
        self.repository.clear()
