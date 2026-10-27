"""Tests for lab, coding, checkin, reporting, notification, queue, cache, search modules."""

import pytest
from datetime import datetime

from backend.modules.lab.repository import LabRepository
from backend.modules.lab.service import LabService
from backend.modules.coding.repository import CodingRepository
from backend.modules.coding.service import CodingService
from backend.modules.checkin.repository import CheckInRepository
from backend.modules.checkin.service import CheckInService
from backend.modules.reporting.repository import ReportingRepository
from backend.modules.reporting.service import ReportingService
from backend.modules.notification.repository import NotificationRepository
from backend.modules.notification.service import NotificationService
from backend.modules.queue.repository import QueueRepository
from backend.modules.queue.service import QueueService
from backend.modules.cache.repository import CacheRepository
from backend.modules.cache.service import CacheService
from backend.modules.search.service import SearchService


@pytest.fixture
def lab():
    return LabService(repository=LabRepository())


@pytest.fixture
def coding():
    return CodingService(repository=CodingRepository())


@pytest.fixture
def checkin():
    return CheckInService(repository=CheckInRepository())


@pytest.fixture
def reporting():
    return ReportingService(repository=ReportingRepository())


@pytest.fixture
def notif():
    return NotificationService(repository=NotificationRepository())


@pytest.fixture
def queue():
    return QueueService(repository=QueueRepository())


@pytest.fixture
def cache():
    return CacheService(repository=CacheRepository())


@pytest.fixture
def search():
    return SearchService()


# Lab
def test_lab_create_order(lab):
    o = lab.create_order({"patient_id": 1, "ordering_provider": 1, "test_code": "CBC", "test_name": "Complete Blood Count"})
    assert o["status"] == "ordered"


def test_lab_collect_and_result(lab):
    o = lab.create_order({"patient_id": 1, "ordering_provider": 1, "test_code": "GLU", "test_name": "Glucose"})
    lab.collect_sample(o["id"])
    result = lab.add_result({"order_id": o["id"], "value": "95", "unit": "mg/dL"})
    assert result["value"] == "95"


def test_lab_panel_order(lab):
    panel = lab.create_panel({"name": "BMP", "tests": "GLU,BUN,CREAT"})
    orders = lab.order_panel(panel["id"], 1, 1)
    assert len(orders) == 3


# Coding
def test_add_code(coding):
    c = coding.add_code({"system": "icd10", "code": "I10", "description": "Hypertension"})
    assert c["code"] == "I10"


def test_validate_code(coding):
    coding.add_code({"system": "cpt", "code": "99213", "description": "Visit"})
    result = coding.validate_code("cpt", "99213")
    assert result["valid"] is True


def test_search_codes(coding):
    coding.add_code({"system": "icd10", "code": "J06.9", "description": "URI"})
    results = coding.search({"query": "URI"})
    assert len(results) >= 1


def test_add_encounter_code(coding):
    ec = coding.add_encounter_code({"encounter_id": 1, "system": "icd10", "code": "I10"})
    assert ec["encounter_id"] == 1


# Check-in
def test_checkin(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1, "priority": "normal"})
    assert c["status"] == "checked_in"


def test_call_patient(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1})
    called = checkin.call_patient(c["id"])
    assert called["status"] == "called"


def test_complete_checkin(checkin):
    c = checkin.check_in({"patient_id": 1, "department_id": 1})
    completed = checkin.complete(c["id"])
    assert completed["status"] == "completed"


def test_queue_stats(checkin):
    checkin.check_in({"patient_id": 1, "department_id": 1})
    stats = checkin.queue_stats(department_id=1)
    assert stats["total_waiting"] >= 1


# Reporting
def test_create_definition(reporting):
    d = reporting.create_definition({"name": "Test Report", "query": "SELECT 1"})
    assert d["name"] == "Test Report"


def test_run_report(reporting):
    d = reporting.create_definition({"name": "Run Test", "query": "SELECT count(*)"})
    execution = reporting.run({"definition_id": d["id"]})
    assert execution["status"] == "completed"


def test_subscribe(reporting):
    d = reporting.create_definition({"name": "Sub Test", "query": "SELECT 1"})
    sub = reporting.subscribe({"definition_id": d["id"], "user_id": 1})
    assert sub["user_id"] == 1


# Notification
def test_send_notification(notif):
    n = notif.send({"recipient_id": 1, "body": "Hello"})
    assert n["status"] == "pending"


def test_send_bulk(notif):
    results = notif.send_bulk({"recipient_ids": [1, 2, 3], "body": "Bulk msg"})
    assert len(results) == 3


def test_mark_read(notif):
    n = notif.send({"recipient_id": 1, "body": "Msg"})
    read = notif.mark_read(n["id"])
    assert read["is_read"] is True


def test_render_template(notif):
    notif.create_template({"name": "greet", "body_template": "Hi {{name}}"})
    rendered = notif.render_template("greet", {"name": "Alice"})
    assert rendered["body"] == "Hi Alice"


# Queue
def test_enqueue(queue):
    t = queue.enqueue({"name": "job1"})
    assert t["status"] == "queued"


def test_dequeue(queue):
    queue.enqueue({"name": "job2"})
    task = queue.dequeue()
    assert task["status"] == "running"


def test_complete_task(queue):
    t = queue.enqueue({"name": "job3"})
    queue.dequeue()
    completed = queue.complete(t["id"])
    assert completed["status"] == "completed"


def test_queue_stats(queue):
    queue.enqueue({"name": "j"})
    stats = queue.stats()
    assert stats["total"] == 1


# Cache
def test_cache_set_get(cache):
    cache.set("key1", "value1", ttl=60)
    assert cache.get("key1") == "value1"


def test_cache_delete(cache):
    cache.set("key2", "value2")
    assert cache.delete("key2") is True
    assert cache.get("key2") is None


def test_cache_increment(cache):
    assert cache.increment("counter", 1) == 1
    assert cache.increment("counter", 2) == 3


def test_cache_clear(cache):
    cache.set("a", 1)
    cache.clear()
    assert cache.size() == 0


# Search
def test_index_and_search(search):
    search.index_document("doc1", "patient appointment scheduling")
    results = search.search("appointment")
    assert len(results) == 1


def test_search_empty(search):
    assert search.search("") == []


def test_rebuild(search):
    search.index_document("old", "old content")
    count = search.rebuild([{"id": "new1", "content": "new content"}])
    assert count == 1
    assert search.count() == 1


def test_suggest(search):
    search.index_document("doc1", "patient portal")
    suggestions = search.suggest("pat")
    assert "patient" in suggestions
