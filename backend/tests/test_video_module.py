"""Tests for video module."""

import pytest
from datetime import datetime

from backend.modules.video.repository import VideoRepository
from backend.modules.video.service import VideoService


@pytest.fixture
def video():
    return VideoService(repository=VideoRepository())


def test_create_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-1"})
    assert s["status"] == "created"


def test_connect_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-2"})
    connected = video.connected(s["id"])
    assert connected["status"] == "connected"


def test_end_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-3"})
    video.connected(s["id"])
    ended = video.end_session(s["id"], recording_path="/recordings/1.mp4")
    assert ended["status"] == "ended"
    assert ended["recording_path"] == "/recordings/1.mp4"


def test_signaling(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-4"})
    msg = video.send_signaling({"session_id": s["id"], "sender_id": 1, "message_type": "offer", "payload": "{}"})
    assert msg["message_type"] == "offer"
    msgs = video.list_signaling(s["id"])
    assert len(msgs) == 1


def test_metrics(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-5"})
    video.record_metric({"session_id": s["id"], "metric_name": "bitrate", "metric_value": 1000.0})
    metrics = video.list_metrics(s["id"])
    assert len(metrics) == 1


def test_participants(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-6"})
    video.add_participant(s["id"])
    video.add_participant(s["id"])
    session = video.get_session(s["id"])
    assert session["participant_count"] == 2
    video.remove_participant(s["id"])
    session = video.get_session(s["id"])
    assert session["participant_count"] == 1


def test_quality_update(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-7"})
    updated = video.update_quality(s["id"], "hd")
    assert updated["quality"] == "hd"


def test_session_duration(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-8"})
    video.connected(s["id"])
    video.end_session(s["id"])
    dur = video.session_duration(s["id"])
    assert dur >= 0


def test_fail_session(video):
    s = video.create_session({"visit_id": 1, "room_id": "room-9"})
    failed = video.fail_session(s["id"], error="connection lost")
    assert failed["status"] == "failed"


def test_count(video):
    video.create_session({"visit_id": 1, "room_id": "room-10"})
    assert video.count() == 1
