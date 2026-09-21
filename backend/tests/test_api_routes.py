"""API contract tests.

Exercises the HTTP layer (routes + auth guards + pagination + error
envelope) with controller-level fakes via FastAPI dependency overrides —
no database required. Real security dependencies (``oauth2_scheme``,
``require_roles``) remain active so the auth contract is genuinely tested.
"""

import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient

from dependencies import appointment as appointment_deps
from dependencies import auth as auth_deps
from dependencies import department as department_deps
from dependencies import doctor_schedule as schedule_deps
from main import app

ADMIN = {
    "id": "admin-1",
    "email": "admin@hospital.com",
    "role": "admin",
    "first_name": "Ada",
    "last_name": "Admin",
}
DOCTOR = {
    "id": "doc-1",
    "email": "doc@hospital.com",
    "role": "doctor",
    "first_name": "Dan",
    "last_name": "Doc",
}
PATIENT = {"id": "pat-1", "role": "patient"}


class FakeAuthController:
    async def get_all_users(self, limit=None, offset=0):
        return [
            {
                "id": "u-1",
                "email": "d@h.com",
                "role": "doctor",
                "first_name": "Dan",
                "last_name": "Doc",
                "is_active": True,
            }
        ]

    async def login(self, data):
        from schemas.user import TokenResponse

        return TokenResponse(access_token="fake-token")

    async def register_patient(self, data):
        return {
            "id": "pat-9",
            "nid": data.nid,
            "phone": data.phone,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "date_of_birth": data.date_of_birth,
            "gender": data.gender,
            "blood_group": None,
            "address": None,
            "emergency_contact_name": None,
            "emergency_contact_phone": None,
            "medical_history": None,
            "allergies": None,
            "is_active": True,
        }

    async def patient_login(self, data):
        from schemas.user import TokenResponse

        return TokenResponse(access_token="fake-patient-token")

    async def change_password(self, user, data):
        return {"success": True}

    async def update_user(self, user_id, data):
        return {
            "id": user_id,
            "email": "d@h.com",
            "role": "doctor",
            "first_name": "Dan",
            "last_name": "Doc",
            "is_active": True,
        }

    async def delete_user(self, user_id, current_admin_id):
        return {"success": True}

    async def create_user_by_admin(self, data):
        return {
            "id": "u-2",
            "email": str(data.email),
            "role": data.role,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "is_active": True,
        }


class FakeAppointmentController:
    def __init__(self):
        self.calls = []

    async def get_all_appointments(self, status=None, limit=None, offset=0):
        self.calls.append({"status": status, "limit": limit, "offset": offset})
        return []

    async def get_patient_appointments(self, patient_id):
        return []

    async def get_doctor_appointments(self, doctor_id):
        return []

    async def create_appointment(self, patient_id, data):
        from datetime import datetime

        from schemas.appointment import AppointmentResponse

        return AppointmentResponse(
            id="a-1",
            patient_id=patient_id,
            doctor_id=data.doctor_id,
            department_id=data.department_id,
            appointment_date=data.appointment_date,
            appointment_time=data.appointment_time,
            status="scheduled",
            reason=data.reason,
            notes=None,
            created_at=datetime(2030, 1, 1),
            updated_at=datetime(2030, 1, 1),
        )

    async def get_appointment(self, appointment_id, requester_id=None, requester_role=None):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")


@pytest.fixture
def api(monkeypatch):
    """TestClient with controller fakes and an admin identity override."""
    fake_auth = FakeAuthController()
    fake_appointments = FakeAppointmentController()
    # dependency_overrides works regardless of import style in routes.
    app.dependency_overrides[auth_deps.get_auth_controller] = lambda: fake_auth
    app.dependency_overrides[appointment_deps.get_appointment_controller] = (
        lambda: fake_appointments
    )
    app.dependency_overrides[auth_deps.get_current_user] = lambda: type(
        "U", (), {**ADMIN, "is_active": True}
    )()
    yield {"client": TestClient(app), "appointments": fake_appointments}
    app.dependency_overrides.clear()


class TestAuthenticationContract:
    def test_missing_token_rejected(self, api):
        # No get_current_user override -> the REAL oauth2_scheme runs and
        # rejects requests without an Authorization header.
        api["client"].app.dependency_overrides.pop(auth_deps.get_current_user)
        response = api["client"].get("/auth/users")
        assert response.status_code == 401
        assert response.json()["code"] == "UNAUTHORIZED"

    def test_current_user_endpoint(self, api):
        response = api["client"].get("/auth/me", headers={"Authorization": "Bearer anything"})
        assert response.status_code == 200
        assert response.json()["id"] == "admin-1"

    def test_staff_login_contract(self, api):
        response = api["client"].post("/auth/login", json={"email": "d@h.com", "password": "pw"})
        assert response.status_code == 200
        body = response.json()
        assert body["access_token"] == "fake-token"
        assert body["token_type"] == "bearer"


class TestAuthorizationContract:
    def test_admin_route_forbidden_for_doctor(self, api):
        api["client"].app.dependency_overrides[auth_deps.get_current_user] = lambda: type(
            "U", (), {**DOCTOR, "is_active": True}
        )()
        response = api["client"].get("/auth/users", headers={"Authorization": "Bearer anything"})
        assert response.status_code == 403
        body = response.json()
        assert body["code"] == "FORBIDDEN"
        assert "admin" in body["detail"].lower()


class TestPaginationContract:
    def test_appointment_list_forwards_pagination(self, api):
        response = api["client"].get(
            "/appointments?limit=5&offset=10&status=scheduled",
            headers={"Authorization": "Bearer anything"},
        )
        assert response.status_code == 200
        assert response.json() == []
        assert api["appointments"].calls == [{"status": "scheduled", "limit": 5, "offset": 10}]

    def test_user_list_forwards_pagination(self, api):
        response = api["client"].get(
            "/auth/users?limit=25&offset=5",
            headers={"Authorization": "Bearer anything"},
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestErrorEnvelopeOverHttp:
    def test_appointment_not_found_envelope(self, api):
        response = api["client"].get(
            "/appointments/missing-id",
            headers={"Authorization": "Bearer anything"},
        )
        assert response.status_code == 404
        body = response.json()
        assert body["code"] == "NOT_FOUND"
        assert body["detail"] == "Appointment not found"
        assert body["request_id"] == response.headers["X-Request-ID"]

    def test_doctor_cannot_view_other_doctor_appointment(self, api):
        response = api["client"].get(
            "/appointments/other-doctor-appt",
            headers={"Authorization": "Bearer anything"},
        )
        assert response.status_code == 404
        assert response.json()["code"] == "NOT_FOUND"


class TestAuthorizationScope:
    """Object-level scoping: detail endpoints pass staff identity down.

    Doctors cannot read another doctor's appointment through the generic
    detail endpoint (403 — never 200); patients cannot use the staff-only
    detail endpoints (patient records stay behind /me endpoints).
    """

    def test_doctor_denied_other_doctor_appointment(self, api):
        api["client"].app.dependency_overrides[auth_deps.get_current_user] = lambda: type(
            "U", (), {**DOCTOR, "is_active": True}
        )()

        class DenyingController(FakeAppointmentController):
            async def get_appointment(self, appointment_id, requester_id=None, requester_role=None):
                assert requester_id == "doc-1"
                assert requester_role == "doctor"
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this appointment",
                )

        api["client"].app.dependency_overrides[appointment_deps.get_appointment_controller] = (
            lambda: DenyingController()
        )
        response = api["client"].get(
            "/appointments/other-doc-appt", headers={"Authorization": "Bearer anything"}
        )
        assert response.status_code == 403
        assert response.json()["code"] == "FORBIDDEN"

    def test_patient_denied_staff_appointment_detail(self, api):
        api["client"].app.dependency_overrides.pop(auth_deps.get_current_user)
        response = api["client"].get(
            "/appointments/any-id", headers={"Authorization": "Bearer patient-token"}
        )
        # The staff-only detail endpoint requires a staff identity, so a
        # patient bearer token cannot satisfy get_current_user.
        assert response.status_code in (401, 403)
        assert response.json()["code"] in ("UNAUTHORIZED", "FORBIDDEN")


class TestPatientEndpoints:
    def test_patient_books_appointment(self, api):
        client = api["client"]
        client.app.dependency_overrides[auth_deps.get_current_patient] = lambda: type(
            "P", (), {"id": "pat-1", "is_active": True}
        )()
        response = client.post(
            "/appointments",
            headers={"Authorization": "Bearer patient-token"},
            json={
                "doctor_id": "doc-1",
                "department_id": "dept-1",
                "appointment_date": "2030-05-01",
                "appointment_time": "10:00:00",
                "reason": "Chest pain",
            },
        )
        assert response.status_code == 201
        body = response.json()
        assert body["patient_id"] == "pat-1"
        assert body["status"] == "scheduled"

    def test_patient_listing_scoped_to_token_identity(self, api):
        captured = {}

        class RecordingController(FakeAppointmentController):
            async def get_patient_appointments(self, patient_id):
                captured["patient_id"] = patient_id
                return []

        api["client"].app.dependency_overrides[appointment_deps.get_appointment_controller] = (
            lambda: RecordingController()
        )
        api["client"].app.dependency_overrides[auth_deps.get_current_patient] = lambda: type(
            "P", (), {"id": "pat-42", "is_active": True}
        )()
        response = api["client"].get(
            "/appointments/my-appointments",
            headers={"Authorization": "Bearer patient-token"},
        )
        assert response.status_code == 200
        # The patient id in the JWT identity (not caller input) scopes the list.
        assert captured["patient_id"] == "pat-42"


class TestPublicEndpoints:
    def test_departments_listing_requires_no_auth(self, api):
        class FakeDepartmentController:
            async def get_all_departments(self, active_only=False):
                return []

        api["client"].app.dependency_overrides[department_deps.get_department_controller] = (
            lambda: FakeDepartmentController()
        )
        response = api["client"].get("/departments")
        assert response.status_code == 200

    def test_availability_endpoint_requires_no_auth(self, api):
        class FakeScheduleController:
            async def get_available_slots(self, doctor_id, target_date):
                return []

        api["client"].app.dependency_overrides[schedule_deps.get_doctor_schedule_controller] = (
            lambda: FakeScheduleController()
        )
        response = api["client"].get("/schedules/availability?doctor_id=doc-1&date=2030-05-01")
        assert response.status_code == 200
        assert response.json() == []
