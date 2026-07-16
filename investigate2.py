import requests
import urllib.parse

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah',
}

session.get('https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah', headers=headers)

url = 'https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah'

params = {
    "price_type_id": "1",  # 1: Pasar Tradisional
    "province_id": "13",   # DKI Jakarta
    "regency_id": "",
    "market_id": "",
    "commodity_id": "12",  # Cabai Rawit Merah
    "category_id": "",
    "start_date": "2026-07-16",
    "end_date": "2026-07-16",
}

print("Trying GET to", url)
r = session.get(url, headers=headers, params=params)
print(r.status_code, len(r.text))
if r.status_code == 200:
    print(r.text[:500])
