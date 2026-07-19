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
    with open(path, encoding="utf-8") as f:
        _cached_data = json.load(f)
        return _cached_data

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
