from fastapi import HTTPException, status
from datetime import date, time, datetime, timedelta
from repositories.doctor_schedule_repository import DoctorScheduleRepository
from repositories.user_repository import UserRepository
from repositories.appointment_repository import AppointmentRepository
from schemas.schemas import (
    DoctorScheduleCreate, DoctorScheduleUpdate, AvailableSlot
)
from models.doctor_schedule import DoctorSchedule, DayOfWeek
from models.user import UserRole
from models.appointment import AppointmentStatus


class DoctorScheduleService:
    def __init__(
        self,
        schedule_repo: DoctorScheduleRepository,
        user_repo: UserRepository,
        appointment_repo: AppointmentRepository
    ):
        self.schedule_repo = schedule_repo
        self.user_repo = user_repo
        self.appointment_repo = appointment_repo

    async def create_schedule(self, data: DoctorScheduleCreate) -> DoctorSchedule:
        """Create a doctor schedule"""
        # Verify doctor exists
        doctor = await self.user_repo.get_by_id(data.doctor_id)
        if not doctor or doctor.role != UserRole.DOCTOR:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor not found"
            )

        # Create schedule
        schedule = DoctorSchedule(
            doctor_id=data.doctor_id,
            day_of_week=data.day_of_week,
            start_time=data.start_time,
            end_time=data.end_time,
            slot_duration=data.slot_duration
        )
        return await self.schedule_repo.create(schedule)

    async def update_schedule(self, schedule_id: str, data: DoctorScheduleUpdate) -> DoctorSchedule:
        """Update a doctor schedule"""
        schedule = await self.schedule_repo.get_by_id(schedule_id)
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )

        if data.day_of_week is not None:
            schedule.day_of_week = data.day_of_week
        if data.start_time is not None:
            schedule.start_time = data.start_time
        if data.end_time is not None:
            schedule.end_time = data.end_time
        if data.slot_duration is not None:
            schedule.slot_duration = data.slot_duration
        if data.is_active is not None:
            schedule.is_active = data.is_active

        # Validate times after update
        if schedule.end_time <= schedule.start_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End time must be after start time"
            )

        return await self.schedule_repo.update(schedule)

    async def get_doctor_schedules(self, doctor_id: str) -> list[DoctorSchedule]:
        """Get all schedules for a doctor"""
        return await self.schedule_repo.get_by_doctor(doctor_id, active_only=False)

    async def get_all_schedules(self) -> list[DoctorSchedule]:
        """Get all schedules"""
        return await self.schedule_repo.get_all()

    async def delete_schedule(self, schedule_id: str) -> bool:
        """Delete a schedule"""
        return await self.schedule_repo.delete(schedule_id)

    async def get_available_slots(self, doctor_id: str, target_date: date) -> list[AvailableSlot]:
        """Get available appointment slots for a doctor on a specific date"""
        # Get day of week
        day_name = target_date.strftime("%A").lower()
        day_of_week = DayOfWeek(day_name)

        # Get doctor schedules for this day
        schedules = await self.schedule_repo.get_by_doctor_and_day(doctor_id, day_of_week)
        if not schedules:
            return []

        # Get all appointments for this doctor on this date
        appointments = await self.appointment_repo.get_by_doctor(doctor_id)
        booked_slots = set()
        for apt in appointments:
            if apt.appointment_date == target_date and apt.status in [
                AppointmentStatus.SCHEDULED,
                AppointmentStatus.CONFIRMED
            ]:
                booked_slots.add(apt.appointment_time)

        # Generate slots
        available_slots = []
        for schedule in schedules:
            slots = self._generate_time_slots(
                schedule.start_time,
                schedule.end_time,
                schedule.slot_duration
            )
            for slot_time in slots:
                available_slots.append(
                    AvailableSlot(
                        date=target_date,
                        time=slot_time,
                        available=slot_time not in booked_slots
                    )
                )

        return sorted(available_slots, key=lambda x: x.time)

    def _generate_time_slots(self, start_time: time, end_time: time, duration_minutes: int) -> list[time]:
        """Generate time slots between start and end time"""
        slots = []
        current = datetime.combine(date.today(), start_time)
        end = datetime.combine(date.today(), end_time)
        delta = timedelta(minutes=duration_minutes)

        while current < end:
            slots.append(current.time())
            current += delta

        return slots
