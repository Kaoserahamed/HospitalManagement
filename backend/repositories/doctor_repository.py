from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from models.doctor import DoctorProfile
from models.user import User, UserRole
from models.department import Department


class DoctorRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: str) -> DoctorProfile | None:
        result = await self.session.execute(
            select(DoctorProfile)
            .where(DoctorProfile.user_id == user_id)
            .options(joinedload(DoctorProfile.department))
        )
        return result.scalars().first()

    async def get_by_id(self, profile_id: str) -> DoctorProfile | None:
        result = await self.session.execute(
            select(DoctorProfile)
            .where(DoctorProfile.id == profile_id)
            .options(joinedload(DoctorProfile.department))
        )
        return result.scalars().first()

    async def get_all_doctors(self) -> list[tuple[User, DoctorProfile | None, Department | None]]:
        """Get all users with doctor role and their profiles with departments"""
        from sqlalchemy.orm import selectinload
        
        # Get all doctor users
        result = await self.session.execute(
            select(User)
            .where(User.role == UserRole.DOCTOR)
        )
        users = list(result.scalars().all())
        
        # Get all doctor profiles with departments
        profiles_result = await self.session.execute(
            select(DoctorProfile)
            .options(selectinload(DoctorProfile.department))
        )
        profiles = {p.user_id: p for p in profiles_result.scalars().all()}
        
        # Combine users with their profiles and departments
        results = []
        for user in users:
            profile = profiles.get(user.id)
            department = profile.department if profile and profile.department_id else None
            results.append((user, profile, department))
        
        return results

    async def get_doctors_by_department(self, department_id: str) -> list[DoctorProfile]:
        result = await self.session.execute(
            select(DoctorProfile)
            .where(DoctorProfile.department_id == department_id)
            .options(joinedload(DoctorProfile.department))
        )
        return list(result.scalars().all())

    async def create(self, doctor_profile: DoctorProfile) -> DoctorProfile:
        self.session.add(doctor_profile)
        await self.session.commit()
        await self.session.refresh(doctor_profile)
        return doctor_profile

    async def update(self, doctor_profile: DoctorProfile) -> DoctorProfile:
        await self.session.commit()
        await self.session.refresh(doctor_profile)
        return doctor_profile

    async def delete(self, profile_id: str) -> bool:
        profile = await self.get_by_id(profile_id)
        if profile:
            await self.session.delete(profile)
            await self.session.commit()
            return True
        return False
