from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies.auth import get_current_user_optional
from ..models.user import User
from ..schemas.schemas import CalculateRequest, ValidateRequest
from ..services import activity_service
from ..services.commodity_service import get_all_commodities
from ..services.financial_service import calculate_hpp, calculate_margin, calculate_bep, calculate_roi
from ..services.validator_service import validate_business_idea

router = APIRouter()


@router.get("/commodities")
def commodities():
    return get_all_commodities()


@router.post("/calculate")
def calculate(req: CalculateRequest, db: Session = Depends(get_db), current_user: User | None = Depends(get_current_user_optional)):
    margin = calculate_margin(req)
    if margin <= 0:
        return {
            "hpp_per_unit": req.bahan_baku_per_unit,
            "margin_per_unit": 0,
            "bep_unit_per_bulan": 0,
            "estimasi_balik_modal_bulan": 0,
            "error": "Harga jual harus lebih besar dari bahan baku per unit",
        }

    if current_user:
        activity_service.log_activity(db, current_user.id, "simulasi", f"Simulasi BEP untuk usaha")

    return {
        "hpp_per_unit": calculate_hpp(req),
        "margin_per_unit": margin,
        "bep_unit_per_bulan": calculate_bep(req),
        "estimasi_balik_modal_bulan": calculate_roi(req),
    }


@router.post("/validate")
def validate(req: ValidateRequest, db: Session = Depends(get_db), current_user: User | None = Depends(get_current_user_optional)):
    result = validate_business_idea(req)
    if current_user:
        skor = result.get("skor", "?")
        activity_service.log_activity(
            db, current_user.id, "validasi", 
            f"Validasi ide '{req.nama_usaha}' selesai — skor {skor}"
        )
    return result
