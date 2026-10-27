"""Tests for integration module."""

import pytest

from backend.modules.integration.repository import IntegrationRepository
from backend.modules.integration.service import IntegrationService


@pytest.fixture
def integration():
    return IntegrationService(repository=IntegrationRepository())


def test_create_adapter(integration):
    a = integration.create_adapter({"name": "FHIR Server", "adapter_type": "fhir", "endpoint": "https://fhir.example.com"})
    assert a["name"] == "FHIR Server"


def test_list_adapters(integration):
    integration.create_adapter({"name": "A1", "adapter_type": "hl7", "endpoint": "http://hl7"})
    integration.create_adapter({"name": "A2", "adapter_type": "fhir", "endpoint": "http://fhir"})
    adapters = integration.list_adapters(adapter_type="hl7")
    assert len(adapters) == 1


def test_sync(integration):
    a = integration.create_adapter({"name": "Sync", "adapter_type": "fhir", "endpoint": "http://fhir"})
    log = integration.sync(a["id"])
    assert log["status"] == "completed"


def test_adapter_health(integration):
    a = integration.create_adapter({"name": "Health", "adapter_type": "fhir", "endpoint": "http://fhir"})
    integration.sync(a["id"])
    health = integration.adapter_health(a["id"])
    assert health["status"] == "active"


def test_create_webhook(integration):
    w = integration.create_webhook({"name": "Patient Created", "url": "https://example.com/hook", "events": "patient.created"})
    assert w["name"] == "Patient Created"


def test_trigger_webhook(integration):
    w = integration.create_webhook({"name": "Hook", "url": "https://example.com/hook", "events": "test"})
    delivery = integration.trigger_webhook(w["id"], "test", {"id": 1})
    assert delivery["response_status"] == 200


def test_list_deliveries(integration):
    w = integration.create_webhook({"name": "Hook2", "url": "https://example.com/hook", "events": "test"})
    integration.trigger_webhook(w["id"], "test", {"id": 1})
    deliveries = integration.list_deliveries(webhook_id=w["id"])
    assert len(deliveries) == 1


def test_retry_delivery(integration):
    w = integration.create_webhook({"name": "Hook3", "url": "https://example.com/hook", "events": "test"})
    delivery = integration.trigger_webhook(w["id"], "test", {"id": 1})
    retried = integration.retry_delivery(delivery["id"])
    assert retried["response_status"] == 200


def test_delete_webhook(integration):
    w = integration.create_webhook({"name": "Delete Me", "url": "https://example.com/hook", "events": "test"})
    assert integration.delete_webhook(w["id"]) is True


def test_activate_deactivate(integration):
    a = integration.create_adapter({"name": "Toggle", "adapter_type": "fhir", "endpoint": "http://fhir"})
    integration.deactivate_adapter(a["id"])
    assert integration.get_adapter(a["id"])["status"] == "inactive"
    integration.activate_adapter(a["id"])
    assert integration.get_adapter(a["id"])["status"] == "active"
