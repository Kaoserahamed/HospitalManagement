from services.doctor_schedule_service import DoctorScheduleService
from schemas.schemas import (
    DoctorScheduleCreate, DoctorScheduleUpdate, DoctorScheduleResponse,
    AvailableSlot
)
from datetime import date


class DoctorScheduleController:
    def __init__(self, service: DoctorScheduleService):
        self.service = service

    async def create_schedule(self, data: DoctorScheduleCreate) -> DoctorScheduleResponse:
        """Create a doctor schedule"""
        schedule = await self.service.create_schedule(data)
        return DoctorScheduleResponse.model_validate(schedule)

    async def update_schedule(self, schedule_id: str, data: DoctorScheduleUpdate) -> DoctorScheduleResponse:
        """Update a doctor schedule"""
        schedule = await self.service.update_schedule(schedule_id, data)
        return DoctorScheduleResponse.model_validate(schedule)

    async def get_doctor_schedules(self, doctor_id: str) -> list[DoctorScheduleResponse]:
        """Get all schedules for a doctor"""
        schedules = await self.service.get_doctor_schedules(doctor_id)
        return [DoctorScheduleResponse.model_validate(s) for s in schedules]

    async def get_all_schedules(self) -> list[DoctorScheduleResponse]:
        """Get all schedules"""
        schedules = await self.service.get_all_schedules()
        return [DoctorScheduleResponse.model_validate(s) for s in schedules]

    async def delete_schedule(self, schedule_id: str) -> dict:
        """Delete a schedule"""
        success = await self.service.delete_schedule(schedule_id)
        return {"success": success, "message": "Schedule deleted" if success else "Schedule not found"}

    async def get_available_slots(self, doctor_id: str, target_date: date) -> list[AvailableSlot]:
        """Get available appointment slots"""
        return await self.service.get_available_slots(doctor_id, target_date)
