from fastapi import APIRouter
from ..schemas.schemas import CalculateRequest, ValidateRequest
from ..services.commodity_service import get_all_commodities
from ..services.financial_service import calculate_hpp, calculate_margin, calculate_bep, calculate_roi
from ..services.validator_service import validate_business_idea

router = APIRouter()


@router.get("/commodities")
def commodities():
    return get_all_commodities()


@router.post("/calculate")
def calculate(req: CalculateRequest):
    margin = calculate_margin(req)
    if margin <= 0:
        return {
            "hpp_per_unit": req.bahan_baku_per_unit,
            "margin_per_unit": 0,
            "bep_unit_per_bulan": 0,
            "estimasi_balik_modal_bulan": 0,
            "error": "Harga jual harus lebih besar dari bahan baku per unit",
        }

    return {
        "hpp_per_unit": calculate_hpp(req),
        "margin_per_unit": margin,
        "bep_unit_per_bulan": calculate_bep(req),
        "estimasi_balik_modal_bulan": calculate_roi(req),
    }


@router.post("/validate")
def validate(req: ValidateRequest):
    return validate_business_idea(req)
