"""Rate-limiting tests: limiter unit behaviour and the HTTP 429 contract."""

import pytest
from fastapi.testclient import TestClient

import dependencies.auth as auth_deps
from core.rate_limit import SlidingWindowLimiter, get_login_rate_limiter
from main import app
from schemas.user import TokenResponse


class FakeAuthController:
    async def login(self, data):
        return TokenResponse(access_token="fake-token")

    async def patient_login(self, data):
        return TokenResponse(access_token="fake-patient-token")


@pytest.fixture
def client():
    app.dependency_overrides[auth_deps.get_auth_controller] = lambda: FakeAuthController()
    yield TestClient(app)
    app.dependency_overrides.clear()


def _override_limiter(max_events=3):
    limiter = SlidingWindowLimiter(max_events=max_events, window_seconds=3600)
    app.dependency_overrides[get_login_rate_limiter] = lambda: limiter


class TestSlidingWindowLimiter:
    def test_allows_under_limit(self):
        limiter = SlidingWindowLimiter(max_events=3, window_seconds=60)
        assert all(limiter.check("ip-1") for _ in range(3))

    def test_denies_at_limit(self):
        limiter = SlidingWindowLimiter(max_events=3, window_seconds=60)
        for _ in range(3):
            limiter.check("ip-1")
        assert limiter.check("ip-1") is False

    def test_keys_are_independent(self):
        limiter = SlidingWindowLimiter(max_events=1, window_seconds=60)
        assert limiter.check("ip-1") is True
        assert limiter.check("ip-2") is True
        assert limiter.check("ip-1") is False

    def test_window_expiry_restores_budget(self, monkeypatch):
        import core.rate_limit as rl

        fake_clock = {"now": 1000.0}
        monkeypatch.setattr(rl.time, "monotonic", lambda: fake_clock["now"])
        limiter = SlidingWindowLimiter(max_events=1, window_seconds=60)
        assert limiter.check("ip-1") is True
        assert limiter.check("ip-1") is False
        fake_clock["now"] += 61  # window elapsed
        assert limiter.check("ip-1") is True

    def test_reset_clears_state(self):
        limiter = SlidingWindowLimiter(max_events=1, window_seconds=60)
        limiter.check("ip-1")
        limiter.reset()
        assert limiter.check("ip-1") is True


class TestLoginRateLimitContract:
    def test_staff_login_throttled_after_limit(self, client):
        _override_limiter(max_events=3)
        for _ in range(3):
            response = client.post(
                "/auth/login",
                json={"email": "staff@hospital.com", "password": "whatever"},
            )
            assert response.status_code == 200
        throttled = client.post(
            "/auth/login",
            json={"email": "staff@hospital.com", "password": "whatever"},
        )
        assert throttled.status_code == 429
        body = throttled.json()
        assert body["code"] == "RATE_LIMITED"
        assert throttled.headers["Retry-After"] == "3600"

    def test_patient_login_throttled_after_limit(self, client):
        _override_limiter(max_events=2)
        payload = {"nid": "123456789", "phone": "01700000000"}
        for _ in range(2):
            assert client.post("/auth/patients/login", json=payload).status_code == 200
        throttled = client.post("/auth/patients/login", json=payload)
        assert throttled.status_code == 429
        assert throttled.json()["code"] == "RATE_LIMITED"

    def test_other_endpoints_unaffected(self, client):
        _override_limiter(max_events=0)  # deny every login attempt
        response = client.get("/auth/me", headers={"Authorization": "Bearer anything"})
        # /auth/me is not rate limited; its 401 comes from the token guard,
        # proving the limiter only applies to credential endpoints.
        assert response.status_code == 401
        assert response.json()["code"] == "UNAUTHORIZED"

    def test_real_dependency_built_from_settings(self):
        # The production singleton derives its budget from validated settings.
        limiter = get_login_rate_limiter()
        assert limiter.max_events >= 1
        assert limiter.window_seconds >= 1
        assert get_login_rate_limiter() is limiter  # singleton, state preserved
