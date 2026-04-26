from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import DeclarativeBase

SQL_DATABASE_URL = "sqlite+aiosqlite:///./College.db"
engine = create_async_engine(SQL_DATABASE_URL, echo=True)
class Base(DeclarativeBase):
    pass