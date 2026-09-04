from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from core.config import settings

# Serverless-optimized database configuration
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=1,  # Minimal pool for serverless
    max_overflow=0,  # No overflow for serverless
    connect_args={
        "connect_timeout": 10,  # 10 second connection timeout
    }
)
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session