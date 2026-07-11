const BASE = 'https://ibnux.github.io/data-indonesia';

const cache = {
  provinsi: null,
  kabupaten: {},
  kecamatan: {},
  kelurahan: {},
};

export async function getProvinsi() {
  if (cache.provinsi) return cache.provinsi;
  const res = await fetch(`${BASE}/provinsi.json`);
  const data = await res.json();
  cache.provinsi = data;
  return data;
}

export async function getKabupaten(provinsiId) {
  if (cache.kabupaten[provinsiId]) return cache.kabupaten[provinsiId];
  const res = await fetch(`${BASE}/kabupaten/${provinsiId}.json`);
  const data = await res.json();
  cache.kabupaten[provinsiId] = data;
  return data;
}

export async function getKecamatan(kabupatenId) {
  if (cache.kecamatan[kabupatenId]) return cache.kecamatan[kabupatenId];
  const res = await fetch(`${BASE}/kecamatan/${kabupatenId}.json`);
  const data = await res.json();
  cache.kecamatan[kabupatenId] = data;
  return data;
}

export async function getKelurahan(kecamatanId) {
  if (cache.kelurahan[kecamatanId]) return cache.kelurahan[kecamatanId];
  const res = await fetch(`${BASE}/kelurahan/${kecamatanId}.json`);
  const data = await res.json();
  cache.kelurahan[kecamatanId] = data;
  return data;
}

export function provinsiIdFromLatLng(lat, lng, provinsiList) {
  const centers = {
    1: [5.5, 95.3], 2: [3.6, 98.7], 3: [-0.5, 101.5], 4: [0.5, 101.4],
    5: [-1.6, 103.6], 6: [-0.5, 104.5], 7: [-3.0, 104.8], 8: [-3.8, 102.3],
    9: [-5.4, 105.3], 10: [-2.7, 107.6], 11: [1.0, 104.5], 12: [-6.2, 106.8],
    13: [-6.9, 107.6], 14: [-6.4, 106.1], 15: [-7.2, 110.1], 16: [-7.8, 110.4],
    17: [-7.5, 112.2], 18: [-8.3, 115.2], 19: [-8.6, 117.4], 20: [-10.2, 123.6],
    21: [0.0, 109.3], 22: [-1.5, 114.0], 23: [-3.1, 115.3], 24: [1.0, 116.5],
    25: [3.0, 116.5], 26: [1.2, 124.8], 27: [-1.0, 121.0], 28: [-4.3, 120.2],
    29: [-3.5, 122.0], 30: [0.5, 123.1], 31: [-2.5, 119.5],
    32: [-3.5, 129.0], 33: [0.5, 128.0], 34: [-1.0, 133.0],
    35: [-0.5, 132.0], 36: [-4.5, 138.0], 37: [-6.5, 139.0],
    38: [-3.5, 137.0], 39: [-4.0, 139.0],
  };

  let closest = null;
  let minDist = Infinity;
  for (const [id, center] of Object.entries(centers)) {
    const d = Math.sqrt((center[0] - lat) ** 2 + (center[1] - lng) ** 2);
    if (d < minDist) { minDist = d; closest = id; }
  }
  const prov = provinsiList.find(p => p.id === closest);
  return prov ? { ...prov, centerLat: centers[closest][0], centerLng: centers[closest][1] } : null;
}
