"""DICOM repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class DicomRepository:
    def __init__(self) -> None:
        self._studies: dict[int, dict] = {}
        self._series: dict[int, dict] = {}
        self._instances: dict[int, dict] = {}
        self._counters = {"study": 0, "series": 0, "instance": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_study(self, data: dict) -> dict:
        sid = self._next("study")
        record = {"id": sid, **data}
        self._studies[sid] = record
        return dict(record)

    def get_study(self, study_id: int) -> Optional[dict]:
        record = self._studies.get(study_id)
        return dict(record) if record else None

    def get_study_by_uid(self, uid: str) -> Optional[dict]:
        for record in self._studies.values():
            if record.get("study_instance_uid") == uid:
                return dict(record)
        return None

    def list_studies(self, patient_id: int | None = None) -> list[dict]:
        items = list(self._studies.values())
        if patient_id is not None:
            items = [s for s in items if s.get("patient_id") == patient_id]
        return [dict(s) for s in items]

    def create_series(self, data: dict) -> dict:
        sid = self._next("series")
        record = {"id": sid, **data}
        self._series[sid] = record
        return dict(record)

    def list_series(self, study_id: int) -> list[dict]:
        return [dict(s) for s in self._series.values() if s.get("study_id") == study_id]

    def create_instance(self, data: dict) -> dict:
        iid = self._next("instance")
        record = {"id": iid, **data}
        self._instances[iid] = record
        return dict(record)

    def list_instances(self, series_id: int) -> list[dict]:
        return [dict(i) for i in self._instances.values() if i.get("series_id") == series_id]

    def count_studies(self) -> int:
        return len(self._studies)

    def clear(self) -> None:
        self._studies.clear()
        self._series.clear()
        self._instances.clear()
        for k in self._counters:
            self._counters[k] = 0
