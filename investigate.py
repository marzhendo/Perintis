import requests
import re
import json
import urllib.parse
from datetime import datetime

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

print('Fetching /TabelHarga/PasarTradisionalDaerah...')
resp = session.get('https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah', headers=headers, timeout=10)
print('Status:', resp.status_code)

ajax_urls = re.findall(r'url\s*:\s*[\'"]([^\'"]+)[\'"]', resp.text)
print('AJAX URLs on page:', set(ajax_urls))

# To find out the endpoint, I will just do a POST to /TabelHarga/WebSite/TabelHarga/GetGridDataDaerah
# According to common BI patterns:
# URL: https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah
# Let's try it.

temp_id_match = re.search(r'<input[^>]+id="temp_id"[^>]+value="([^"]+)"', resp.text)
temp_id = temp_id_match.group(1) if temp_id_match else ""
print('Temp ID:', temp_id)

json_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "id-ID,id;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://www.bi.go.id/hargapangan/TabelHarga/PasarTradisionalDaerah",
}

# The endpoint used in BI Tabel Harga is typically GetGridDataDaerah
payload = {
    "tipe_laporan": "2",  # 2 for province / region
    "periode": "1", # daily
    "commodity_id": "12",  # Cabai Rawit Merah
    "province_id": "13",   # DKI Jakarta
    "format": "json",
    "tempId": temp_id,
}

today = datetime.now().strftime("%Y-%m-%d")

# Another known endpoint is GetGridData1
# Let's search inside the HTML for the exact URL
matches = re.findall(r'/hargapangan/WebSite/TabelHarga/[a-zA-Z0-9_]+', resp.text)
if not matches:
    # Maybe it uses the same Home endpoints?
    print("Found endpoints:", set(re.findall(r'/hargapangan/WebSite/[a-zA-Z0-9_/]+', resp.text)))

# Let's try getting the form data action or AJAX endpoint:
# It usually calls GetGridDataDaerah or similar.
