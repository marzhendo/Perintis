import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Crosshair, Navigation, ChevronLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getProvinsi, getKabupaten, getKecamatan, getKelurahan, provinsiIdFromLatLng } from '../services/areaService';
import { getPricesForProvince } from '../data/indonesiaData';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:24px;height:24px;background:#FF6B1A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><div style="width:10px;height:10px;background:#fff;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div></div>',
  iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -12],
});

const umkmIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#171C38;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>',
  iconSize: [14, 14], iconAnchor: [7, 7],
});

const UMKM_LOCATIONS = [
  { name: 'Warung Seger Abah', city: 'Jakarta', type: 'Kuliner', lat: -6.2088, lng: 106.8456, products: 'Nasi Uduk, Lauk' },
  { name: 'Kedai Kopi Nusantara', city: 'Bandung', type: 'Kuliner', lat: -6.9175, lng: 107.6191, products: 'Kopi, Snack' },
  { name: 'Roti & Kue Bu Asri', city: 'Semarang', type: 'Kuliner', lat: -7.0051, lng: 110.4381, products: 'Roti, Kue Basah' },
  { name: 'Batiki Craft', city: 'Surabaya', type: 'Kerajinan', lat: -7.2575, lng: 112.7521, products: 'Batik, Aksesoris' },
  { name: 'Abon & Kriuk Mak Nani', city: 'Medan', type: 'Kuliner', lat: 3.5952, lng: 98.6722, products: 'Abon, Peyek' },
  { name: 'Kain Tenun Lontara', city: 'Makassar', type: 'Kerajinan', lat: -5.1477, lng: 119.4327, products: 'Tenun, Sarung' },
  { name: 'Jamu Gendong Mbah Ti', city: 'Solo', type: 'Minuman', lat: -7.5667, lng: 110.8281, products: 'Jamu, Wedang' },
  { name: 'Tas & Dompet Ecoprint', city: 'Malang', type: 'Kerajinan', lat: -7.9797, lng: 112.6304, products: 'Tas, Dompet' },
  { name: 'Sambal Ijo Mak Ita', city: 'Denpasar', type: 'Kuliner', lat: -8.3405, lng: 115.0920, products: 'Sambal, Bumbu' },
  { name: 'Kripik Pisang Lembayung', city: 'Pontianak', type: 'Kuliner', lat: -0.0220, lng: 109.3303, products: 'Keripik, Olahan' },
  { name: 'Es Cendol Betawi H. Dul', city: 'Bogor', type: 'Minuman', lat: -6.5971, lng: 106.8060, products: 'Cendol, Es Campur' },
  { name: 'Pengolahan Ikan Asap Yanti', city: 'Cirebon', type: 'Kuliner', lat: -6.7320, lng: 108.5523, products: 'Ikan Asap, Teri' },
  { name: 'Dodol & Wajik Nyak Halimah', city: 'Palembang', type: 'Kuliner', lat: -2.9761, lng: 104.7754, products: 'Dodol, Wajik' },
  { name: 'Gerabah Lestari', city: 'Yogyakarta', type: 'Kerajinan', lat: -7.7956, lng: 110.3695, products: 'Gerabah, Keramik' },
  { name: 'Kue Basah & Jajan Pasar Mbah Karto', city: 'Magelang', type: 'Kuliner', lat: -7.4797, lng: 110.2177, products: 'Kue Lupis, Klepon' },
];

export default function LokasiPasar({ setSelectedRegion, onNavigate }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [prices, setPrices] = useState(getPricesForProvince('default'));

  useEffect(() => {
    getProvinsi().then(list => {
      setProvinsiList(list.sort((a, b) => a.nama.localeCompare(b.nama)));
      setLoading(false);
    });
  }, []);

  const findAndSelectProvinsi = useCallback((lat, lng) => {
    const prov = provinsiIdFromLatLng(lat, lng, provinsiList);
    if (prov) {
      setSelectedProvinsi(prov);
      setSelectedRegion(prov.nama);
      setPrices(getPricesForProvince(prov.id));
      setSubLoading(true);
      getKabupaten(prov.id).then(kabs => {
        setKabupatenList(kabs);
        setSubLoading(false);
      });
    }
  }, [provinsiList, setSelectedRegion]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { setGeoError('Geolokasi tidak didukung'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        findAndSelectProvinsi(lat, lng);
        setGeoError(null);
      },
      () => setGeoError('Aktifkan izin lokasi'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [findAndSelectProvinsi]);

  useEffect(() => { if (provinsiList.length) handleLocate(); }, [provinsiList.length]);

  const handleProvinsiClick = (prov) => {
    setSelectedProvinsi(prov);
    setSelectedKabupaten(null);
    setSelectedKecamatan(null);
    setKabupatenList([]);
    setKecamatanList([]);
    setKelurahanList([]);
    setSelectedRegion(prov.nama);
    setPrices(getPricesForProvince(prov.id));
    setSubLoading(true);
    getKabupaten(prov.id).then(kabs => { setKabupatenList(kabs); setSubLoading(false); });
  };

  const handleKabupatenClick = (kab) => {
    setSelectedKabupaten(kab);
    setSelectedKecamatan(null);
    setKecamatanList([]);
    setKelurahanList([]);
    setSubLoading(true);
    getKecamatan(kab.id).then(kecs => { setKecamatanList(kecs); setSubLoading(false); });
  };

  const handleKecamatanClick = (kec) => {
    setSelectedKecamatan(kec);
    setKelurahanList([]);
    setSubLoading(true);
    getKelurahan(kec.id).then(kels => { setKelurahanList(kels); setSubLoading(false); });
  };

  const handleBack = () => {
    if (kelurahanList.length) { setKelurahanList([]); setSelectedKecamatan(null); }
    else if (kecamatanList.length) { setKecamatanList([]); setKelurahanList([]); setSelectedKabupaten(null); }
    else { setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setSelectedProvinsi(null); setSelectedRegion(null); setPrices(getPricesForProvince('default')); }
  };

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [-2.5, 117];

  const filteredProvinsi = provinsiList.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const filteredKabupaten = kabupatenList.filter(k =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelTitle = () => {
    if (kelurahanList.length) return `Desa/Kelurahan — ${selectedKecamatan?.nama}`;
    if (kecamatanList.length) return `Kecamatan — ${selectedKabupaten?.nama}`;
    if (kabupatenList.length) return `Kabupaten/Kota — ${selectedProvinsi?.nama}`;
    return 'Provinsi di Indonesia';
  };

  const getBreadcrumb = () => {
    const parts = [];
    if (selectedProvinsi) parts.push(selectedProvinsi.nama);
    if (selectedKabupaten) parts.push(selectedKabupaten.nama);
    if (selectedKecamatan) parts.push(selectedKecamatan.nama);
    return parts.join(' › ');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Peta Lokasi & Pasar Daerah</h2>
          <p className="text-sm text-[#6F7178] mt-1">
            Jelajahi sebaran UMKM dan harga pasar di seluruh Indonesia.
            {selectedProvinsi && (
              <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] border border-emerald-500/20">
                <Navigation className="w-3 h-3" />{selectedProvinsi.nama}
              </span>
            )}
          </p>
          {geoError && <p className="text-[10px] text-rose-500 mt-1">{geoError}</p>}
          {getBreadcrumb() && <p className="text-[10px] text-[#6F7178] mt-0.5">{getBreadcrumb()}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleLocate} className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#E8E8E8] text-[#6F7178] hover:text-[#FF6B1A] hover:border-[#FF6B1A]/30 transition-all press" title="Deteksi lokasi saya">
            <Crosshair className="w-4 h-4 inline mr-1" />Lokasi Saya
          </button>
          <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 press ${viewMode === 'map' ? 'bg-[#FF6B1A] text-white shadow-md' : 'bg-white border border-[#E8E8E8] text-[#6F7178]'}`}>Peta</button>
          <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 press ${viewMode === 'table' ? 'bg-[#FF6B1A] text-white shadow-md' : 'bg-white border border-[#E8E8E8] text-[#6F7178]'}`}>Tabel</button>
        </div>
      </header>

      <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-float" />

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-1 overflow-hidden">
              <MapContainer center={mapCenter} zoom={userLocation ? 10 : 5} className="h-[400px] md:h-[500px] w-full rounded-[18px]" scrollWheelZoom={true}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="text-xs font-medium text-[#171C38]">
                        📍 Lokasi Saya{selectedProvinsi ? ` — ${selectedProvinsi.nama}` : ''}
                        {selectedKabupaten && <><br /><span className="text-[#6F7178]">{selectedKabupaten.nama}</span></>}
                      </div>
                    </Popup>
                  </Marker>
                )}
                {UMKM_LOCATIONS.map((umkm, i) => (
                  <Marker key={i} position={[umkm.lat, umkm.lng]} icon={umkmIcon}>
                    <Popup>
                      <div className="text-xs">
                        <strong className="text-[#171C38]">{umkm.name}</strong><br />
                        <span className="text-[#6F7178]">{umkm.city} • {umkm.type}</span><br />
                        <span className="text-[#FF6B1A]">{umkm.products}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7178]" />
              <input type="text" placeholder={kelurahanList.length ? 'Cari desa...' : kecamatanList.length ? 'Cari kecamatan...' : kabupatenList.length ? 'Cari kota...' : 'Cari provinsi...'} value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E8E8] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 focus-ring" />
            </div>

            {(kabupatenList.length > 0 || kecamatanList.length > 0 || kelurahanList.length > 0) && (
              <button onClick={handleBack} className="text-xs text-[#FF6B1A] font-bold hover:underline flex items-center gap-1 press-sm">
                <ChevronLeft className="w-3 h-3" />Kembali
              </button>
            )}

            <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-4">
              <h4 className="font-bold text-xs text-[#171C38] mb-3">{getLevelTitle()}</h4>
              {subLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
              <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {loading && <p className="text-xs text-[#6F7178] text-center py-4">Memuat data...</p>}

                {/* Province level */}
                {!kabupatenList.length && !loading && filteredProvinsi.map(p => (
                  <button key={p.id} onClick={() => handleProvinsiClick(p)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all press ${selectedProvinsi?.id === p.id ? 'bg-[#FF6B1A]/10 border border-[#FF6B1A]/20' : 'hover:bg-[#F8ECD2]/50 border border-transparent'}`}>
                    <span className="font-bold text-[#171C38]">{p.nama}</span>
                  </button>
                ))}

                {/* City level */}
                {kabupatenList.length > 0 && !kecamatanList.length && filteredKabupaten.map(k => (
                  <button key={k.id} onClick={() => handleKabupatenClick(k)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all press ${selectedKabupaten?.id === k.id ? 'bg-[#FF6B1A]/10 border border-[#FF6B1A]/20' : 'hover:bg-[#F8ECD2]/50 border border-transparent'}`}>
                    <span className="font-bold text-[#171C38]">{k.nama}</span>
                  </button>
                ))}

                {/* District level */}
                {kecamatanList.length > 0 && !kelurahanList.length && kecamatanList.filter(k => k.nama.toLowerCase().includes(search.toLowerCase())).map(k => (
                  <button key={k.id} onClick={() => handleKecamatanClick(k)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all press ${selectedKecamatan?.id === k.id ? 'bg-[#FF6B1A]/10 border border-[#FF6B1A]/20' : 'hover:bg-[#F8ECD2]/50 border border-transparent'}`}>
                    <span className="font-bold text-[#171C38]">{k.nama}</span>
                  </button>
                ))}

                {/* Village level */}
                {kelurahanList.length > 0 && kelurahanList.filter(k => k.nama.toLowerCase().includes(search.toLowerCase())).map(k => (
                  <div key={k.id} className="p-3 rounded-xl text-xs border border-transparent hover:bg-[#F8ECD2]/50">
                    <span className="font-medium text-[#171C38]">{k.nama}</span>
                  </div>
                ))}

                {!loading && kabupatenList.length === 0 && kecamatanList.length === 0 && kelurahanList.length === 0 && filteredProvinsi.length === 0 && (
                  <p className="text-xs text-[#6F7178] text-center py-4">Wilayah tidak ditemukan.</p>
                )}
                {kabupatenList.length > 0 && kecamatanList.length === 0 && kelurahanList.length === 0 && filteredKabupaten.length === 0 && (
                  <p className="text-xs text-[#6F7178] text-center py-4">Kabupaten/kota tidak ditemukan.</p>
                )}
              </div>
              )}
            </div>

            {/* Regional Prices */}
            {selectedProvinsi && (
              <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-xs text-[#171C38]">Harga Pangan — {selectedProvinsi.nama}</h4>
                  <button onClick={() => onNavigate('harga')} className="text-[10px] text-[#FF6B1A] font-bold hover:underline press-sm">Lihat Semua →</button>
                </div>
                <div className="space-y-2">
                  {prices.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#E8E8E8]/30 last:border-0">
                      <span className="text-[11px] font-medium text-[#171C38]">{item.name}</span>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-[#171C38]">{formatRupiah(item.price)}</span>
                        <span className={`ml-1.5 text-[9px] font-bold ${item.change.startsWith('+') ? 'text-rose-500' : item.change.startsWith('-') ? 'text-emerald-500' : 'text-[#6F7178]'}`}>{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8E8]">
                  <th className="py-3 px-3 text-[10px] font-bold text-[#6F7178] uppercase tracking-wider">Provinsi</th>
                  <th className="py-3 px-3 text-[10px] font-bold text-[#6F7178] uppercase tracking-wider">Kab/Kota</th>
                  <th className="py-3 px-3 text-[10px] font-bold text-[#6F7178] uppercase tracking-wider">Kecamatan</th>
                  <th className="py-3 px-3 text-[10px] font-bold text-[#6F7178] uppercase tracking-wider">Desa</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#171C38] divide-y divide-[#E8E8E8]/50">
                {loading ? (
                  <tr><td colSpan="4" className="py-8 text-center text-[#6F7178]">Memuat data...</td></tr>
                ) : filteredProvinsi.map(p => (
                  <tr key={p.id} className="hover:bg-[#F8ECD2]/30 transition-colors">
                    <td className="py-3 px-3 font-bold">{p.nama}</td>
                    <td className="py-3 px-3 text-[#6F7178]">-</td>
                    <td className="py-3 px-3 text-[#6F7178]">-</td>
                    <td className="py-3 px-3 text-[#6F7178]">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 card-lift">
          <p className="text-2xl font-extrabold text-[#171C38]">{provinsiList.length}</p>
          <p className="text-xs text-[#6F7178] font-medium">Provinsi</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 card-lift">
          <p className="text-2xl font-extrabold text-[#171C38]">{kabupatenList.length ? kabupatenList.length : '-'}</p>
          <p className="text-xs text-[#6F7178] font-medium">Kab/Kota{selectedProvinsi ? ` (${selectedProvinsi.nama})` : ''}</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 card-lift">
          <p className="text-2xl font-extrabold text-[#171C38]">{kecamatanList.length ? kecamatanList.length : '-'}</p>
          <p className="text-xs text-[#6F7178] font-medium">Kecamatan{selectedKabupaten ? ` (${selectedKabupaten.nama})` : ''}</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 card-lift">
          <p className="text-2xl font-extrabold text-[#171C38]">{kelurahanList.length ? kelurahanList.length : selectedProvinsi ? selectedProvinsi.nama : '-'}</p>
          <p className="text-xs text-[#6F7178] font-medium">{kelurahanList.length ? 'Desa/Kelurahan' : 'Lokasi Terdeteksi'}</p>
        </div>
      </section>
    </div>
  );
}
