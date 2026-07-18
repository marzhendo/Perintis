import time
import requests
from jose import jwt, JWTError
from fastapi import HTTPException
from ..core.config import config

# Cache in-memory untuk sertifikat publik Google
_google_certs = {}
_certs_expiry = 0

def get_google_certs() -> dict:
    global _google_certs, _certs_expiry
    now = time.time()
    
    # Ambil sertifikat baru jika cache kosong atau sudah kedaluwarsa
    if not _google_certs or now >= _certs_expiry:
        try:
            res = requests.get(
                "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
                timeout=5
            )
            if res.status_code == 200:
                _google_certs = res.json()
                
                # Parse header Cache-Control untuk menentukan durasi kedaluwarsa cache
                cache_control = res.headers.get("Cache-Control", "")
                max_age = 3600
                for part in cache_control.split(","):
                    if "max-age" in part:
                        try:
                            max_age = int(part.split("=")[1].strip())
                        except ValueError:
                            pass
                _certs_expiry = now + max_age
        except Exception as e:
            # Jika request gagal tetapi kita punya cache lama, tetap gunakan cache tersebut
            if _google_certs:
                return _google_certs
            raise HTTPException(
                status_code=500,
                detail=f"Gagal mengambil sertifikat publik Google untuk verifikasi token: {e}"
            )
    return _google_certs

def verify_firebase_token(token: str) -> dict:
    """
    Verifikasi Firebase ID Token (JWT) secara lokal.
    Mengembalikan payload dict jika valid.
    Raise HTTPException 401 jika invalid atau expired.
    """
    project_id = config.FIREBASE_PROJECT_ID
    
    try:
        # 1. Ambil unverified header untuk mencocokkan 'kid'
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="Token tidak valid: Key ID (kid) tidak ditemukan.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Format token tidak valid.")
        
    # 2. Ambil sertifikat publik dari Google
    certs = get_google_certs()
    cert = certs.get(kid)
    if not cert:
        raise HTTPException(status_code=401, detail="Key ID token tidak cocok dengan sertifikat aktif Google.")
        
    # 3. Decode dan verifikasi tanda tangan token beserta claims-nya
    try:
        payload = jwt.decode(
            token,
            cert,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token Firebase telah kadaluarsa.")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token Firebase tidak valid: {str(e)}")
