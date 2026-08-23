"""
Initialize database tables for departments and doctor profiles
This will create the tables if they don't exist
"""
import asyncio
from core.database import engine, Base

# Import all models to register them with Base
from models.user import User
from models.department import Department
from models.doctor import DoctorProfile


async def init_tables():
    """Create all tables"""
    print("Creating database tables...")
    
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("✓ Tables created successfully!")
    print("\nCreated tables:")
    print("  - users")
    print("  - departments")
    print("  - doctor_profiles")


if __name__ == "__main__":
    asyncio.run(init_tables())
