import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.orm import sessionmaker
import urllib.parse

PG_USER = os.environ.get("PG_USER")
PG_PASS = urllib.parse.quote_plus(os.environ.get("PG_PASS"))
PG_SERVER = os.environ.get("PG_SERVER")
PG_PORT = os.environ.get("PG_PORT")
PG_DB = os.environ.get("PG_DB")

# PostgreSQL async
PG_ASYNC_SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{PG_USER}:{PG_PASS}@{PG_SERVER}:{PG_PORT}/{PG_DB}"
pg_async_engine = create_async_engine(PG_ASYNC_SQLALCHEMY_DATABASE_URL,echo=True,pool_size=40,max_overflow=0)
pg_async_session = sessionmaker(pg_async_engine,expire_on_commit=False,class_=AsyncSession)

Base = declarative_base()
