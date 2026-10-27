"""Video service."""

from __future__ import annotations

import uuid
from datetime import datetime

from backend.shared.errors import NotFoundError
from backend.shared.events import DomainEvent, default_bus

from .repository import VideoRepository
from .schemas import SessionMetricCreate, SignalingMessageCreate, VideoSessionCreate


class VideoService:
    def __init__(self, repository: VideoRepository | None = None) -> None:
        self.repository = repository or VideoRepository()

    def create_session(self, data: VideoSessionCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        if not payload.get("room_id"):
            payload["room_id"] = str(uuid.uuid4())
        record = self.repository.create_session(payload)
        default_bus.publish(
            DomainEvent(name="VideoSessionCreated", payload={"session_id": record["id"]})
        )
        return record

    def get_session(self, session_id: int) -> dict:
        record = self.repository.get_session(session_id)
        if record is None:
            raise NotFoundError("VideoSession", session_id)
        return record

    def get_session_by_room(self, room_id: str) -> dict:
        record = self.repository.get_session_by_room(room_id)
        if record is None:
            raise NotFoundError("VideoSession", room_id)
        return record

    def connect(self, session_id: int) -> dict:
        record = self.repository.update_session(session_id, {"status": "connecting"})
        default_bus.publish(
            DomainEvent(name="VideoSessionConnecting", payload={"session_id": session_id})
        )
        return record

    def connected(self, session_id: int, participant_count: int = 1) -> dict:
        record = self.repository.update_session(
            session_id,
            {
                "status": "connected",
                "started_at": datetime.utcnow(),
                "participant_count": participant_count,
            },
        )
        default_bus.publish(
            DomainEvent(name="VideoSessionConnected", payload={"session_id": session_id})
        )
        return record

    def end_session(self, session_id: int, recording_path: str | None = None) -> dict:
        payload = {"status": "ended", "ended_at": datetime.utcnow()}
        if recording_path:
            payload["recording_path"] = recording_path
        record = self.repository.update_session(session_id, payload)
        default_bus.publish(
            DomainEvent(name="VideoSessionEnded", payload={"session_id": session_id})
        )
        return record

    def fail_session(self, session_id: int, error: str | None = None) -> dict:
        payload = {"status": "failed"}
        if error:
            payload["error"] = error
        return self.repository.update_session(session_id, payload)

    def update_quality(self, session_id: int, quality: str) -> dict:
        return self.repository.update_session(session_id, {"quality": quality})

    def add_participant(self, session_id: int) -> dict:
        session = self.get_session(session_id)
        count = session.get("participant_count", 0) + 1
        return self.repository.update_session(session_id, {"participant_count": count})

    def remove_participant(self, session_id: int) -> dict:
        session = self.get_session(session_id)
        count = max(0, session.get("participant_count", 0) - 1)
        return self.repository.update_session(session_id, {"participant_count": count})

    def send_signaling(self, data: SignalingMessageCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        record = self.repository.create_signaling(payload)
        default_bus.publish(
            DomainEvent(name="SignalingMessageSent", payload={"message_id": record["id"]})
        )
        return record

    def list_signaling(self, session_id: int) -> list[dict]:
        return self.repository.list_signaling(session_id)

    def record_metric(self, data: SessionMetricCreate | dict) -> dict:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        return self.repository.create_metric(payload)

    def list_metrics(self, session_id: int) -> list[dict]:
        return self.repository.list_metrics(session_id)

    def session_duration(self, session_id: int) -> float:
        session = self.get_session(session_id)
        started = session.get("started_at")
        ended = session.get("ended_at")
        if started and ended:
            if isinstance(started, str):
                try:
                    started = datetime.fromisoformat(started)
                except ValueError:
                    started = None
            if isinstance(ended, str):
                try:
                    ended = datetime.fromisoformat(ended)
                except ValueError:
                    ended = None
            if isinstance(started, datetime) and isinstance(ended, datetime):
                return (ended - started).total_seconds()
        return 0.0

    def list_sessions(self, params, status: str | None = None):
        return self.repository.list_sessions(params, status=status)

    def count(self) -> int:
        return self.repository.count_sessions()

    def clear(self) -> None:
        self.repository.clear()
