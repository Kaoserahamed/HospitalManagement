from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from models.department import Department


class DepartmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, department_id: str) -> Department | None:
        result = await self.session.execute(select(Department).where(Department.id == department_id))
        return result.scalars().first()

    async def get_by_name(self, name: str) -> Department | None:
        result = await self.session.execute(select(Department).where(Department.name == name))
        return result.scalars().first()

    async def get_all(self, active_only: bool = False) -> list[Department]:
        query = select(Department)
        if active_only:
            query = query.where(Department.is_active == True)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, department: Department) -> Department:
        self.session.add(department)
        await self.session.commit()
        await self.session.refresh(department)
        return department

    async def update(self, department: Department) -> Department:
        await self.session.commit()
        await self.session.refresh(department)
        return department

    async def delete(self, department_id: str) -> bool:
        department = await self.get_by_id(department_id)
        if department:
            await self.session.delete(department)
            await self.session.commit()
            return True
        return False
