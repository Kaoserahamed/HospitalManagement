"""
Admin seeding script for Hospital Management System
Run this script once to create the initial admin user

Prerequisites:
- Database and users table must already exist (run schema.sql first)

Usage: 
    cd backend
    python seed_admin.py
"""
import asyncio
from core.database import AsyncSessionLocal
from core.security import hash_password
from models.user import User, UserRole
from repositories.user_repository import UserRepository


async def seed_admin():
    """Create initial admin user if not exists"""
    async with AsyncSessionLocal() as session:
        repo = UserRepository(session)
        
        # Check if admin exists
        admin_email = "admin@hospital.com"
        existing_admin = await repo.get_by_email(admin_email)
        
        if existing_admin:
            print(f"✓ Admin user already exists: {admin_email}")
            print(f"  Role: {existing_admin.role.value}")
            return
        
        # Create admin user
        admin_user = User(
            email=admin_email,
            password_hash=hash_password("Admin@123"),  # Change this in production!
            role=UserRole.ADMIN,
            first_name="System",
            last_name="Administrator",
            phone="+1234567890",
            is_active=True
        )
        
        await repo.create(admin_user)
        print(f"✓ Admin user created successfully!")
        print(f"  Email: {admin_email}")
        print(f"  Password: Admin@123")
        print(f"  Role: admin")
        print(f"  ⚠️  IMPORTANT: Change the password after first login!")


if __name__ == "__main__":
    print("=" * 60)
    print("Hospital Management System - Admin Seed")
    print("=" * 60)
    try:
        asyncio.run(seed_admin())
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure:")
        print("  1. MySQL server is running")
        print("  2. Database 'hospital_db' exists")
        print("  3. Users table is created (run schema.sql first)")
        print("  4. Database credentials in .env are correct")
    print("=" * 60)
