from ..schemas.schemas import CalculateRequest


def calculate_hpp(req: CalculateRequest) -> float:
    return req.bahan_baku_per_unit


def calculate_margin(req: CalculateRequest) -> float:
    return req.harga_jual_per_unit - req.bahan_baku_per_unit


def calculate_bep(req: CalculateRequest) -> int:
    margin = calculate_margin(req)
    if margin <= 0:
        return 0
    import math
    return math.ceil(req.biaya_operasional_bulanan / margin)


def calculate_roi(req: CalculateRequest) -> float:
    margin = calculate_margin(req)
    bep_units = calculate_bep(req)
    if bep_units <= 0:
        return 0
    monthly_profit = (bep_units * margin) - req.biaya_operasional_bulanan
    total_monthly = monthly_profit + req.biaya_operasional_bulanan
    if total_monthly <= 0:
        return 0
    return round(req.modal_awal / total_monthly, 1)
