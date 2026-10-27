"""EHR repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class EHRRepository:
    def __init__(self) -> None:
        self._encounters: dict[int, dict] = {}
        self._vitals: dict[int, list[dict]] = {}
        self._diagnoses: dict[int, list[dict]] = {}
        self._labs: dict[int, list[dict]] = {}
        self._prescriptions: dict[int, list[dict]] = {}
        self._counter: int = 0
        self._child_counter: int = 0

    def _next_id(self) -> int:
        self._counter += 1
        return self._counter

    def _next_child_id(self) -> int:
        self._child_counter += 1
        return self._child_counter

    def create_encounter(self, data: dict) -> dict:
        eid = self._next_id()
        record = {"id": eid, **data, "status": data.get("status", "open")}
        self._encounters[eid] = record
        self._vitals[eid] = []
        self._diagnoses[eid] = []
        self._labs[eid] = []
        self._prescriptions[eid] = []
        return dict(record)

    def get_encounter(self, encounter_id: int) -> Optional[dict]:
        record = self._encounters.get(encounter_id)
        return dict(record) if record else None

    def update_encounter(self, encounter_id: int, data: dict) -> dict:
        record = self._encounters.get(encounter_id)
        if record is None:
            raise KeyError(f"Encounter {encounter_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._encounters[encounter_id] = record
        return dict(record)

    def delete_encounter(self, encounter_id: int) -> bool:
        if encounter_id in self._encounters:
            del self._encounters[encounter_id]
            self._vitals.pop(encounter_id, None)
            self._diagnoses.pop(encounter_id, None)
            self._labs.pop(encounter_id, None)
            self._prescriptions.pop(encounter_id, None)
            return True
        return False

    def list_encounters(self, params: PageParams, patient_id: int | None = None, doctor_id: int | None = None) -> PageResult:
        items = list(self._encounters.values())
        if patient_id is not None:
            items = [e for e in items if e.get("patient_id") == patient_id]
        if doctor_id is not None:
            items = [e for e in items if e.get("doctor_id") == doctor_id]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def add_vital(self, encounter_id: int, data: dict) -> dict:
        if encounter_id not in self._encounters:
            raise KeyError(f"Encounter {encounter_id} not found")
        vid = self._next_child_id()
        record = {"id": vid, "encounter_id": encounter_id, **data}
        self._vitals[encounter_id].append(record)
        return dict(record)

    def list_vitals(self, encounter_id: int) -> list[dict]:
        return [dict(v) for v in self._vitals.get(encounter_id, [])]

    def add_diagnosis(self, encounter_id: int, data: dict) -> dict:
        if encounter_id not in self._encounters:
            raise KeyError(f"Encounter {encounter_id} not found")
        did = self._next_child_id()
        record = {"id": did, "encounter_id": encounter_id, **data}
        self._diagnoses[encounter_id].append(record)
        return dict(record)

    def list_diagnoses(self, encounter_id: int) -> list[dict]:
        return [dict(d) for d in self._diagnoses.get(encounter_id, [])]

    def add_lab(self, encounter_id: int, data: dict) -> dict:
        if encounter_id not in self._encounters:
            raise KeyError(f"Encounter {encounter_id} not found")
        lid = self._next_child_id()
        record = {"id": lid, "encounter_id": encounter_id, **data}
        self._labs[encounter_id].append(record)
        return dict(record)

    def list_labs(self, encounter_id: int) -> list[dict]:
        return [dict(l) for l in self._labs.get(encounter_id, [])]

    def add_prescription(self, encounter_id: int, data: dict) -> dict:
        if encounter_id not in self._encounters:
            raise KeyError(f"Encounter {encounter_id} not found")
        pid = self._next_child_id()
        record = {"id": pid, "encounter_id": encounter_id, **data}
        self._prescriptions[encounter_id].append(record)
        return dict(record)

    def list_prescriptions(self, encounter_id: int) -> list[dict]:
        return [dict(p) for p in self._prescriptions.get(encounter_id, [])]

    def count(self) -> int:
        return len(self._encounters)

    def clear(self) -> None:
        self._encounters.clear()
        self._vitals.clear()
        self._diagnoses.clear()
        self._labs.clear()
        self._prescriptions.clear()
        self._counter = 0
        self._child_counter = 0
