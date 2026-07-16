from __future__ import annotations
import json
import logging
import os
import time
from datetime import datetime, timezone
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel, ValidationError

from ..core.config import config

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Cache configuration
# ---------------------------------------------------------------------------

_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
_CACHE_FILE = os.path.join(_DATA_DIR, "trends_cache.json")
_CACHE_TTL_SECONDS = 24 * 60 * 60  # 24 jam


# ---------------------------------------------------------------------------
# Pydantic models — dipakai sebagai response_schema ke Gemini
# ---------------------------------------------------------------------------

class TrendPreset(BaseModel):
    """Data untuk pre-fill form Validator saat user klik 'Gunakan Ide Ini'."""
    business_name: str
    category: Literal["Kuliner", "Jasa", "Ritel", "Produksi"]
    description: str


class TrendItem(BaseModel):
    name: str
    desc: str
    viral_score: int          # 0–100
    longevity: Literal[
        "Jangka Pendek",
        "Sedang-Panjang",
        "Jangka Panjang",
        "Sangat Panjang",
    ]
    capital_label: Literal[
        "Kecil (< Rp 5jt)",
        "Menengah (Rp 5-15jt)",
        "Besar (> Rp 15jt)",
    ]
    preset: TrendPreset


class TrendsResponse(BaseModel):
    trends: list[TrendItem]   # target 4–6 item


# ---------------------------------------------------------------------------
# Fallback constant — dipindah dari FE VIRAL_TRENDS, jadi safety net
# JANGAN hapus atau ubah isi array ini tanpa diskusi — ini last-resort data.
# ---------------------------------------------------------------------------

_FALLBACK_TRENDS: list[dict] = [
    {
        "name": "Es Teh Manis Solo",
        "desc": "Minuman es teh manis ukuran jumbo dengan wangi melati khas Jawa Tengah seharga Rp 3.000.",
        "viral_score": 95,
        "longevity": "Sedang-Panjang",
        "capital_label": "Kecil (< Rp 5jt)",
        "preset": {
            "business_name": "Es Teh Manis Solo Maknyus",
            "category": "Kuliner",
            "description": (
                "Menyediakan minuman es teh manis ukuran jumbo dengan wangi melati "
                "khas racikan lokal dengan harga Rp 3.000 per cup."
            ),
        },
    },
    {
        "name": "Croissant Geprek (Croger)",
        "desc": "Perpaduan pastry croissant mentega yang renyah dengan isi ayam geprek sambal bawang super pedas.",
        "viral_score": 88,
        "longevity": "Jangka Pendek",
        "capital_label": "Menengah (Rp 5-15jt)",
        "preset": {
            "business_name": "Croger - Croissant Geprek Pedas",
            "category": "Kuliner",
            "description": (
                "Perpaduan pastry renyah croissant mentega dengan isian ayam geprek "
                "sambal bawang super pedas."
            ),
        },
    },
    {
        "name": "Toko Kelontong Pojok Madura",
        "desc": "Toko kelontong modern yang buka 24 jam dengan display rapi, menjual sembako dengan harga kompetitif.",
        "viral_score": 90,
        "longevity": "Sangat Panjang",
        "capital_label": "Besar (> Rp 15jt)",
        "preset": {
            "business_name": "Toko Kelontong Berkah 24 Jam",
            "category": "Ritel",
            "description": (
                "Toko kelontong yang buka 24 jam dengan penataan barang rapi, "
                "pelayanan ramah, dan menjual kebutuhan sembako pokok."
            ),
        },
    },
    {
        "name": "Jasa Cuci Sepatu (Shoes Clean)",
        "desc": "Layanan cuci sepatu premium dengan sabun khusus ramah lingkungan dan sistem jemput-antar.",
        "viral_score": 80,
        "longevity": "Jangka Panjang",
        "capital_label": "Kecil (< Rp 5jt)",
        "preset": {
            "business_name": "ShoesClean Premium Laundry",
            "category": "Jasa",
            "description": (
                "Jasa pembersihan sepatu premium dengan sabun khusus ramah lingkungan, "
                "pembersihan noda membandel, dan gratis jemput-antar."
            ),
        },
    },
]


# ---------------------------------------------------------------------------
# Gemini client — reuse pola dari validator_service.py
# TIDAK ada guard prompt injection karena tidak ada input teks bebas dari user.
# ---------------------------------------------------------------------------

_GEMINI_MODEL = "gemini-3.1-flash-lite"

_SYSTEM_INSTRUCTION = (
    "Kamu adalah analis tren bisnis UMKM Indonesia. "
    "Tugasmu adalah mengidentifikasi 4-6 ide bisnis mikro yang sedang tren dan viral "
    "di masyarakat Indonesia saat ini, khususnya di sektor kuliner, jasa, ritel, dan produksi skala UMKM. "
    "Berikan analisis yang realistis berdasarkan kondisi pasar Indonesia terkini. "
    "Fokus pada usaha yang bisa dijalankan dengan modal terbatas dan memiliki potensi viral "
    "di media sosial atau dari mulut ke mulut. "
    "Setiap item harus unik dan mencerminkan tren aktual, bukan ide bisnis generik. "
    "PENTING tentang viral_score: ini adalah integer dalam skala 0 hingga 100 (BUKAN 0-10). "
    "Karena kita hanya mendaftar tren yang sudah terbukti viral, nilai yang masuk akal "
    "adalah antara 60-95. Nilai di bawah 60 tidak pantas untuk daftar 'tren viral'. "
    "desc harus singkat 1-2 kalimat yang menarik dan spesifik untuk ditampilkan di kartu UI. "
    "preset.description harus lebih detail (2-3 kalimat) untuk membantu user memulai bisnis tersebut."
)


def _call_gemini() -> list[dict]:
    """
    Memanggil Gemini API dan mengembalikan list of trend dicts.

    Tidak ada retry — caller (get_viral_trends) langsung fallback jika gagal.
    Ini disengaja: tren bukan critical path, berbeda dengan Validator.

    Raises:
        RuntimeError: jika Gemini gagal (API error, timeout, parse error).
    """
    client = genai.Client(
        api_key=config.GEMINI_API_KEY,
        http_options=types.HttpOptions(timeout=10_000),  # 10 detik
    )

    prompt = (
        "Generate 4-6 ide bisnis mikro/UMKM yang sedang viral atau sangat tren di Indonesia saat ini. "
        "Pastikan variatif antara kategori kuliner, jasa, dan ritel. "
        "Pilih ide yang benar-benar sedang naik daun — bukan ide klasik yang sudah ada sejak lama."
    )

    try:
        response = client.models.generate_content(
            model=_GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=TrendsResponse,
                thinking_config=types.ThinkingConfig(thinking_level="minimal"),
            ),
        )
    except Exception as exc:
        raise RuntimeError(
            f"Gemini trends API call failed [{type(exc).__name__}]: {exc}"
        ) from exc

    try:
        result = TrendsResponse.model_validate_json(response.text)
    except (ValidationError, ValueError, TypeError) as exc:
        raise RuntimeError(
            f"Gemini trends response could not be parsed: {exc}\n"
            f"Raw response: {response.text!r}"
        ) from exc

    return [item.model_dump() for item in result.trends]


# ---------------------------------------------------------------------------
# Cache helpers — file JSON sederhana di app/data/trends_cache.json
# ---------------------------------------------------------------------------

def _read_cache() -> tuple[list[dict] | None, bool]:
    """
    Baca cache file.
    Returns:
        (trends, is_ai_generated) jika cache ada dan masih fresh (< 24 jam).
        (None, False) jika cache tidak ada, rusak, atau expired.
    """
    try:
        with open(_CACHE_FILE, "r", encoding="utf-8") as f:
            cache = json.load(f)

        age_seconds = time.time() - cache.get("timestamp", 0)
        if age_seconds < _CACHE_TTL_SECONDS:
            logger.debug(
                "Cache hit — age %.0f seconds (TTL %d seconds)",
                age_seconds,
                _CACHE_TTL_SECONDS,
            )
            return cache["trends"], cache.get("is_ai_generated", False)

        logger.info(
            "Cache expired — age %.0f seconds exceeds TTL %d seconds",
            age_seconds,
            _CACHE_TTL_SECONDS,
        )
    except FileNotFoundError:
        logger.info("Cache file not found at %s — will generate fresh.", _CACHE_FILE)
    except (KeyError, json.JSONDecodeError) as exc:
        logger.warning("Cache file corrupt (%s) — will regenerate.", exc)

    return None, False


def _write_cache(trends: list[dict], *, is_ai_generated: bool) -> None:
    """
    Tulis trends ke cache file.
    Tidak raise exception — kegagalan write hanya di-log sebagai warning.
    """
    os.makedirs(_DATA_DIR, exist_ok=True)
    cache_data = {
        "timestamp": time.time(),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "is_ai_generated": is_ai_generated,
        "trends": trends,
    }
    try:
        with open(_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
        logger.info(
            "Trends cached successfully (%d items, is_ai_generated=%s)",
            len(trends),
            is_ai_generated,
        )
    except OSError as exc:
        logger.warning("Failed to write trends cache: %s", exc)


# ---------------------------------------------------------------------------
# Public entry point — tidak pernah raise exception ke route layer
# ---------------------------------------------------------------------------

def get_viral_trends() -> dict:
    """
    Mengembalikan data tren bisnis viral.

    Urutan prioritas:
      1. Cache fresh (< 24 jam) — return langsung, TIDAK panggil Gemini
      2. Gemini API — generate baru, simpan ke cache, return hasilnya
      3. Fallback hardcoded — jika Gemini gagal, return _FALLBACK_TRENDS
         (fallback TIDAK di-cache, sehingga request berikutnya tetap
          mencoba Gemini lagi setelah Gemini recover)

    Return shape: {"trends": list[dict], "is_ai_generated": bool}
    """
    # Step 1: Cek cache
    cached_trends, is_ai = _read_cache()
    if cached_trends is not None:
        logger.info(
            "Serving trends from cache (is_ai_generated=%s, %d items)",
            is_ai,
            len(cached_trends),
        )
        return {"trends": cached_trends, "is_ai_generated": is_ai}

    # Step 2: Cache miss/expired — panggil Gemini
    if not config.gemini_available:
        logger.warning(
            "GEMINI_API_KEY not set — skipping Gemini call, using fallback trends."
        )
    else:
        logger.info("Generating fresh trends via Gemini API...")
        try:
            trends = _call_gemini()
            _write_cache(trends, is_ai_generated=True)
            logger.info("Gemini trends generated and cached (%d items).", len(trends))
            return {"trends": trends, "is_ai_generated": True}
        except RuntimeError as exc:
            logger.warning(
                "Gemini trends generation failed — using fallback. Reason: %s", exc
            )

    # Step 3: Fallback — pakai data hardcoded
    # Fallback TIDAK di-cache agar request berikutnya mencoba Gemini lagi.
    logger.info("Serving fallback hardcoded trends (%d items).", len(_FALLBACK_TRENDS))
    return {"trends": _FALLBACK_TRENDS, "is_ai_generated": False}
