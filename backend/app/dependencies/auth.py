"""
dependencies/auth.py — FastAPI dependency untuk proteksi rute.

Gunakan `Depends(get_current_user)` di endpoint manapun yang butuh autentikasi.
Sesuai ARCHITECTURE.md: Route never contains business logic — dependency ini
memisahkan logika verifikasi token dari route handler.
"""

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..services import auth_service

_bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency: ekstrak dan verifikasi Bearer token dari header Authorization.
    Raise 401 jika token tidak ada, invalid, atau expired.
    Return User object jika valid.
    """
    token = credentials.credentials
    payload = auth_service.decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Token tidak valid atau sudah kadaluarsa.")

    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token tidak valid.")

    user = auth_service.get_user_by_id(db, int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="Pengguna tidak ditemukan.")

    return user
