from fastapi import APIRouter, HTTPException
from ..schemas.schemas import CalculateRequest, ValidateRequest
from ..services.commodity_service import get_all_commodities
from ..services.financial_service import calculate_hpp, calculate_margin, calculate_bep, calculate_roi
from ..services.validator_service import validate_business_idea

router = APIRouter()


@router.get("/commodities")
def commodities():
    try:
        data = get_all_commodities()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/calculate")
def calculate(req: CalculateRequest):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate")
def validate(req: ValidateRequest):
    try:
        result = validate_business_idea(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
