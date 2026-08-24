from fastapi import HTTPException, status
from datetime import date, time
from repositories.appointment_repository import AppointmentRepository
from repositories.user_repository import UserRepository
from repositories.department_repository import DepartmentRepository
from repositories.doctor_repository import DoctorRepository
from repositories.doctor_schedule_repository import DoctorScheduleRepository
from repositories.patient_repository import PatientRepository
from schemas.schemas import (
    AppointmentCreate, AppointmentUpdate, AppointmentStatusUpdate,
    AppointmentWithDetails
)
from models.appointment import Appointment, AppointmentStatus
from models.user import UserRole
from models.doctor_schedule import DayOfWeek


class AppointmentService:
    def __init__(
        self,
        appointment_repo: AppointmentRepository,
        user_repo: UserRepository,
        department_repo: DepartmentRepository,
        doctor_repo: DoctorRepository,
        schedule_repo: DoctorScheduleRepository | None = None,
        patient_repo: PatientRepository | None = None
    ):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo
        self.department_repo = department_repo
        self.doctor_repo = doctor_repo
        self.schedule_repo = schedule_repo
        self.patient_repo = patient_repo

    async def create_appointment(self, patient_id: str, data: AppointmentCreate) -> Appointment:
        """Create a new appointment"""
        # Verify patient exists
        patient = await self.patient_repo.get_by_id(patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )

        # Verify doctor exists and is active
        doctor = await self.user_repo.get_by_id(data.doctor_id)
        if not doctor or doctor.role != UserRole.DOCTOR:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor not found"
            )
        if not doctor.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor is not active"
            )

        # Verify department exists and is active
        department = await self.department_repo.get_by_id(data.department_id)
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        if not department.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department is not active"
            )

        # Verify doctor belongs to the department
        doctor_profile = await self.doctor_repo.get_by_user_id(data.doctor_id)
        if doctor_profile and doctor_profile.department_id != data.department_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor does not belong to the selected department"
            )

        # Validate doctor has schedule for this day and time
        if self.schedule_repo:
            await self._validate_doctor_availability(
                data.doctor_id,
                data.appointment_date,
                data.appointment_time
            )

        # Check for conflicting appointments
        conflict = await self.appointment_repo.check_conflict(
            data.doctor_id,
            data.appointment_date,
            data.appointment_time
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This time slot is already booked"
            )

        # Create appointment
        appointment = Appointment(
            patient_id=patient_id,
            doctor_id=data.doctor_id,
            department_id=data.department_id,
            appointment_date=data.appointment_date,
            appointment_time=data.appointment_time,
            reason=data.reason,
            status=AppointmentStatus.SCHEDULED
        )
        return await self.appointment_repo.create(appointment)

    async def update_appointment(self, appointment_id: str, data: AppointmentUpdate) -> Appointment:
        """Update an appointment"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found"
            )

        # Don't allow updates to completed/cancelled appointments
        if appointment.status in [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot update {appointment.status.value} appointment"
            )

        # If rescheduling, check for conflicts
        if data.appointment_date or data.appointment_time:
            new_date = data.appointment_date if data.appointment_date else appointment.appointment_date
            new_time = data.appointment_time if data.appointment_time else appointment.appointment_time
            
            conflict = await self.appointment_repo.check_conflict(
                appointment.doctor_id,
                new_date,
                new_time,
                exclude_appointment_id=appointment_id
            )
            if conflict:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This time slot is already booked"
                )
            
            appointment.appointment_date = new_date
            appointment.appointment_time = new_time

        if data.status:
            appointment.status = data.status
        if data.reason is not None:
            appointment.reason = data.reason
        if data.notes is not None:
            appointment.notes = data.notes

        return await self.appointment_repo.update(appointment)

    async def update_status(self, appointment_id: str, data: AppointmentStatusUpdate) -> Appointment:
        """Update appointment status"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found"
            )

        appointment.status = data.status
        if data.notes:
            appointment.notes = data.notes

        return await self.appointment_repo.update(appointment)

    async def cancel_appointment(self, appointment_id: str, user_id: str, user_role: UserRole) -> Appointment:
        """Cancel an appointment"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found"
            )

        # Check permissions - note: user_id here is for staff, patients are separate
        # For patients, we'd need patient_id instead
        # For now, staff can cancel any appointment

        # Don't allow cancelling completed appointments
        if appointment.status == AppointmentStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel completed appointment"
            )

        appointment.status = AppointmentStatus.CANCELLED
        return await self.appointment_repo.update(appointment)

    async def get_patient_appointments(self, patient_id: str) -> list[AppointmentWithDetails]:
        """Get all appointments for a patient"""
        appointments = await self.appointment_repo.get_by_patient(patient_id)
        return [self._appointment_to_details(apt) for apt in appointments]

    async def get_doctor_appointments(self, doctor_id: str) -> list[AppointmentWithDetails]:
        """Get all appointments for a doctor"""
        appointments = await self.appointment_repo.get_by_doctor(doctor_id)
        return [self._appointment_to_details(apt) for apt in appointments]

    async def get_all_appointments(self, status: AppointmentStatus | None = None) -> list[AppointmentWithDetails]:
        """Get all appointments"""
        appointments = await self.appointment_repo.get_all(status=status)
        return [self._appointment_to_details(apt) for apt in appointments]

    async def get_appointment(self, appointment_id: str) -> Appointment:
        """Get a specific appointment"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found"
            )
        return appointment

    def _appointment_to_details(self, appointment: Appointment) -> AppointmentWithDetails:
        """Convert Appointment to AppointmentWithDetails"""
        return AppointmentWithDetails(
            id=appointment.id,
            patient_id=appointment.patient_id,
            patient_name=f"{appointment.patient.first_name} {appointment.patient.last_name}",
            patient_email="",  # Patients don't have email
            patient_phone=appointment.patient.phone if appointment.patient.phone else None,
            doctor_id=appointment.doctor_id,
            doctor_name=f"Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}",
            doctor_email=appointment.doctor.email,
            department_id=appointment.department_id,
            department_name=appointment.department.name,
            appointment_date=appointment.appointment_date,
            appointment_time=appointment.appointment_time,
            status=appointment.status,
            reason=appointment.reason,
            notes=appointment.notes,
            created_at=appointment.created_at
        )

    async def _validate_doctor_availability(self, doctor_id: str, appointment_date: date, appointment_time: time) -> None:
        """Validate that the doctor has a schedule for this day and time"""
        if not self.schedule_repo:
            return  # Skip validation if schedule_repo not available
        
        # Get day of week
        day_name = appointment_date.strftime("%A").lower()
        day_of_week = DayOfWeek(day_name)
        
        # Get doctor schedules for this day
        schedules = await self.schedule_repo.get_by_doctor_and_day(doctor_id, day_of_week)
        if not schedules:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Doctor is not available on {day_name.capitalize()}s"
            )
        
        # Check if appointment time falls within any schedule
        time_valid = False
        for schedule in schedules:
            if schedule.start_time <= appointment_time < schedule.end_time:
                time_valid = True
                break
        
        if not time_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Appointment time is outside doctor's working hours"
            )
