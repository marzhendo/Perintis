import requests
from datetime import datetime
import json

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah',
}

today = datetime.now().strftime("%Y-%m-%d")

url = 'https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah'

# Try different combinations
for comcat in ["", "1", "12", "I", "II"]:
    for tipe_laporan in ["1", "2"]:
        params = {
            "price_type_id": "1",  
            "comcat_id": comcat,  
            "province_id": "13",   
            "regency_id": "",
            "market_id": "",
            "tipe_laporan": tipe_laporan,
            "start_date": "2026-07-16",
            "end_date": "2026-07-16",
        }
        r = session.get(url, headers=headers, params=params)
        try:
            data = r.json()
            if data.get('data'):
                print(f"SUCCESS with comcat_id='{comcat}' and tipe_laporan='{tipe_laporan}'")
                print("Length:", len(data['data']))
                break
        except Exception:
            pass
