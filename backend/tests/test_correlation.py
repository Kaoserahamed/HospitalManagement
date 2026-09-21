"""Correlation ID and structured logging contract tests.

The X-Request-ID contract: every response carries the header; valid
client-supplied IDs are echoed; invalid/absent ones are replaced with a
generated ID; all log records emitted during the request carry the ID.
"""

import json
import logging

from fastapi.testclient import TestClient

from core.logging import JsonFormatter, request_id_var
from main import app

client = TestClient(app)


class TestCorrelationIdHeader:
    def test_every_response_has_request_id(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.headers["X-Request-ID"]

    def test_generated_id_is_hex_and_unique(self):
        id_1 = client.get("/health").headers["X-Request-ID"]
        id_2 = client.get("/health").headers["X-Request-ID"]
        assert id_1 != id_2
        assert len(id_1) == 32
        int(id_1, 16)  # must be hexadecimal

    def test_valid_client_id_is_echoed(self):
        response = client.get("/health", headers={"X-Request-ID": "gateway-abc-12345678"})
        assert response.headers["X-Request-ID"] == "gateway-abc-12345678"

    def test_empty_client_id_is_replaced(self):
        response = client.get("/health", headers={"X-Request-ID": ""})
        assert len(response.headers["X-Request-ID"]) == 32

    def test_short_client_id_is_replaced(self):
        response = client.get("/health", headers={"X-Request-ID": "abc"})
        assert response.headers["X-Request-ID"] != "abc"
        assert len(response.headers["X-Request-ID"]) == 32

    def test_unsafe_client_id_is_replaced(self):
        # Header injection / log forging attempts must not be echoed.
        unsafe = "id with spaces\r\ninjected-header: 1"
        response = client.get(
            "/health", headers={"X-Request-ID": unsafe.replace("\r\n", "") + "!!!"}
        )
        returned = response.headers["X-Request-ID"]
        assert returned != unsafe
        assert len(returned) == 32


class TestLoggingCorrelation:
    def test_log_records_carry_request_id(self, caplog):
        with caplog.at_level(logging.INFO):
            client.get("/health", headers={"X-Request-ID": "log-check-12345678"})
        request_records = [r for r in caplog.records if r.getMessage() == "request completed"]
        assert request_records, "expected a 'request completed' log record"
        record = request_records[-1]
        assert record.request_id == "log-check-12345678"
        assert record.http_path == "/health"
        assert record.http_method == "GET"
        assert record.http_status == 200
        assert isinstance(record.duration_ms, float | int)

    def test_logs_are_single_line_json(self, caplog):
        with caplog.at_level(logging.INFO):
            client.get("/health")
        record = [r for r in caplog.records if r.getMessage() == "request completed"][-1]
        # The handler formats JSON; the record itself must serialize cleanly.
        formatted = JsonFormatter().format(record)
        parsed = json.loads(formatted)
        assert parsed["message"] == "request completed"
        assert parsed["request_id"]
        assert parsed["level"] == "INFO"


class TestContextVarBehavior:
    def test_default_request_id_outside_request(self):
        assert request_id_var.get() == "-"

    def test_context_restored_after_request(self):
        client.get("/health")
        assert request_id_var.get() == "-"
