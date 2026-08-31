"""
Quick script to initialize production database
Usage: python setup_production_db.py <database_url>
Example: python setup_production_db.py "mysql+asyncmy://user:pass@host/hospital_db"
"""

import sys
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from backend.models.user import User
from backend.models.department import Department
from backend.models.doctor import DoctorProfile
from backend.models.patient import Patient
from backend.models.appointment import Appointment
from backend.models.doctor_schedule import DoctorSchedule
from backend.models.prescription import Prescription
from backend.core.security import get_password_hash

async def init_database(database_url: str):
    """Initialize database tables"""
    print(f"🔧 Connecting to database...")
    engine = create_async_engine(database_url, echo=True)
    
    print("📋 Creating tables...")
    async with engine.begin() as conn:
        # Import Base from any model
        from backend.models.user import User
        await conn.run_sync(User.metadata.create_all)
    
    print("✅ Tables created successfully!")
    
    # Create admin user
    print("👤 Creating admin user...")
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        admin = User(
            email="admin@hospital.com",
            password_hash=get_password_hash("Admin@123"),
            role="admin",
            first_name="System",
            last_name="Administrator",
            phone="1234567890",
            is_active=True
        )
        session.add(admin)
        await session.commit()
        print(f"✅ Admin user created: admin@hospital.com / Admin@123")
    
    await engine.dispose()
    print("\n🎉 Database setup complete!")
    print("\nYou can now deploy your application!")
    print("\nAdmin Login:")
    print("  Email: admin@hospital.com")
    print("  Password: Admin@123")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Error: Database URL required")
        print("\nUsage:")
        print('  python setup_production_db.py "mysql+asyncmy://user:pass@host/hospital_db"')
        print("\nOr set DATABASE_URL environment variable:")
        print('  $env:DATABASE_URL="mysql+asyncmy://..."; python setup_production_db.py')
        sys.exit(1)
    
    db_url = sys.argv[1]
    asyncio.run(init_database(db_url))
