const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app';

export async function validateBusiness(form) {
  // Tambahkan timeout eksplisit di FE: 25 detik (karena worst-case BE ~20 detik)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${BASE_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_usaha: form.businessName || 'Usaha Baru',
        deskripsi_ide: form.description,
        target_pasar: form.targetMarket.join(', '),
        lokasi: form.location || 'Seluruh Indonesia',
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    return {
      score: data.skor_bintang ?? 3.0,
      // FIX: Gunakan verdict dari Backend, JANGAN override logic dengan threshold yang beda
      verdict: data.verdict ?? 'Belum bisa dinilai',
      market: data.analisis?.market ?? 'Koneksi ke sistem analisis terganggu.',
      competitor: data.analisis?.competitor ?? 'Koneksi ke sistem analisis terganggu.',
      trend: data.analisis?.trend ?? 'Koneksi ke sistem analisis terganggu.',
      risk: data.analisis?.risiko ?? 'Koneksi ke sistem analisis terganggu.',
      potential: data.analisis?.potensi ?? 'Koneksi ke sistem analisis terganggu.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getFallbackResult() {
  // FIX: Ubah skor sempurna yang hardcoded (4.7) menjadi netral
  // Fallback ini hanya muncul jika server/network mati total.
  return {
    score: 3.0,
    verdict: 'Menunggu Analisis',
    market: 'Sistem analisis sedang tidak dapat diakses saat ini.',
    competitor: 'Mohon periksa koneksi internet Anda atau coba lagi nanti.',
    trend: 'Sistem analisis sedang tidak dapat diakses saat ini.',
    risk: 'Sistem analisis sedang tidak dapat diakses saat ini.',
    potential: 'Sistem analisis sedang tidak dapat diakses saat ini.',
  };
}
