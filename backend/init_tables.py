"""
Initialize database tables for the Hospital Management System
This will create all tables if they don't exist
"""

import asyncio

from core.database import Base, engine

# Import all models to register them with Base


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
    print("  - patients")
    print("  - appointments")
    print("  - doctor_schedules")
    print("  - prescriptions")


if __name__ == "__main__":
    asyncio.run(init_tables())
