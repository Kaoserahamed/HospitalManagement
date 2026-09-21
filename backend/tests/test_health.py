"""Health and readiness endpoint contract tests.

- ``/health`` (liveness) must never check dependencies — a database outage
  must not cause cascading restarts.
- ``/ready`` must report per-dependency status and return 503 when any check
  fails, so the orchestrator can pull the instance from load balancing.
"""

from fastapi.testclient import TestClient

import routes.health as health_module
from main import app

client = TestClient(app)


class _FakeSession:
    """Async session stub that succeeds or fails per configuration."""

    def __init__(self, should_fail: bool = False):
        self.should_fail = should_fail

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return None

    async def execute(self, query):
        if self.should_fail:
            raise ConnectionError("database unreachable")
        return None


class TestLiveness:
    def test_health_is_shape_stable(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "healthy",
            "service": "Hospital Management API",
        }

    def test_health_ignores_database_outage(self, monkeypatch):
        # Even with the database down, liveness must stay green.
        monkeypatch.setattr(
            health_module,
            "AsyncSessionLocal",
            lambda: _FakeSession(should_fail=True),
        )
        response = client.get("/health")
        assert response.status_code == 200


class TestReadiness:
    def test_ready_when_database_reachable(self, monkeypatch):
        monkeypatch.setattr(health_module, "AsyncSessionLocal", lambda: _FakeSession())
        response = client.get("/ready")
        assert response.status_code == 200
        body = response.json()
        assert body == {"status": "ready", "checks": {"database": True}}

    def test_not_ready_when_database_down(self, monkeypatch):
        monkeypatch.setattr(
            health_module,
            "AsyncSessionLocal",
            lambda: _FakeSession(should_fail=True),
        )
        response = client.get("/ready")
        assert response.status_code == 503
        body = response.json()
        assert body["status"] == "not_ready"
        assert body["checks"]["database"] is False

    def test_ready_carries_correlation_id(self, monkeypatch):
        monkeypatch.setattr(health_module, "AsyncSessionLocal", lambda: _FakeSession())
        response = client.get("/ready", headers={"X-Request-ID": "readiness-check-12345"})
        assert response.headers["X-Request-ID"] == "readiness-check-12345"
