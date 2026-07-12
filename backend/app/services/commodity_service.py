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

import json
import os
from datetime import datetime


def _load_data() -> dict:
    path = os.path.join(os.path.dirname(__file__), "..", "data", "commodity_prices.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def get_all_commodities(region: str | None = None):
    """
    Return commodity prices.
    
    Args:
        region: Province name (e.g., "DKI Jakarta") or None/"Semua Provinsi" for national.
    
    Returns:
        List of commodity dicts with real BI prices.
    """
    data = _load_data()
    commodities = data.get("commodities", [])
    today_str = datetime.now().strftime("%d %b %Y")
    
    # Normalize province name
    province = None
    if region and region.strip().upper() not in ("", "SELURUH INDONESIA", "SEMUA PROVINSI"):
        province = region.strip()
    
    result = []
    for item in commodities:
        adj = dict(item)
        adj["date"] = today_str
        
        # If a specific province is requested, we check if we have province-specific data
        # Currently: province data from BI is only stored for Beras Kualitas Medium I
        # Future: add per-commodity province support when more data is available
        # For now: serve national prices for all provinces (accurate, from BI)
        
        result.append(adj)
    
    return result
