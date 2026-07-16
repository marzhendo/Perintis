import json
from datetime import datetime
import os
import re

with open('backend/app/services/commodity_service.py', 'r', encoding='utf-8') as f:
    com_code = f.read()

new_get_all = '''def get_all_commodities(region: str | None = None):
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
'''

com_code = re.sub(r'def get_all_commodities\(.*', new_get_all, com_code, flags=re.DOTALL)
with open('backend/app/services/commodity_service.py', 'w', encoding='utf-8') as f:
    f.write(com_code)
