from pydantic import BaseModel, EmailStr, field_validator, Field
import re
from typing import Optional
from datetime import datetime


class CalculateRequest(BaseModel):
    modal_awal: float
    biaya_operasional_bulanan: float
    harga_jual_per_unit: float
    bahan_baku_per_unit: float


class ValidateRequest(BaseModel):
    nama_usaha: Optional[str] = Field("Usaha Baru", max_length=100)
    deskripsi_ide: str = Field(..., max_length=300)
    target_pasar: str = Field(..., max_length=300)
    lokasi: Optional[str] = Field("Seluruh Indonesia", max_length=100)


class CopywriterRequest(BaseModel):
    product_name: str = Field(..., max_length=100)
    product_desc: str = Field(..., max_length=1000)
    target_audience: str = Field(..., max_length=50)
    tone: str = Field(..., max_length=50)


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str = Field(..., max_length=100)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        return v


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError('Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka')
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Dipakai di register & login: mengembalikan user data + token sekaligus."""
    user: UserResponse
    token: Token


class FirebaseLoginRequest(BaseModel):
    id_token: str

