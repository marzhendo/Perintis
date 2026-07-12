"""
PIHPS Service — Scraping Harga Pangan dari Bank Indonesia
Sumber: https://www.bi.go.id/hargapangan

Strategi scraping:
1. Harga Nasional: GET /hargapangan/WebSite/Home/GetChartData?comName=...&forInfo=true
   - Mengembalikan JSON dengan harga terkini per komoditas
2. Harga Per Provinsi: Extract 'jsonString' dari HTML halaman awal
   - Berisi harga 34 provinsi untuk 1 komoditas (Beras Kualitas Medium I sebagai default)
   - Data ini disimpan di commodity_prices.json under 'province_beras_medium_1'
"""

import json
import os
import re
import time
import requests
from datetime import datetime, timedelta


BASE_URL = "https://www.bi.go.id"
PAGE_URL = f"{BASE_URL}/hargapangan"
CHART_DATA_URL = f"{BASE_URL}/hargapangan/WebSite/Home/GetChartData"

# 21 komoditas sesuai tampilan BI hargapangan
COMMODITIES = [
    {"id": 1,  "name": "Beras Kualitas Bawah I",          "unit": "per Kg"},
    {"id": 2,  "name": "Beras Kualitas Bawah II",         "unit": "per Kg"},
    {"id": 3,  "name": "Beras Kualitas Medium I",         "unit": "per Kg"},
    {"id": 4,  "name": "Beras Kualitas Medium II",        "unit": "per Kg"},
    {"id": 5,  "name": "Beras Kualitas Super I",          "unit": "per Kg"},
    {"id": 6,  "name": "Beras Kualitas Super II",         "unit": "per Kg"},
    {"id": 7,  "name": "Bawang Merah Ukuran Sedang",      "unit": "per Kg"},
    {"id": 8,  "name": "Bawang Putih Ukuran Sedang",      "unit": "per Kg"},
    {"id": 9,  "name": "Cabai Merah Besar",               "unit": "per Kg"},
    {"id": 10, "name": "Cabai Merah Keriting",            "unit": "per Kg"},
    {"id": 11, "name": "Cabai Rawit Hijau",               "unit": "per Kg"},
    {"id": 12, "name": "Cabai Rawit Merah",               "unit": "per Kg"},
    {"id": 13, "name": "Daging Ayam Ras Segar",           "unit": "per Kg"},
    {"id": 14, "name": "Daging Sapi Kualitas 1",          "unit": "per Kg"},
    {"id": 15, "name": "Daging Sapi Kualitas 2",          "unit": "per Kg"},
    {"id": 16, "name": "Gula Pasir Lokal",                "unit": "per Kg"},
    {"id": 17, "name": "Gula Pasir Kualitas Premium",     "unit": "per Kg"},
    {"id": 18, "name": "Minyak Goreng Curah",             "unit": "per Liter"},
    {"id": 19, "name": "Minyak Goreng Kemasan Bermerk 1", "unit": "per Liter"},
    {"id": 20, "name": "Minyak Goreng Kemasan Bermerk 2", "unit": "per Liter"},
    {"id": 21, "name": "Telur Ayam Ras Segar",            "unit": "per Kg"},
]

# Alternative names to try if the standard name returns no data
# Note: BI website uses "Cabai Merah Keriting " (with trailing space)
COMMODITY_ALT_NAMES = {
    "Cabai Merah Keriting": ["Cabai Merah Keriting ", "Cabai Merah Keriting", "Cabe Merah Keriting"],
}

# Province IDs as per BI website
PROVINCE_IDS = {
    "Aceh": 1, "Sumatera Utara": 2, "Sumatera Barat": 3, "Riau": 4,
    "Kepulauan Riau": 5, "Jambi": 6, "Bengkulu": 7, "Sumatera Selatan": 8,
    "Kepulauan Bangka Belitung": 9, "Lampung": 10, "Banten": 11,
    "Jawa Barat": 12, "DKI Jakarta": 13, "Jawa Tengah": 14,
    "DI Yogyakarta": 15, "Jawa Timur": 16, "Bali": 17,
    "Nusa Tenggara Barat": 18, "Nusa Tenggara Timur": 19,
    "Kalimantan Barat": 20, "Kalimantan Selatan": 21, "Kalimantan Tengah": 22,
    "Kalimantan Timur": 23, "Kalimantan Utara": 24, "Gorontalo": 25,
    "Sulawesi Selatan": 26, "Sulawesi Tenggara": 27, "Sulawesi Tengah": 28,
    "Sulawesi Utara": 29, "Sulawesi Barat": 30, "Maluku": 31,
    "Maluku Utara": 32, "Papua": 33, "Papua Barat": 34,
}


def _create_session():
    """Create an authenticated session with BI website cookies."""
    session = requests.Session()
    session.get(PAGE_URL, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "id-ID,id;q=0.9",
    }, timeout=20)
    return session


def _get_temp_id(html: str) -> str:
    """Extract temp_id hidden input from HTML."""
    m = re.search(r'<input[^>]+id="temp_id"[^>]+value="([^"]+)"', html)
    return m.group(1) if m else ""


def _fetch_national_price(session, temp_id: str, com_name: str) -> dict | None:
    """Fetch the latest national price for a single commodity."""
    json_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "id-ID,id;q=0.9",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": PAGE_URL,
    }
    
    # Try primary name first, then alternative names
    names_to_try = COMMODITY_ALT_NAMES.get(com_name, [com_name])
    if com_name not in names_to_try:
        names_to_try = [com_name] + names_to_try
    
    for name in names_to_try:
        try:
            resp = session.get(CHART_DATA_URL, headers=json_headers, params={
                "tempId": temp_id,
                "comName": name,
                "forInfo": "true",
            }, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("data"):
                    item = data["data"][0]
                    return {
                        "price": int(item.get("nominal", 0)),
                        "date": item.get("date", "")[:10],
                        "changeRp": int(item.get("harga", 0)),
                        "fluc": float(item.get("fluc", 0) or 0),
                    }
        except Exception as e:
            print(f"  Warning: Error fetching '{name}': {e}")
        time.sleep(0.2)  # Small delay between requests
    
    return None


def _extract_province_prices(html: str) -> dict:
    """Extract per-province price data from embedded jsonString in HTML."""
    match = re.search(
        r'var jsonString = JSON\.parse\(JSON\.stringify\((\{.*?\})\)\)',
        html,
        re.DOTALL,
    )
    if not match:
        return {}
    
    try:
        raw = json.loads(match.group(1))
        result = {}
        for prov_name, pdata in raw.items():
            price = pdata.get("nilai")
            if price is not None:
                result[prov_name] = int(price)
        return result
    except Exception as e:
        print(f"  Warning: Error parsing province data: {e}")
        return {}


def _load_price_file() -> dict:
    """Load the current commodity_prices.json file."""
    path = os.path.join(os.path.dirname(__file__), "..", "data", "commodity_prices.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"commodities": [], "provinces": {}}


def _save_price_file(data: dict):
    """Save updated data to commodity_prices.json."""
    path = os.path.join(os.path.dirname(__file__), "..", "data", "commodity_prices.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _build_history(old_history: list, old_price: int, new_price: int) -> list:
    """Maintain a rolling 7-day price history."""
    if not old_history:
        return [new_price] * 7
    history = list(old_history)
    if len(history) >= 7:
        history = history[1:]
    history.append(new_price)
    return history


def update_prices():
    """
    Main function: Scrape BI hargapangan and update commodity_prices.json.
    - Fetches national prices for all 21 commodities
    - Fetches per-province prices from embedded jsonString (34 provinces)
    - Updates commodity_prices.json with real BI data, no synthetic multipliers
    """
    print(f"[{datetime.now()}] Starting BI hargapangan price update...")
    
    # Load current data
    data = _load_price_file()
    old_commodities = {c["name"]: c for c in data.get("commodities", [])}
    
    try:
        # Establish session
        session = _create_session()
        
        # Fetch main page HTML
        resp0 = session.get(PAGE_URL, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
        }, timeout=20)
        
        if resp0.status_code != 200:
            raise Exception(f"HTTP {resp0.status_code} on main page")
        
        html = resp0.text
        temp_id = _get_temp_id(html)
        print(f"  Session established, temp_id: {temp_id[:8]}...")
        
        # Step 1: Scrape national prices for all 21 commodities
        scraped_national = {}
        today_str = datetime.now().strftime("%d %b %Y")
        
        print("  Fetching national prices...")
        for com in COMMODITIES:
            result = _fetch_national_price(session, temp_id, com["name"])
            if result:
                scraped_national[com["name"]] = result
                price_date = result["date"]
                print(f"    {com['name']}: Rp {result['price']:,} ({price_date})")
            else:
                print(f"    {com['name']}: Failed to fetch — keeping previous price")
            time.sleep(0.1)
        
        # Step 2: Extract per-province prices from HTML jsonString
        province_prices = _extract_province_prices(html)
        if province_prices:
            print(f"  Per-province prices extracted: {len(province_prices)} provinces")
        else:
            print("  Warning: No per-province prices found in HTML")
        
        # Step 3: Build updated commodities list
        updated_commodities = []
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
                # Keep old price if scraping failed
                new_price = old_price
                change_rp = old.get("changeRp", 0)
                change_pct = old.get("change", 0.0)
                price_date = old.get("date", today_str)
            
            is_up = True if change_rp > 0 else (False if change_rp < 0 else None)
            
            # Format date: e.g., "2026-07-10" -> "10 Jul 2026"
            try:
                dt = datetime.strptime(price_date, "%Y-%m-%d")
                formatted_date = dt.strftime("%d %b %Y")
            except Exception:
                formatted_date = today_str
            
            updated_commodities.append({
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
        
        # Step 4: Assemble final data structure
        data["commodities"] = updated_commodities
        
        # Store province prices keyed by province name
        # province_prices contains prices for the DEFAULT commodity shown on BI map
        # (which is typically Beras Kualitas Medium I)
        if province_prices:
            data["province_beras_medium_i"] = province_prices
            data["province_data_source"] = "Bank Indonesia PIHPS — Beras Kualitas Medium I (peta awal)"
            data["province_data_updated"] = today_str
        
        data["last_updated"] = today_str
        data["source"] = "Bank Indonesia — Pusat Informasi Harga Pangan Strategis Nasional"
        data["source_url"] = "https://www.bi.go.id/hargapangan"
        
        _save_price_file(data)
        print(f"[{datetime.now()}] Price update completed. "
              f"{len(scraped_national)}/21 national prices scraped, "
              f"{len(province_prices)} provinces updated.")
    
    except Exception as e:
        print(f"[{datetime.now()}] Error during price update: {e}")
        # Keep existing data unchanged on error


def start_price_updater():
    """Background thread that updates prices daily at 07:00 local time."""
    print("Background Daily Price Updater Started (Source: Bank Indonesia PIHPS)")
    
    # Run once at startup
    try:
        update_prices()
    except Exception as e:
        print(f"Startup price update error: {e}")
    
    while True:
        try:
            now = datetime.now()
            next_run = now.replace(hour=7, minute=0, second=0, microsecond=0)
            if now >= next_run:
                next_run += timedelta(days=1)
            
            sleep_seconds = (next_run - now).total_seconds()
            # Sleep in small intervals to stay responsive
            time.sleep(min(sleep_seconds, 60))
            
            now_check = datetime.now()
            if now_check.hour == 7 and now_check.minute == 0:
                update_prices()
                time.sleep(65)  # Skip rest of this minute
        except Exception as e:
            print(f"Error in background updater: {e}")
            time.sleep(60)
