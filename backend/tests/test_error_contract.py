"""API error contract tests.

Every error response — validation, HTTP exceptions, unhandled failures — must
use the standard envelope: ``detail`` (message), ``code`` (stable machine
code), ``request_id`` (correlation ID). ``detail`` is preserved for frontend
compatibility.
"""

import logging

from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import BaseModel

from core.errors import register_exception_handlers
from core.logging import configure_logging, request_id_var
from core.middleware import CorrelationIdMiddleware


def _build_app() -> TestClient:
    app = FastAPI()
    # Mirror production wiring (main.py): logging, correlation middleware,
    # standardized error handlers.
    configure_logging()
    app.add_middleware(CorrelationIdMiddleware)
    register_exception_handlers(app)

    class Item(BaseModel):
        name: str
        quantity: int

    @app.get("/not-found")
    async def not_found():
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Appointment not found")

    @app.get("/unauthorized")
    async def unauthorized():
        from fastapi import HTTPException

        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.get("/forbidden")
    async def forbidden():
        from fastapi import HTTPException

        raise HTTPException(status_code=403, detail="Access denied")

    @app.post("/items")
    async def create_item(item: Item):
        return item

    @app.get("/boom")
    async def boom():
        raise RuntimeError("database password leaked in exception")  # noqa: S110

    return TestClient(app, raise_server_exceptions=False)


client = _build_app()


class TestHttpExceptionEnvelope:
    def test_404_envelope(self):
        response = client.get("/not-found")
        assert response.status_code == 404
        body = response.json()
        assert body["detail"] == "Appointment not found"
        assert body["code"] == "NOT_FOUND"
        assert body["request_id"] == response.headers["X-Request-ID"]

    def test_401_preserves_www_authenticate_header(self):
        response = client.get("/unauthorized")
        assert response.status_code == 401
        assert response.headers["WWW-Authenticate"] == "Bearer"
        assert response.json()["code"] == "UNAUTHORIZED"

    def test_403_envelope(self):
        response = client.get("/forbidden")
        assert response.json()["code"] == "FORBIDDEN"

    def test_detail_message_preserved_for_frontend(self):
        # The frontend reads err.response.data.detail; the message must match
        # the raised exception so existing UI behavior is unchanged.
        assert client.get("/not-found").json()["detail"] == "Appointment not found"


class TestValidationEnvelope:
    def test_validation_error_envelope(self):
        response = client.post("/items", json={"name": "aspirin"})
        assert response.status_code == 422
        body = response.json()
        assert body["code"] == "VALIDATION_ERROR"
        assert body["detail"] == "Request validation failed"
        assert body["request_id"] == response.headers["X-Request-ID"]
        fields = {entry["field"] for entry in body["details"]}
        # FastAPI prefixes pydantic locations with "body."
        assert any("quantity" in field for field in fields)

    def test_validation_details_are_client_safe(self):
        response = client.post("/items", json={"name": "aspirin", "quantity": "many"})
        entry = response.json()["details"][0]
        assert set(entry.keys()) == {"field", "message", "type"}


class TestUnhandledExceptionEnvelope:
    def test_500_is_generic_and_logged(self, caplog):
        with caplog.at_level(logging.ERROR):
            response = client.get("/boom")
        assert response.status_code == 500
        body = response.json()
        assert body["code"] == "INTERNAL_ERROR"
        assert body["detail"] == "Internal server error"
        # The internal exception message must NOT leak to the client.
        assert "database password" not in response.text
        # ...but must be logged server-side with the correlation ID.
        error_records = [r for r in caplog.records if r.getMessage() == "unhandled exception"]
        assert error_records
        assert error_records[-1].request_id == response.headers["X-Request-ID"]
        assert error_records[-1].exc_info is not None


class TestRequestIdPropagation:
    def test_error_request_id_matches_header_and_context(self):
        response = client.get("/not-found", headers={"X-Request-ID": "err-contract-12345678"})
        body = response.json()
        assert body["request_id"] == "err-contract-12345678"
        assert response.headers["X-Request-ID"] == "err-contract-12345678"

    def test_context_reset_after_error(self):
        client.get("/boom")
        assert request_id_var.get() == "-"
