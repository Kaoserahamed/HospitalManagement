from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.doctor_schedule import DoctorSchedule, DayOfWeek


class DoctorScheduleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, schedule_id: str) -> DoctorSchedule | None:
        result = await self.session.execute(
            select(DoctorSchedule)
            .where(DoctorSchedule.id == schedule_id)
            .options(selectinload(DoctorSchedule.doctor))
        )
        return result.scalars().first()

    async def get_by_doctor(self, doctor_id: str, active_only: bool = False) -> list[DoctorSchedule]:
        query = select(DoctorSchedule).where(DoctorSchedule.doctor_id == doctor_id)
        if active_only:
            query = query.where(DoctorSchedule.is_active == True)
        query = query.order_by(DoctorSchedule.day_of_week, DoctorSchedule.start_time)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_doctor_and_day(self, doctor_id: str, day_of_week: DayOfWeek) -> list[DoctorSchedule]:
        result = await self.session.execute(
            select(DoctorSchedule)
            .where(
                DoctorSchedule.doctor_id == doctor_id,
                DoctorSchedule.day_of_week == day_of_week,
                DoctorSchedule.is_active == True
            )
        )
        return list(result.scalars().all())

    async def get_all(self) -> list[DoctorSchedule]:
        result = await self.session.execute(
            select(DoctorSchedule)
            .options(selectinload(DoctorSchedule.doctor))
            .order_by(DoctorSchedule.doctor_id, DoctorSchedule.day_of_week, DoctorSchedule.start_time)
        )
        return list(result.scalars().all())

    async def create(self, schedule: DoctorSchedule) -> DoctorSchedule:
        self.session.add(schedule)
        await self.session.commit()
        await self.session.refresh(schedule)
        return schedule

    async def update(self, schedule: DoctorSchedule) -> DoctorSchedule:
        await self.session.commit()
        await self.session.refresh(schedule)
        return schedule

    async def delete(self, schedule_id: str) -> bool:
        schedule = await self.get_by_id(schedule_id)
        if schedule:
            await self.session.delete(schedule)
            await self.session.commit()
            return True
        return False
