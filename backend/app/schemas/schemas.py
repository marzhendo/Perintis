from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CalculateRequest(BaseModel):
    modal_awal: float
    biaya_operasional_bulanan: float
    harga_jual_per_unit: float
    bahan_baku_per_unit: float


class ValidateRequest(BaseModel):
    nama_usaha: Optional[str] = "Usaha Baru"
    deskripsi_ide: str
    target_pasar: str
    lokasi: Optional[str] = "Seluruh Indonesia"


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


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
