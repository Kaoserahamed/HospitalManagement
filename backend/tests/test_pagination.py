"""Pagination contract tests.

Collection endpoints accept ``limit`` (1-500, default 100) and ``offset``
(>= 0). Responses stay JSON arrays, so existing clients keep working while
queries stay bounded.
"""

from typing import Any

from fastapi import APIRouter, Depends, FastAPI
from fastapi.testclient import TestClient

from dependencies.pagination import PaginationParams, get_pagination
from models.appointment import AppointmentStatus
from services.appointment_service import AppointmentService

app = FastAPI()
router = APIRouter()


@router.get("/page")
async def page(pagination: PaginationParams = Depends(get_pagination)):
    return {"limit": pagination.limit, "offset": pagination.offset}


app.include_router(router)
client = TestClient(app)


class TestPaginationDependency:
    def test_defaults(self):
        body = client.get("/page").json()
        assert body == {"limit": 100, "offset": 0}

    def test_custom_values(self):
        body = client.get("/page?limit=10&offset=20").json()
        assert body == {"limit": 10, "offset": 20}

    def test_limit_floor_enforced(self):
        assert client.get("/page?limit=0").status_code == 422

    def test_limit_ceiling_enforced(self):
        # Prevents memory-exhausting unbounded queries via one request.
        assert client.get("/page?limit=501").status_code == 422

    def test_negative_offset_rejected(self):
        assert client.get("/page?offset=-1").status_code == 422

    def test_non_numeric_rejected(self):
        assert client.get("/page?limit=all").status_code == 422


class _FakeAppointmentRepository:
    """Records pagination arguments; returns a canned page."""

    def __init__(self):
        self.calls: list[dict[str, Any]] = []

    async def get_all(self, status=None, limit=None, offset=0):
        self.calls.append({"status": status, "limit": limit, "offset": offset})
        return []


class TestServicePaginationPassthrough:
    async def test_appointment_service_forwards_paging(self):
        repo = _FakeAppointmentRepository()
        service = AppointmentService(
            appointment_repo=repo,
            user_repo=None,
            department_repo=None,
            doctor_repo=None,
            schedule_repo=None,
            patient_repo=None,
        )
        await service.get_all_appointments(status=AppointmentStatus.SCHEDULED, limit=25, offset=50)
        assert repo.calls == [
            {
                "status": AppointmentStatus.SCHEDULED,
                "limit": 25,
                "offset": 50,
            }
        ]

    async def test_appointment_service_defaults_unbounded(self):
        repo = _FakeAppointmentRepository()
        service = AppointmentService(
            appointment_repo=repo,
            user_repo=None,
            department_repo=None,
            doctor_repo=None,
            schedule_repo=None,
            patient_repo=None,
        )
        await service.get_all_appointments()
        assert repo.calls == [{"status": None, "limit": None, "offset": 0}]
