const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app';

export async function validateBusiness(form) {
  const response = await fetch(`${BASE_URL}/api/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nama_usaha: form.businessName || 'Usaha Baru',
      deskripsi_ide: form.description,
      target_pasar: form.targetMarket.join(', '),
    }),
  });

  if (!response.ok) throw new Error('API Error');

  const data = await response.json();
  return {
    score: data.skor_bintang ?? 4.7,
    verdict: data.skor_bintang >= 4.5 ? 'Sangat Layak' : data.skor_bintang >= 3.5 ? 'Layak dengan Catatan' : 'Kurang Layak',
    market: data.analisis?.market ?? 'Tinggi. Kebutuhan konstan di segmen target yang Anda pilih.',
    competitor: data.analisis?.competitor ?? 'Sedang. Kompetitor lokal ada, namun kanal penjualan terpilih memberi nilai tambah.',
    trend: data.analisis?.trend ?? 'Positif. Sesuai dengan pertumbuhan tren adaptasi digital di daerah target.',
    risk: data.analisis?.risiko ?? 'Fluktuasi harga bahan baku pangan utama dan komisi platform pengiriman.',
    potential: data.analisis?.potensi ?? 'Skala mikro yang baik. Peluang ekspansi waralaba mikro tinggi setelah 6 bulan stabil.',
  };
}

export function getFallbackResult() {
  return {
    score: 4.7,
    verdict: 'Sangat Layak',
    market: 'Tinggi. Kebutuhan konstan di segmen target yang Anda pilih.',
    competitor: 'Sedang. Kompetitor lokal ada, namun kanal penjualan terpilih memberi nilai tambah.',
    trend: 'Positif. Sesuai dengan pertumbuhan tren adaptasi digital di daerah target.',
    risk: 'Fluktuasi harga bahan baku pangan utama dan komisi platform pengiriman.',
    potential: 'Skala mikro yang baik. Peluang ekspansi waralaba mikro tinggi setelah 6 bulan stabil.',
  };
}
