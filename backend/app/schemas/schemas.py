from pydantic import BaseModel
from typing import Optional


class CalculateRequest(BaseModel):
    modal_awal: float
    biaya_operasional_bulanan: float
    harga_jual_per_unit: float
    bahan_baku_per_unit: float


class ValidateRequest(BaseModel):
    nama_usaha: Optional[str] = "Usaha Baru"
    deskripsi_ide: str
    target_pasar: str
