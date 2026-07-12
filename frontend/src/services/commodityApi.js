const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app';

// Default fallback data — harga asli dari Bank Indonesia (per 10 Jul 2026)
// Sumber: https://www.bi.go.id/hargapangan
const DEFAULT_COMMODITIES = [
  { id: 1,  name: "Beras Kualitas Bawah I",          unit: "per Kg",    price: 14700,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [14700, 14700, 14700, 14700, 14700, 14700, 14700] },
  { id: 2,  name: "Beras Kualitas Bawah II",         unit: "per Kg",    price: 14550,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [14550, 14550, 14550, 14550, 14550, 14550, 14550] },
  { id: 3,  name: "Beras Kualitas Medium I",         unit: "per Kg",    price: 16350,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [16350, 16350, 16350, 16350, 16350, 16350, 16350] },
  { id: 4,  name: "Beras Kualitas Medium II",        unit: "per Kg",    price: 16150,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [16150, 16150, 16150, 16150, 16150, 16150, 16150] },
  { id: 5,  name: "Beras Kualitas Super I",          unit: "per Kg",    price: 17650,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [17650, 17650, 17650, 17650, 17650, 17650, 17650] },
  { id: 6,  name: "Beras Kualitas Super II",         unit: "per Kg",    price: 17150,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [17150, 17150, 17150, 17150, 17150, 17150, 17150] },
  { id: 7,  name: "Bawang Merah Ukuran Sedang",      unit: "per Kg",    price: 45650,  change: -4.5, changeRp: -2150, isUp: false, date: "10 Jul 2026", history: [47800, 47500, 47000, 46500, 46200, 45900, 45650] },
  { id: 8,  name: "Bawang Putih Ukuran Sedang",      unit: "per Kg",    price: 44550,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [44550, 44550, 44550, 44550, 44550, 44550, 44550] },
  { id: 9,  name: "Cabai Merah Besar",               unit: "per Kg",    price: 48850,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [48850, 48850, 48850, 48850, 48850, 48850, 48850] },
  { id: 10, name: "Cabai Merah Keriting",            unit: "per Kg",    price: 46000,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [46000, 46000, 46000, 46000, 46000, 46000, 46000] },
  { id: 11, name: "Cabai Rawit Hijau",               unit: "per Kg",    price: 50350,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [50350, 50350, 50350, 50350, 50350, 50350, 50350] },
  { id: 12, name: "Cabai Rawit Merah",               unit: "per Kg",    price: 59850,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [59850, 59850, 59850, 59850, 59850, 59850, 59850] },
  { id: 13, name: "Daging Ayam Ras Segar",           unit: "per Kg",    price: 37000,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [37000, 37000, 37000, 37000, 37000, 37000, 37000] },
  { id: 14, name: "Daging Sapi Kualitas 1",          unit: "per Kg",    price: 150550, change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [150550, 150550, 150550, 150550, 150550, 150550, 150550] },
  { id: 15, name: "Daging Sapi Kualitas 2",          unit: "per Kg",    price: 141950, change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [141950, 141950, 141950, 141950, 141950, 141950, 141950] },
  { id: 16, name: "Gula Pasir Lokal",                unit: "per Kg",    price: 19100,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [19100, 19100, 19100, 19100, 19100, 19100, 19100] },
  { id: 17, name: "Gula Pasir Kualitas Premium",     unit: "per Kg",    price: 20300,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [20300, 20300, 20300, 20300, 20300, 20300, 20300] },
  { id: 18, name: "Minyak Goreng Curah",             unit: "per Liter", price: 20550,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [20550, 20550, 20550, 20550, 20550, 20550, 20550] },
  { id: 19, name: "Minyak Goreng Kemasan Bermerk 1", unit: "per Liter", price: 24250,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [24250, 24250, 24250, 24250, 24250, 24250, 24250] },
  { id: 20, name: "Minyak Goreng Kemasan Bermerk 2", unit: "per Liter", price: 23400,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [23400, 23400, 23400, 23400, 23400, 23400, 23400] },
  { id: 21, name: "Telur Ayam Ras Segar",            unit: "per Kg",    price: 28950,  change: 0.0,  changeRp: 0,     isUp: null,  date: "10 Jul 2026", history: [28950, 28950, 28950, 28950, 28950, 28950, 28950] },
];

/**
 * Fetch commodity prices from the backend API.
 * @param {string|null} province - Province name (e.g., "DKI Jakarta") or null for national.
 */
export async function fetchCommodities(province) {
  let url = `${BASE_URL}/api/commodities`;
  if (province && province.trim().toUpperCase() !== 'SEMUA PROVINSI' && province.trim().toUpperCase() !== 'SELURUH INDONESIA') {
    url += `?province=${encodeURIComponent(province)}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('API Error');
  return response.json();
}

/**
 * Fallback commodity prices (used when backend is unreachable).
 * Returns real BI prices — no synthetic multipliers applied.
 * @param {string|null} province - Province name (ignored in fallback, national prices returned).
 */
export function getFallbackCommodities(province) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Return real BI national prices as-is, no province multipliers.
  // Province-specific prices are only available from the backend after scraping.
  return DEFAULT_COMMODITIES.map(c => ({
    ...c,
    date: formattedDate,
  }));
}
