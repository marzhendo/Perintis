import random
from ..schemas.schemas import ValidateRequest


def validate_business_idea(req: ValidateRequest) -> dict:
    desc = req.deskripsi_ide.lower()
    panjang = len(desc)

    score = 3.0

    keywords_market = [
        "pasar", "target", "konsumen", "pelanggan", "kebutuhan",
        "masalah", "solusi", "lokal", "komunitas", "segmentasi"
    ]
    keywords_bisnis = [
        "modal", "harga", "jual", "biaya", "untung", "omzet",
        "produksi", "distribusi", "pemasaran", "promosi"
    ]
    keywords_trend = [
        "digital", "online", "aplikasi", "teknologi", "ramah lingkungan",
        "tren", "modern", "inovatif", "kreatif", "unik"
    ]

    market_count = sum(1 for k in keywords_market if k in desc)
    bisnis_count = sum(1 for k in keywords_bisnis if k in desc)
    trend_count = sum(1 for k in keywords_trend if k in desc)

    if market_count >= 3:
        score += 0.5
    elif market_count >= 1:
        score += 0.2

    if bisnis_count >= 3:
        score += 0.5
    elif bisnis_count >= 1:
        score += 0.2

    if trend_count >= 2:
        score += 0.3
    elif trend_count >= 1:
        score += 0.1

    if panjang > 100:
        score += 0.3
    elif panjang > 50:
        score += 0.1

    score = min(score, 5.0)
    score = round(score, 1)

    if score >= 4.0:
        verdict = "Sangat Layak"
    elif score >= 3.0:
        verdict = "Layak dengan Catatan"
    else:
        verdict = "Kurang Layak"

    market_analysis = _get_market_analysis(market_count, desc)
    competitor_analysis = _get_competitor_analysis(bisnis_count, desc)
    trend_analysis = _get_trend_analysis(trend_count, desc)
    risk_analysis = _get_risk_analysis(desc)
    potential_analysis = _get_potential_analysis(score, desc)

    return {
        "skor_bintang": score,
        "verdict": verdict,
        "analisis": {
            "market": market_analysis,
            "competitor": competitor_analysis,
            "trend": trend_analysis,
            "risiko": risk_analysis,
            "potensi": potential_analysis,
        },
    }


def _get_market_analysis(market_count: int, desc: str) -> str:
    if market_count >= 3:
        return (
            "Tinggi. Deskripsi menunjukkan pemahaman yang baik tentang "
            "target pasar dan kebutuhan konsumen. Potensi adopsi produk tinggi."
        )
    elif market_count >= 1:
        return (
            "Sedang. Terdapat identifikasi pasar namun belum spesifik. "
            "Disarankan melakukan riset pasar lebih mendalam."
        )
    return (
        "Perlu Dikaji. Belum terlihat analisis pasar yang jelas. "
        "Pertimbangkan untuk mendefinisikan target konsumen secara lebih spesifik."
    )


def _get_competitor_analysis(bisnis_count: int, desc: str) -> str:
    if bisnis_count >= 3:
        return (
            "Rendah - Sedang. Ide memiliki kejelasan model bisnis yang cukup baik. "
            "Analisis kompetitor akan membantu memperkuat posisi pasar."
        )
    elif bisnis_count >= 1:
        return (
            "Sedang. Beberapa aspek bisnis telah dipertimbangkan. "
            "Disarankan untuk mempelajari kompetitor langsung di lapangan."
        )
    return (
        "Perlu Dipertimbangkan. Belum ada analisis kompetitor atau model bisnis "
        "yang jelas. Riset kompetitor sangat disarankan."
    )


def _get_trend_analysis(trend_count: int, desc: str) -> str:
    if trend_count >= 2:
        return (
            "Positif. Ide selaras dengan tren pasar terkini, terutama "
            "dalam aspek digital dan inovasi."
        )
    elif trend_count >= 1:
        return (
            "Netral. Terdapat sedikit elemen tren, namun bisa diperkuat dengan "
            "pendekatan yang lebih modern."
        )
    return (
        "Tradisional. Ide cenderung konvensional. "
        "Pertimbangkan integrasi teknologi atau kanal digital untuk daya saing."
    )


def _get_risk_analysis(desc: str) -> str:
    if len(desc) > 100:
        return (
            "Fluktuasi harga bahan baku dan perubahan perilaku konsumen "
            "merupakan risiko utama. Disarankan memiliki cadangan modal."
        )
    return (
        "Ketidakpastian pasar dan keterbatasan modal awal menjadi risiko "
        "utama. Disarankan memulai dalam skala kecil terlebih dahulu."
    )


def _get_potential_analysis(score: float, desc: str) -> str:
    if score >= 4.0:
        return (
            "Sangat Baik. Skala mikro yang menjanjikan dengan peluang "
            "ekspansi waralaba mikro tinggi setelah 6 bulan stabil."
        )
    elif score >= 3.0:
        return (
            "Cukup Baik. Potensi berkembang ada dengan catatan perbaikan "
            "pada strategi pemasaran dan efisiensi operasional."
        )
    return (
        "Masih Perlu Pengembangan. Disarankan mengikuti program inkubasi "
        "bisnis atau pendampingan UMKM sebelum memulai."
    )
