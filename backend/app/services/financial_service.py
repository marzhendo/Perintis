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
    # Asumsikan penjualan target adalah 1.5x dari volume BEP (standar kelayakan bisnis)
    target_sales = bep_units * 1.5
    monthly_profit = (target_sales * margin) - req.biaya_operasional_bulanan
    if monthly_profit <= 0:
        return 0
    return round(req.modal_awal / monthly_profit, 1)
