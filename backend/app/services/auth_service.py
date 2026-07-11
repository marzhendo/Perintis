"""
auth_service.py — Pure service layer untuk autentikasi.

Sesuai ARCHITECTURE.md:
- Service never knows HTTP (tidak ada import dari fastapi/starlette di sini)
- Service never returns FastAPI Response
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt as _bcrypt
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from ..core.config import config
from ..models.user import User
from ..schemas.schemas import UserRegister

# ---------------------------------------------------------------------------
# Password utilities — menggunakan bcrypt langsung (bukan passlib wrapper)
# ---------------------------------------------------------------------------

def hash_password(plain: str) -> str:
    """Hash password menggunakan bcrypt. JANGAN simpan plain text ke DB."""
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Verifikasi password plain terhadap bcrypt hash yang tersimpan di DB."""
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


# ---------------------------------------------------------------------------
# JWT utilities
# ---------------------------------------------------------------------------

def create_access_token(data: dict) -> str:
    """Buat JWT token dengan expiry 24 jam (cukup untuk keperluan demo lomba)."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRE_HOURS)
    payload["exp"] = expire
    return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode dan verify JWT token.
    Return payload dict jika valid, None jika invalid atau expired.
    """
    try:
        return jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
    except JWTError:
        return None


# ---------------------------------------------------------------------------
# User operations
# ---------------------------------------------------------------------------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def register_user(db: Session, data: UserRegister) -> User:
    """
    Buat user baru di database.
    ASUMSI: pemanggil sudah memverifikasi bahwa email belum terdaftar.
    """
    user = User(
        email=data.email,
        name=data.name,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Verifikasi credentials. Return User jika valid, None jika gagal.
    Tidak raise exception — keputusan HTTP error ada di route layer.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
