import json
import re
import os

with open('backend/app/services/pihps_service.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_code = '''
def _fetch_province_prices(session, province_id: str, today_str_ymd: str, today_str_dmy: str) -> list:
    url = 'https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah',
    }
    params = {
        "price_type_id": "1",  
        "comcat_id": "",  
        "province_id": province_id,   
        "regency_id": "",
        "market_id": "",
        "tipe_laporan": "1",
        "start_date": today_str_ymd,
        "end_date": today_str_ymd,
    }
    try:
        resp = session.get(url, headers=headers, params=params, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            items = data.get("data", [])
            results = []
            for item in items:
                # We only want items with level == 2 (actual commodities, not categories)
                if item.get("level") == 2:
                    name = item.get("name", "")
                    raw_price = item.get(today_str_dmy)
                    
                    if raw_price and isinstance(raw_price, str):
                        price_str = raw_price.replace(",", "").replace(".", "").strip()
                        if price_str and price_str.isdigit():
                            results.append({"name": name, "price": int(price_str)})
            return results
    except Exception as e:
        logger.warning(f"Error fetching province {province_id}: {e}")
    return []

def update_prices():
    """
    Main function: Scrape BI hargapangan and update commodity_prices.json.
    - Fetches national prices for all 21 commodities
    - Fetches per-province prices from GetGridDataDaerah endpoint (34 provinces)
    - Updates commodity_prices.json with structured format
    """
    logger.info("Starting BI hargapangan price update...")
    
    data = _load_price_file()
    # Migrate old format if needed
    old_national = data.get("national", data.get("commodities", []))
    old_commodities = {c["name"]: c for c in old_national}
    
    try:
        session = _create_session()
        
        resp0 = session.get(PAGE_URL, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
        }, timeout=20)
        if resp0.status_code != 200:
            raise Exception(f"HTTP {resp0.status_code} on main page")
        
        html = resp0.text
        temp_id = _get_temp_id(html)
        logger.info(f"Session established, temp_id: {temp_id[:8]}...")
        
        scraped_national = {}
        now = datetime.now()
        today_str = now.strftime("%d %b %Y")
        today_str_ymd = now.strftime("%Y-%m-%d")
        today_str_dmy = now.strftime("%d/%m/%Y")
        if today_str_dmy.startswith("0"):
            # BI format uses no leading zero on day if it's 1-9? Wait, "16/07/2026" uses leading zero.
            # But let's check. Wait! In my previous curl it was "16/07/2026". We should stick to %d/%m/%Y.
            pass
        
        logger.info("Fetching national prices...")
        for com in COMMODITIES:
            result = _fetch_national_price(session, temp_id, com["name"])
            if result:
                scraped_national[com["name"]] = result
                price_date = result["date"]
                logger.info(f"  {com['name']}: Rp {result['price']:,} ({price_date})")
            else:
                logger.warning(f"  {com['name']}: Failed to fetch — keeping previous price")
            time.sleep(0.1)
            
        updated_national = []
        for com in COMMODITIES:
            old = old_commodities.get(com["name"], {})
            old_price = old.get("price", 0)
            old_history = old.get("history", [])
            
            scraped = scraped_national.get(com["name"])
            if scraped:
                new_price = scraped["price"]
                change_rp = scraped["changeRp"]
                change_pct = scraped["fluc"]
                price_date = scraped["date"]
            else:
                new_price = old_price
                change_rp = old.get("changeRp", 0)
                change_pct = old.get("change", 0.0)
                price_date = old.get("date", today_str)
            
            is_up = True if change_rp > 0 else (False if change_rp < 0 else None)
            
            try:
                dt = datetime.strptime(price_date, "%Y-%m-%d")
                formatted_date = dt.strftime("%d %b %Y")
            except Exception:
                formatted_date = today_str
            
            updated_national.append({
                "id": com["id"],
                "name": com["name"],
                "unit": com["unit"],
                "price": new_price,
                "change": round(change_pct, 2),
                "changeRp": change_rp,
                "isUp": is_up,
                "date": formatted_date,
                "history": _build_history(old_history, old_price, new_price),
            })
            
        logger.info("Fetching per-province prices...")
        old_provinces = data.get("provinces", {})
        new_provinces = dict(old_provinces)
        success_count = 0
        
        for prov_name, prov_id in PROVINCE_IDS.items():
            prov_data = _fetch_province_prices(session, str(prov_id), today_str_ymd, today_str_dmy)
            if prov_data:
                new_provinces[prov_name] = prov_data
                success_count += 1
                logger.info(f"  Fetched {len(prov_data)} commodities for {prov_name}")
            else:
                logger.warning(f"  Failed to fetch commodities for {prov_name}, keeping old data if exists.")
            time.sleep(0.5) # Gentle delay between provinces
            
        # Build final data
        final_data = {
            "last_updated": today_str,
            "national": updated_national,
            "provinces": new_provinces,
            "source": "Bank Indonesia — Pusat Informasi Harga Pangan Strategis Nasional",
            "source_url": "https://www.bi.go.id/hargapangan"
        }
        
        _save_price_file(final_data)
        logger.info(f"Price update completed. {len(scraped_national)}/21 national prices, {success_count}/{len(PROVINCE_IDS)} provinces updated.")
        
    except Exception as e:
        logger.error(f"Error during price update: {e}", exc_info=True)
'''

pattern = r'def update_prices\(\):.*?(?=def is_data_stale_or_empty)'
replacement = new_code.strip() + "\\n\\n"

modified_code = re.sub(pattern, replacement, code, flags=re.DOTALL)
modified_code = re.sub(r'def _extract_province_prices\(.*?(?=def _load_price_file\(\):)', '', modified_code, flags=re.DOTALL)

with open('backend/app/services/pihps_service.py', 'w', encoding='utf-8') as f:
    f.write(modified_code)

print("pihps_service.py modified.")

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
        prov_items = {item["name"]: item["price"] for item in provinces[province]}
        for item in national:
            adj = dict(item)
            adj["date"] = today_str
            adj["source"] = "provincial"
            if item["name"] in prov_items:
                adj["price"] = prov_items[item["name"]]
                adj["changeRp"] = 0 # Cannot compute change yet without history
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

print("commodity_service.py modified.")
