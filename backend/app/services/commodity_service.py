"""
Commodity Service — Sajikan data harga pangan dari Bank Indonesia.
Data diambil dari commodity_prices.json yang diperbarui setiap hari jam 7 pagi
oleh pihps_service.py yang melakukan scraping dari www.bi.go.id/hargapangan.

Endpoint GET /commodities?province={nama_provinsi}:
  - Tanpa parameter / province='Semua Provinsi': harga nasional
  - province='DKI Jakarta': harga nasional (data provinsi per komoditas belum tersedia untuk semua komoditas)
  
Catatan: Data harga per provinsi dari BI hanya tersedia untuk komoditas yang
sedang ditampilkan di peta vectormap halaman awal (default: Beras Kualitas Medium I).
Untuk komoditas lain, harga nasional yang digunakan.
"""
from __future__ import annotations
import json
import os
from datetime import datetime


_cached_data = None

def _load_data() -> dict:
    global _cached_data
    if _cached_data is not None:
        return _cached_data
    path = os.path.join(os.path.dirname(__file__), "..", "data", "commodity_prices.json")
    try:
        with open(path, encoding="utf-8") as f:
            _cached_data = json.load(f)
            return _cached_data
    except FileNotFoundError:
        # Fallback default prices (Bank Indonesia prices) to prevent server crash
        fallback_data = {
            "commodities": [
                { "id": 1,  "name": "Beras Kualitas Bawah I",          "unit": "per Kg",    "price": 14700,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [14700, 14700, 14700, 14700, 14700, 14700, 14700] },
                { "id": 2,  "name": "Beras Kualitas Bawah II",         "unit": "per Kg",    "price": 14550,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [14550, 14550, 14550, 14550, 14550, 14550, 14550] },
                { "id": 3,  "name": "Beras Kualitas Medium I",         "unit": "per Kg",    "price": 16350,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [16350, 16350, 16350, 16350, 16350, 16350, 16350] },
                { "id": 4,  "name": "Beras Kualitas Medium II",        "unit": "per Kg",    "price": 16150,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [16150, 16150, 16150, 16150, 16150, 16150, 16150] },
                { "id": 5,  "name": "Beras Kualitas Super I",          "unit": "per Kg",    "price": 17650,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [17650, 17650, 17650, 17650, 17650, 17650, 17650] },
                { "id": 6,  "name": "Beras Kualitas Super II",         "unit": "per Kg",    "price": 17150,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [17150, 17150, 17150, 17150, 17150, 17150, 17150] },
                { "id": 7,  "name": "Bawang Merah Ukuran Sedang",      "unit": "per Kg",    "price": 45650,  "change": -4.5, "changeRp": -2150, "isUp": False, "history": [47800, 47500, 47000, 46500, 46200, 45900, 45650] },
                { "id": 8,  "name": "Bawang Putih Ukuran Sedang",      "unit": "per Kg",    "price": 44550,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [44550, 44550, 44550, 44550, 44550, 44550, 44550] },
                { "id": 9,  "name": "Cabai Merah Besar",               "unit": "per Kg",    "price": 48850,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [48850, 48850, 48850, 48850, 48850, 48850, 48850] },
                { "id": 10, "name": "Cabai Merah Keriting",            "unit": "per Kg",    "price": 46000,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [46000, 46000, 46000, 46000, 46000, 46000, 46000] },
                { "id": 11, "name": "Cabai Rawit Hijau",               "unit": "per Kg",    "price": 50350,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [50350, 50350, 50350, 50350, 50350, 50350, 50350] },
                { "id": 12, "name": "Cabai Rawit Merah",               "unit": "per Kg",    "price": 59850,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [59850, 59850, 59850, 59850, 59850, 59850, 59850] },
                { "id": 13, "name": "Daging Ayam Ras Segar",           "unit": "per Kg",    "price": 37000,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [37000, 37000, 37000, 37000, 37000, 37000, 37000] },
                { "id": 14, "name": "Daging Sapi Kualitas 1",          "unit": "per Kg",    "price": 150550, "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [150550, 150550, 150550, 150550, 150550, 150550, 150550] },
                { "id": 15, "name": "Daging Sapi Kualitas 2",          "unit": "per Kg",    "price": 141950, "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [141950, 141950, 141950, 141950, 141950, 141950, 141950] },
                { "id": 16, "name": "Gula Pasir Lokal",                "unit": "per Kg",    "price": 19100,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [19100, 19100, 19100, 19100, 19100, 19100, 19100] },
                { "id": 17, "name": "Gula Pasir Kualitas Premium",     "unit": "per Kg",    "price": 20300,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [20300, 20300, 20300, 20300, 20300, 20300, 20300] },
                { "id": 18, "name": "Minyak Goreng Curah",             "unit": "per Liter", "price": 20550,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [20550, 20550, 20550, 20550, 20550, 20550, 20550] },
                { "id": 19, "name": "Minyak Goreng Kemasan Bermerk 1", "unit": "per Liter", "price": 24250,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [24250, 24250, 24250, 24250, 24250, 24250, 24250] },
                { "id": 20, "name": "Minyak Goreng Kemasan Bermerk 2", "unit": "per Liter", "price": 23400,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [23400, 23400, 23400, 23400, 23400, 23400, 23400] },
                { "id": 21, "name": "Telur Ayam Ras Segar",            "unit": "per Kg",    "price": 28950,  "change": 0.0,  "changeRp": 0,     "isUp": None,  "history": [28950, 28950, 28950, 28950, 28950, 28950, 28950] }
            ],
            "provinces": {}
        }
        return fallback_data

def invalidate_commodity_cache():
    global _cached_data
    _cached_data = None


def get_all_commodities(region: str | None = None):
    """
    Return commodity prices.
    
    Args:
        region: Province name (e.g., "DKI Jakarta") or None/"Semua Provinsi" for national.
    
    Returns:
        List of commodity dicts with real BI prices.
    """
    data = _load_data()
    national = data.get("national", data.get("commodities", []))
    provinces = data.get("provinces", {})
    today_str = datetime.now().strftime("%d %b %Y")
    
    # Normalize province name
    province = None
    if region and region.strip().upper() not in ("", "SELURUH INDONESIA", "SEMUA PROVINSI"):
        province = region.strip()
    
    result = []
    
    if province and province in provinces:
        # Province data available
        prov_items = {item["name"].strip(): item["price"] for item in provinces[province]}
        for item in national:
            adj = dict(item)
            adj["date"] = today_str
            adj["source"] = "provincial"
            # Some names have slight differences, try exact and stripped match
            base_name = item["name"].strip()
            # If still not found, check alt names if we want, but strip usually fixes trailing spaces
            matched_price = prov_items.get(base_name)
            if matched_price is None:
                # also try Cabai Merah Keriting  with space if it was in the data
                pass
            
            if matched_price is not None:
                adj["price"] = matched_price
                adj["changeRp"] = 0
                adj["change"] = 0.0
                adj["isUp"] = None
            else:
                adj["source"] = "national_fallback"
            result.append(adj)
    else:
        # Fallback to national
        for item in national:
            adj = dict(item)
            adj["date"] = today_str
            if province:
                adj["source"] = "national_fallback"
            else:
                adj["source"] = "national"
            result.append(adj)
            
    return result
