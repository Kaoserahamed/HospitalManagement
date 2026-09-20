from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from core.config import settings


def _build_engine():
    """Create the async engine with pool sizing from validated settings.

    Pool parameters only apply to real database drivers; SQLite (used for
    fast unit tests) does not support them.
    """
    is_sqlite = settings.DATABASE_URL.startswith("sqlite")
    connect_args = {} if is_sqlite else {"connect_timeout": 10}
    pool_kwargs = (
        {}
        if is_sqlite
        else {
            "pool_pre_ping": True,
            "pool_recycle": settings.DB_POOL_RECYCLE,
            "pool_size": settings.DB_POOL_SIZE,
            "max_overflow": settings.DB_MAX_OVERFLOW,
        }
    )
    return create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DB_ECHO,
        connect_args=connect_args,
        **pool_kwargs,
    )


engine = _build_engine()

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Yield a database session per request; always closes the session."""
    async with AsyncSessionLocal() as session:
        yield session
