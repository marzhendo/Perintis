from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./perintis.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # SQLite membutuhkan ini untuk multi-thread (FastAPI async worker)
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: inject DB session ke endpoint, lalu close otomatis setelah request selesai."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
