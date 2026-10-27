"""Video API routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.shared.pagination import PageParams

from .schemas import SessionMetricCreate, SignalingMessageCreate, VideoSessionCreate
from .service import VideoService

router = APIRouter(prefix="/video", tags=["video"])


def get_service() -> VideoService:
    return VideoService()


@router.post("/sessions", status_code=201)
def create_session(payload: VideoSessionCreate, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.create_session(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/sessions")
def list_sessions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str | None = None,
    service: VideoService = Depends(get_service),
) -> Any:
    params = PageParams(page=page, per_page=per_page)
    return service.list_sessions(params, status=status).to_dict()


@router.get("/sessions/room/{room_id}")
def get_session_by_room(room_id: str, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.get_session_by_room(room_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/sessions/{session_id}")
def get_session(session_id: int, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.get_session(session_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/connect")
def connect(session_id: int, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.connect(session_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/connected")
def connected(session_id: int, participant_count: int = 1, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.connected(session_id, participant_count=participant_count)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/end")
def end_session(session_id: int, recording_path: str | None = None, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.end_session(session_id, recording_path=recording_path)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/fail")
def fail_session(session_id: int, error: str | None = None, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.fail_session(session_id, error=error)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/sessions/{session_id}/quality")
def update_quality(session_id: int, quality: str, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.update_quality(session_id, quality)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/participants")
def add_participant(session_id: int, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.add_participant(session_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/sessions/{session_id}/participants")
def remove_participant(session_id: int, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.remove_participant(session_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/signaling", status_code=201)
def send_signaling(payload: SignalingMessageCreate, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.send_signaling(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/sessions/{session_id}/signaling")
def list_signaling(session_id: int, service: VideoService = Depends(get_service)) -> None:
    return service.list_signaling(session_id)


@router.post("/metrics", status_code=201)
def record_metric(payload: SessionMetricCreate, service: VideoService = Depends(get_service)) -> None:
    try:
        return service.record_metric(payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/sessions/{session_id}/metrics")
def list_metrics(session_id: int, service: VideoService = Depends(get_service)) -> None:
    return service.list_metrics(session_id)


@router.get("/sessions/{session_id}/duration")
def session_duration(session_id: int, service: VideoService = Depends(get_service)) -> None:
    try:
        return {"duration_seconds": service.session_duration(session_id)}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/count")
def count(service: VideoService = Depends(get_service)) -> None:
    return {"count": service.count()}
