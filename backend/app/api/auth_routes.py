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
from ..schemas.schemas import UserRegister, UserLogin, UserResponse, Token, AuthResponse, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest, FirebaseLoginRequest
from ..services import auth_service
from ..services.firebase_service import verify_firebase_token
from ..dependencies.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])
from ..core.rate_limit import register_limiter, login_limiter, forgot_password_limiter, reset_password_limiter

@router.post("/register", response_model=AuthResponse, status_code=201, dependencies=[Depends(register_limiter)])
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


@router.post("/login", response_model=AuthResponse, dependencies=[Depends(login_limiter)])
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


@router.post("/forgot-password", dependencies=[Depends(forgot_password_limiter)])
def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta, timezone
    from ..models.otp_verification import OTPVerification

    user = auth_service.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email tidak terdaftar."
        )
    
    # 1. Prevent flooding: Check if an active OTP was recently generated (less than 60 seconds ago)
    recent_otp = db.query(OTPVerification).filter(
        OTPVerification.email == data.email,
        OTPVerification.purpose == "reset_password",
        OTPVerification.created_at > datetime.now(timezone.utc) - timedelta(seconds=60)
    ).first()
    if recent_otp:
        raise HTTPException(
            status_code=429,
            detail="Minta kirim ulang terlalu cepat. Silakan tunggu 60 detik sebelum meminta kode baru."
        )
    
    # 2. Generate 6-digit numeric OTP code
    import secrets
    otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
    
    # 3. Save OTP to DB
    # Clean up old OTPs for this email to keep DB clean
    db.query(OTPVerification).filter(
        OTPVerification.email == data.email,
        OTPVerification.purpose == "reset_password"
    ).delete()
    
    otp_record = OTPVerification(
        email=data.email,
        code=otp_code,
        purpose="reset_password",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)  # OTP valid for 5 minutes
    )
    db.add(otp_record)
    db.commit()
    
    # 4. Send OTP email
    from ..services.email_service import send_otp_email
    send_otp_email(data.email, otp_code, "reset_password")
    
    # If SMTP is not configured, we return the code in the response as demo_code for dev convenience
    from ..core.config import config
    response_data = {"message": "Kode verifikasi reset password telah dikirim ke email Anda."}
    if not all([config.SMTP_HOST, config.SMTP_USER, config.SMTP_PASSWORD]):
        response_data["demo_code"] = otp_code
        
    return response_data


@router.post("/reset-password", dependencies=[Depends(reset_password_limiter)])
def reset_password(request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):
    from datetime import datetime, timezone
    from ..models.otp_verification import OTPVerification
    
    # 1. Find the latest active OTP record for this email
    otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == data.email,
        OTPVerification.purpose == "reset_password",
        OTPVerification.is_verified == False,
        OTPVerification.expires_at > datetime.now(timezone.utc)
    ).order_by(OTPVerification.created_at.desc()).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada kode verifikasi aktif untuk email ini. Silakan minta kode baru."
        )
    
    # 2. Check if this OTP has already been blocked due to brute force attempts
    if otp_record.failed_attempts >= 3:
        otp_record.is_verified = True
        db.commit()
        raise HTTPException(
            status_code=400,
            detail="Kode verifikasi telah diblokir karena terlalu banyak percobaan salah. Silakan minta kode baru."
        )
    
    # 3. Check if the provided code matches
    if otp_record.code != data.code:
        # Increment failed attempts
        otp_record.failed_attempts += 1
        db.commit()
        
        remaining = 3 - otp_record.failed_attempts
        if remaining <= 0:
            otp_record.is_verified = True
            db.commit()
            raise HTTPException(
                status_code=400,
                detail="Kode verifikasi telah diblokir karena terlalu banyak percobaan salah. Silakan minta kode baru."
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Kode verifikasi salah. Sisa percobaan: {remaining} kali."
            )
    
    # 4. Mark OTP as verified/used
    otp_record.is_verified = True
    db.commit()
    
    # 5. Update User Password
    user = auth_service.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User dengan email tersebut tidak ditemukan."
        )
    
    user.password_hash = auth_service.hash_password(data.new_password)
    db.commit()
    
    return {"message": "Password berhasil diperbarui. Silakan masuk dengan password baru Anda."}


@router.post("/firebase", response_model=AuthResponse)
def firebase_auth_endpoint(data: FirebaseLoginRequest, db: Session = Depends(get_db)):
    # 1. Verifikasi ID Token Firebase secara lokal
    payload = verify_firebase_token(data.id_token)
    
    email = payload.get("email")
    uid = payload.get("sub")  # Firebase UID di claim 'sub'
    name = payload.get("name") or (email.split("@")[0] if email else "User")
    
    if not email or not uid:
        raise HTTPException(
            status_code=400,
            detail="Token Firebase tidak memiliki email atau UID yang valid."
        )
        
    # 2. Cari user di DB lokal atau buat baru
    user = db.query(User).filter(User.firebase_uid == uid).first()
    
    if not user:
        # Cek apakah ada akun lokal lama dengan email yang sama
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Hubungkan user lama dengan firebase_uid
            user.firebase_uid = uid
            db.commit()
            db.refresh(user)
        else:
            # Pendaftaran user baru secara otomatis
            user = User(
                email=email,
                name=name,
                firebase_uid=uid,
                password_hash=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
    # 3. Buat local token JWT untuk otorisasi endpoint backend lainnya
    token = auth_service.create_access_token({"sub": str(user.id)})
    
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=Token(access_token=token),
    )

