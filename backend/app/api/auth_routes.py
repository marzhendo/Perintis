"""
auth_routes.py — Route layer untuk endpoint autentikasi.

Endpoint:
  POST /api/auth/register  → daftar akun baru (auto-login, return user + token)
  POST /api/auth/login     → masuk, return user + token
  GET  /api/auth/me        → return data user yang sedang login (butuh Bearer token)
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.schemas import UserRegister, UserLogin, UserResponse, Token, AuthResponse, ChangePasswordRequest
from ..services import auth_service
from ..dependencies.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])
from ..core.rate_limit import limiter


@router.post("/register", response_model=AuthResponse, status_code=201)
@limiter.limit("3/minute")
def register(request: Request, data: UserRegister, db: Session = Depends(get_db)):
    # Cek email belum terdaftar
    if auth_service.get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar. Gunakan email lain atau masuk dengan akun yang sudah ada.",
        )

    user = auth_service.register_user(db, data)
    token = auth_service.create_access_token({"sub": str(user.id)})
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=Token(access_token=token),
    )


@router.post("/login", response_model=AuthResponse)
@limiter.limit("5/minute")
def login(request: Request, data: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah.",
        )
    token = auth_service.create_access_token({"sub": str(user.id)})
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=Token(access_token=token),
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.patch("/change-password")
def change_password(data: ChangePasswordRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not auth_service.verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Password lama tidak sesuai"
        )
    current_user.password_hash = auth_service.hash_password(data.new_password)
    db.commit()
    return {"message": "Password berhasil diubah"}
