from sqlalchemy.ext.asyncio import create_async_engine as cae, AsyncSession
from sqlalchemy.orm import DeclarativeBase

SQL_DATABASE_URL = "sqlite+aiosqlite:///.College.db"
engine = cae(SQL_DATABASE_URL, echo=True)
class Base(DeclarativeBase):
    pass