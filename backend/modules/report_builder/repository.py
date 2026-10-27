"""Report builder repository."""

from __future__ import annotations

from typing import Optional

from backend.shared.pagination import PageParams, PageResult, paginate


class ReportBuilderRepository:
    def __init__(self) -> None:
        self._templates: dict[int, dict] = {}
        self._schedules: dict[int, dict] = {}
        self._exports: dict[int, dict] = {}
        self._dashboards: dict[int, dict] = {}
        self._counters = {"template": 0, "schedule": 0, "export": 0, "dashboard": 0}

    def _next(self, key: str) -> int:
        self._counters[key] += 1
        return self._counters[key]

    def create_template(self, data: dict) -> dict:
        tid = self._next("template")
        record = {"id": tid, **data, "is_active": data.get("is_active", True)}
        self._templates[tid] = record
        return dict(record)

    def get_template(self, template_id: int) -> Optional[dict]:
        record = self._templates.get(template_id)
        return dict(record) if record else None

    def list_templates(self, active_only: bool = False) -> list[dict]:
        items = list(self._templates.values())
        if active_only:
            items = [t for t in items if t.get("is_active")]
        return [dict(t) for t in items]

    def update_template(self, template_id: int, data: dict) -> dict:
        record = self._templates.get(template_id)
        if record is None:
            raise KeyError(f"Template {template_id} not found")
        record.update({k: v for k, v in data.items() if v is not None})
        self._templates[template_id] = record
        return dict(record)

    def delete_template(self, template_id: int) -> bool:
        return self._templates.pop(template_id, None) is not None

    def create_schedule(self, data: dict) -> dict:
        sid = self._next("schedule")
        record = {"id": sid, **data, "is_active": data.get("is_active", True)}
        self._schedules[sid] = record
        return dict(record)

    def get_schedule(self, schedule_id: int) -> Optional[dict]:
        record = self._schedules.get(schedule_id)
        return dict(record) if record else None

    def list_schedules(self, template_id: int | None = None, active_only: bool = False) -> list[dict]:
        items = list(self._schedules.values())
        if template_id is not None:
            items = [s for s in items if s.get("template_id") == template_id]
        if active_only:
            items = [s for s in items if s.get("is_active")]
        return [dict(s) for s in items]

    def create_export(self, data: dict) -> dict:
        eid = self._next("export")
        record = {"id": eid, **data, "status": data.get("status", "pending"), "row_count": 0}
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

    def list_exports(self, template_id: int | None = None) -> list[dict]:
        items = list(self._exports.values())
        if template_id is not None:
            items = [e for e in items if e.get("template_id") == template_id]
        return [dict(e) for e in items]

    def create_dashboard(self, data: dict) -> dict:
        did = self._next("dashboard")
        record = {"id": did, **data, "is_default": data.get("is_default", False)}
        self._dashboards[did] = record
        return dict(record)

    def get_dashboard(self, dashboard_id: int) -> Optional[dict]:
        record = self._dashboards.get(dashboard_id)
        return dict(record) if record else None

    def list_dashboards(self) -> list[dict]:
        return [dict(d) for d in self._dashboards.values()]

    def default_dashboard(self) -> Optional[dict]:
        for record in self._dashboards.values():
            if record.get("is_default"):
                return dict(record)
        return None

    def clear(self) -> None:
        self._templates.clear()
        self._schedules.clear()
        self._exports.clear()
        self._dashboards.clear()
        for k in self._counters:
            self._counters[k] = 0
