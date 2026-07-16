const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app';

/**
 * Fetch daftar tren bisnis viral dari backend.
 *
 * Backend mengembalikan data dari cache Gemini (refresh 24 jam).
 * Jika Gemini tidak tersedia, backend fallback ke data hardcoded.
 *
 * Response shape:
 *   {
 *     trends: TrendItem[],
 *     is_ai_generated: boolean
 *   }
 *
 * TrendItem shape (snake_case dari API):
 *   {
 *     name: string,
 *     desc: string,
 *     viral_score: number,
 *     longevity: string,
 *     capital_label: string,
 *     preset: { business_name: string, category: string, description: string }
 *   }
 *
 * Throws: Error jika network / server gagal total (bukan fallback Gemini —
 * fallback Gemini ditangani di backend, response tetap 200).
 */
export async function fetchViralTrends() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 detik

  try {
    const response = await fetch(`${BASE_URL}/api/trends`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
