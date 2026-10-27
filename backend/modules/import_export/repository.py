"""Import/Export repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class ImportExportRepository:
    def __init__(self) -> None:
        self._imports: dict[int, dict] = {}
        self._exports: dict[int, dict] = {}
        self._counters = {"import": 0, "export": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_import(self, data: dict) -> dict:
        iid = self._next("import")
        record = {"id": iid, **data, "status": data.get("status", "pending")}
        self._imports[iid] = record
        return dict(record)

    def get_import(self, import_id: int) -> Optional[dict]:
        record = self._imports.get(import_id)
        return dict(record) if record else None

    def update_import(self, import_id: int, data: dict) -> dict:
        record = self._imports.get(import_id)
        if record is None:
            raise KeyError(f"Import {import_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._imports[import_id] = record
        return dict(record)

    def list_imports(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._imports.values())
        if entity_type is not None:
            items = [i for i in items if i.get("entity_type") == entity_type]
        if status is not None:
            items = [i for i in items if i.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def create_export(self, data: dict) -> dict:
        eid = self._next("export")
        record = {"id": eid, **data, "status": data.get("status", "pending")}
        self._exports[eid] = record
        return dict(record)

    def get_export(self, export_id: int) -> Optional[dict]:
        record = self._exports.get(export_id)
        return dict(record) if record else None

    def update_export(self, export_id: int, data: dict) -> dict:
        record = self._exports.get(export_id)
        if record is None:
            raise KeyError(f"Export {export_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._exports[export_id] = record
        return dict(record)

    def list_exports(self, params: PageParams, entity_type: str | None = None, status: str | None = None) -> PageResult:
        items = list(self._exports.values())
        if entity_type is not None:
            items = [e for e in items if e.get("entity_type") == entity_type]
        if status is not None:
            items = [e for e in items if e.get("status") == status]
        total = len(items)
        page_items = items[params.offset:params.offset + params.limit]
        return paginate(page_items, params, total)

    def clear(self) -> None:
        self._imports.clear()
        self._exports.clear()
        for k in self._counters:
            self._counters[k] = 0
