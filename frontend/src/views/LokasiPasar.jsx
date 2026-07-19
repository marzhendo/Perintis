import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Search, Crosshair, Navigation, ChevronLeft, Building, Plus, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getProvinsi, getKabupaten, getKecamatan, getKelurahan, provinsiIdFromLatLng, getAddressFromLatLng, findBestMatch } from '../services/areaService';
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
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
      <div style="position: absolute; bottom: 0; width: 30px; height: 30px; background: #FF6B1A; border: 2.5px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
      <div style="position: absolute; top: 6px; width: 10px; height: 10px; background: #171C38; border-radius: 50%; z-index: 2;"></div>
    </div>
  `,
  iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
});

const myUmkmIcon = L.divIcon({
  className: '',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
      <div style="position: absolute; bottom: 0; width: 30px; height: 30px; background: #10B981; border: 2.5px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
      <div style="position: absolute; top: 6px; width: 10px; height: 10px; background: #171C38; border-radius: 50%; z-index: 2;"></div>
    </div>
  `,
  iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const getOptimizedImgUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=240&q=70&fm=webp';
  if (url.includes('unsplash.com')) {
    // Replace width/quality queries and enforce WebP format for fast loads
    return url.replace(/w=\d+/, 'w=240').replace(/q=\d+/, 'q=70') + '&fm=webp';
  }
  return url;
};

const UMKM_LOCATIONS = [
  // Banyumas / Purwokerto area (matching user's view)
  {
    name: 'Gethuk Goreng Sokaraja H. Tohirin',
    city: 'Banyumas',
    type: 'Kuliner',
    lat: -7.4475,
    lng: 109.2891,
    products: 'Gethuk Goreng Manis',
    rating: '4.9',
    reviews: '1,840',
    address: 'Jl. Jenderal Soedirman No. 15, Sokaraja, Banyumas',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Mendoan Sawangan Purwokerto',
    city: 'Purwokerto',
    type: 'Kuliner',
    lat: -7.4244,
    lng: 109.2301,
    products: 'Tempe Mendoan Hangat',
    rating: '4.8',
    reviews: '920',
    address: 'Jl. Jenderal Soedirman No. 24, Purwokerto',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Batik Banyumasan Hadipriyanto',
    city: 'Purwokerto',
    type: 'Kerajinan',
    lat: -7.4325,
    lng: 109.2394,
    products: 'Batik Tulis & Cap Banyumasan',
    rating: '4.7',
    reviews: '156',
    address: 'Jl. KH. Wahid Hasyim No. 10, Purwokerto',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Kripik Tempe Swanhild',
    city: 'Purwokerto',
    type: 'Kuliner',
    lat: -7.4189,
    lng: 109.2452,
    products: 'Kripik Tempe Garing',
    rating: '4.6',
    reviews: '312',
    address: 'Jl. Sawangan No. 45, Purwokerto',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Kopi Karanglewas',
    city: 'Banyumas',
    type: 'Minuman',
    lat: -7.4150,
    lng: 109.2050,
    products: 'Kopi Robusta & Arabika Lokal',
    rating: '4.5',
    reviews: '98',
    address: 'Jl. Raya Karanglewas No. 8, Banyumas',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'
  },
  
  // General Indonesia locations
  {
    name: 'Warung Seger Abah',
    city: 'Jakarta',
    type: 'Kuliner',
    lat: -6.2088,
    lng: 106.8456,
    products: 'Nasi Uduk, Lauk Pauk',
    rating: '4.8',
    reviews: '124',
    address: 'Jl. Salemba Tengah No. 12, Jakarta Pusat',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Kedai Kopi Nusantara',
    city: 'Bandung',
    type: 'Kuliner',
    lat: -6.9175,
    lng: 107.6191,
    products: 'Kopi Espresso, Roti Bakar',
    rating: '4.7',
    reviews: '85',
    address: 'Jl. Dago No. 102, Bandung',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Roti & Kue Bu Asri',
    city: 'Semarang',
    type: 'Kuliner',
    lat: -7.0051,
    lng: 110.4381,
    products: 'Roti, Kue Basah',
    rating: '4.5',
    reviews: '64',
    address: 'Jl. Pandanaran No. 56, Semarang',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Batiki Craft',
    city: 'Surabaya',
    type: 'Kerajinan',
    lat: -7.2575,
    lng: 112.7521,
    products: 'Batik, Aksesoris',
    rating: '4.6',
    reviews: '78',
    address: 'Jl. Tunjungan No. 12, Surabaya',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
  },
];

export default function LokasiPasar({ setSelectedRegion, onNavigate }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [locationMode, setLocationMode] = useState('explore'); // 'explore' or 'manual'
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
  const [mapCenter, setMapCenter] = useState([-2.5, 117]);
  const [mapZoom, setMapZoom] = useState(5);

  // Location Strategic Scoring States
  const [bizType, setBizType] = useState('Kuliner / Makanan');
  const [radius, setRadius] = useState('1 km');
  const [scoreResult, setScoreResult] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

  // Custom User Registered Business States
  const [customLocations, setCustomLocations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBiz, setNewBiz] = useState({
    name: '',
    type: 'Kuliner',
    products: '',
    address: '',
    lat: '',
    lng: '',
    rating: '5.0',
    reviews: '1'
  });

  // Map Search & Filter States
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const saved = localStorage.getItem('perintis_custom_umkm');
    if (saved) {
      try {
        setCustomLocations(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    getProvinsi().then(list => {
      setProvinsiList(list.sort((a, b) => a.nama.localeCompare(b.nama)));
      setLoading(false);
    });
  }, []);

  const geocodeAddress = async (addressQuery) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=1`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
    return null;
  };

  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) return;
    setMapSearchLoading(true);
    const coords = await geocodeAddress(mapSearchQuery);
    setMapSearchLoading(false);
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(13);
    } else {
      alert(`Lokasi "${mapSearchQuery}" tidak ditemukan.`);
    }
  };

  const handleLocate = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolokasi tidak didukung');
      return;
    }
    setSubLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setMapCenter([lat, lng]);
        setMapZoom(12);
        
        try {
          const address = await getAddressFromLatLng(lat, lng);
          if (address && provinsiList.length > 0) {
            const provName = address.state || address.province || address.region;
            const matchedProv = findBestMatch(provinsiList, provName);
            if (matchedProv) {
              setSelectedProvinsi(matchedProv);
              setPrices(getPricesForProvince(matchedProv.id));

              let regionStr = matchedProv.nama;

              const kabs = await getKabupaten(matchedProv.id);
              setKabupatenList(kabs);
              const kabName = address.city || address.county || address.municipality || address.regency;
              const matchedKab = findBestMatch(kabs, kabName);
              if (matchedKab) {
                setSelectedKabupaten(matchedKab);
                regionStr += `, ${matchedKab.nama}`;

                const kecs = await getKecamatan(matchedKab.id);
                setKecamatanList(kecs);
                const kecName = address.suburb || address.district || address.subdistrict || address.town || address.city_district;
                const matchedKec = findBestMatch(kecs, kecName);
                if (matchedKec) {
                  setSelectedKecamatan(matchedKec);
                  regionStr += `, ${matchedKec.nama}`;

                  const kels = await getKelurahan(matchedKec.id);
                  setKelurahanList(kels);
                } else {
                  setSelectedKecamatan(null);
                  setKelurahanList([]);
                }
              } else {
                setSelectedKabupaten(null);
                setSelectedKecamatan(null);
                setKecamatanList([]);
                setKelurahanList([]);
              }
              
              setSelectedRegion(regionStr);
              setGeoError(null);
              setSubLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Pencocokan lokasi gagal, menjalankan fallback:', err);
        }

        // Fallback jika reverse geocoding tidak berhasil
        const prov = provinsiIdFromLatLng(lat, lng, provinsiList);
        if (prov) {
          setSelectedProvinsi(prov);
          setSelectedRegion(prov.nama);
          setPrices(getPricesForProvince(prov.id));
          setSelectedKabupaten(null);
          setSelectedKecamatan(null);
          setKecamatanList([]);
          setKelurahanList([]);
          const kabs = await getKabupaten(prov.id);
          setKabupatenList(kabs);
        }
        setGeoError(null);
        setSubLoading(false);
      },
      () => {
        setGeoError('Aktifkan izin lokasi');
        setSubLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [provinsiList, setSelectedRegion]);

  useEffect(() => { if (provinsiList.length) { handleLocate(); } }, [provinsiList.length]);

  const handleProvinsiClick = (prov) => {
    setSelectedProvinsi(prov);
    setSelectedKabupaten(null);
    setSelectedKecamatan(null);
    setKabupatenList([]);
    setKecamatanList([]);
    setKelurahanList([]);
    setSelectedRegion(prov.nama);
    setPrices(getPricesForProvince(prov.id));

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
    if (centers[prov.id]) {
      setMapCenter(centers[prov.id]);
      setMapZoom(7);
    }

    setSubLoading(true);
    getKabupaten(prov.id).then(kabs => { setKabupatenList(kabs); setSubLoading(false); });
  };

  const handleKabupatenClick = async (kab) => {
    setSelectedKabupaten(kab);
    setSelectedKecamatan(null);
    setKecamatanList([]);
    setKelurahanList([]);
    if (selectedProvinsi) {
      setSelectedRegion(`${selectedProvinsi.nama}, ${kab.nama}`);
    }

    setSubLoading(true);
    const coords = await geocodeAddress(`${kab.nama}, ${selectedProvinsi?.nama || ''}, Indonesia`);
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(10);
    }

    getKecamatan(kab.id).then(kecs => { setKecamatanList(kecs); setSubLoading(false); });
  };

  const handleKecamatanClick = async (kec) => {
    setSelectedKecamatan(kec);
    setKelurahanList([]);
    if (selectedProvinsi && selectedKabupaten) {
      setSelectedRegion(`${selectedProvinsi.nama}, ${selectedKabupaten.nama}, ${kec.nama}`);
    }

    setSubLoading(true);
    const coords = await geocodeAddress(`${kec.nama}, ${selectedKabupaten?.nama || ''}, ${selectedProvinsi?.nama || ''}, Indonesia`);
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(13);
    }

    getKelurahan(kec.id).then(kels => { setKelurahanList(kels); setSubLoading(false); });
  };

  const handleBack = () => {
    if (kelurahanList.length) {
      setKelurahanList([]);
      setSelectedKecamatan(null);
      if (selectedProvinsi && selectedKabupaten) {
        setSelectedRegion(`${selectedProvinsi.nama}, ${selectedKabupaten.nama}`);
      }
    }
    else if (kecamatanList.length) {
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedKabupaten(null);
      if (selectedProvinsi) {
        setSelectedRegion(selectedProvinsi.nama);
      }
    }
    else {
      setKabupatenList([]);
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedProvinsi(null);
      setSelectedRegion(null);
      setPrices(getPricesForProvince('default'));
      setMapCenter([-2.5, 117]);
      setMapZoom(5);
    }
    setScoreResult(null);
  };

  const handleCalculateScore = () => {
    setScoreLoading(true);
    setScoreResult(null);
    setTimeout(() => {
      // Calculate a semi-random but consistent score based on selected values
      const seed = (bizType.length + radius.length + (selectedProvinsi ? selectedProvinsi.nama.length : 10)) % 25;
      const score = 65 + seed;
      const access = 70 + (seed % 10) * 2;
      const competitor = 55 + (seed % 8) * 3;
      const purchasingPower = 60 + (seed % 6) * 4;

      let tip = 'Lokasi dinilai cukup memadai dengan kepadatan pelanggan sedang. Cari posisi ruko yang menghadap jalan utama untuk akses lebih optimal.';
      if (bizType.includes('Kuliner')) {
        tip = 'Dekat dengan area pasar/pusat kuliner. Strategis untuk warung makan, tetapi persaingan padat. Unggul dalam promosi rasa dan layanan pesan-antar.';
      } else if (bizType.includes('Kafe')) {
        tip = 'Tingkat persaingan kafe di sekitar terdeteksi tinggi. Tawarkan produk kopi unik (diferensiasi) dan sediakan tempat duduk ramah laptop.';
      }

      setScoreResult({ score, access, competitor, purchasingPower, tip });
      setScoreLoading(false);
    }, 1000);
  };

  const handleProvinsiSelect = async (provName) => {
    const prov = provinsiList.find(p => p.nama === provName);
    if (prov) {
      setSelectedProvinsi(prov);
      setSelectedKabupaten(null);
      setSelectedKecamatan(null);
      setKabupatenList([]);
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedRegion(prov.nama);
      setPrices(getPricesForProvince(prov.id));

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
      if (centers[prov.id]) {
        setMapCenter(centers[prov.id]);
        setMapZoom(7);
      }

      setSubLoading(true);
      const kabs = await getKabupaten(prov.id);
      setKabupatenList(kabs);
      setSubLoading(false);
    } else {
      setSelectedProvinsi(null);
      setSelectedKabupaten(null);
      setSelectedKecamatan(null);
      setKabupatenList([]);
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedRegion(null);
      setPrices(getPricesForProvince('default'));
      setMapCenter([-2.5, 117]);
      setMapZoom(5);
    }
  };

  const handleKabupatenSelect = async (kabName) => {
    const kab = kabupatenList.find(k => k.nama === kabName);
    if (kab) {
      setSelectedKabupaten(kab);
      setSelectedKecamatan(null);
      setKecamatanList([]);
      setKelurahanList([]);
      if (selectedProvinsi) {
        setSelectedRegion(`${selectedProvinsi.nama}, ${kab.nama}`);
      }

      setSubLoading(true);
      const coords = await geocodeAddress(`${kab.nama}, ${selectedProvinsi?.nama || ''}, Indonesia`);
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(10);
      }

      const kecs = await getKecamatan(kab.id);
      setKecamatanList(kecs);
      setSubLoading(false);
    } else {
      setSelectedKabupaten(null);
      setSelectedKecamatan(null);
      setKecamatanList([]);
      setKelurahanList([]);
      if (selectedProvinsi) {
        setSelectedRegion(selectedProvinsi.nama);
      }
    }
  };

  const handleKecamatanSelect = async (kecName) => {
    const kec = kecamatanList.find(k => k.nama === kecName);
    if (kec) {
      setSelectedKecamatan(kec);
      setKelurahanList([]);
      if (selectedProvinsi && selectedKabupaten) {
        setSelectedRegion(`${selectedProvinsi.nama}, ${selectedKabupaten.nama}, ${kec.nama}`);
      }

      setSubLoading(true);
      const coords = await geocodeAddress(`${kec.nama}, ${selectedKabupaten?.nama || ''}, ${selectedProvinsi?.nama || ''}, Indonesia`);
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(13);
      }

      const kels = await getKelurahan(kec.id);
      setKelurahanList(kels);
      setSubLoading(false);
    } else {
      setSelectedKecamatan(null);
      setKelurahanList([]);
      if (selectedProvinsi && selectedKabupaten) {
        setSelectedRegion(`${selectedProvinsi.nama}, ${selectedKabupaten.nama}`);
      }
    }
  };

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

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

  const handleAddBusiness = (e) => {
    e.preventDefault();
    if (!newBiz.name || !newBiz.lat || !newBiz.lng || !newBiz.products) {
      alert("Harap isi seluruh field formulir termasuk titik koordinat di peta.");
      return;
    }
    
    let categoryImage = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80'; // Culinary default
    if (newBiz.type === 'Minuman') {
      categoryImage = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80';
    } else if (newBiz.type === 'Kerajinan') {
      categoryImage = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';
    } else if (newBiz.type === 'Jasa') {
      categoryImage = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80';
    }
    
    const bizRecord = {
      ...newBiz,
      lat: parseFloat(newBiz.lat),
      lng: parseFloat(newBiz.lng),
      image: categoryImage,
      isUserCreated: true
    };
    
    const updated = [...customLocations, bizRecord];
    setCustomLocations(updated);
    localStorage.setItem('perintis_custom_umkm', JSON.stringify(updated));
    
    setNewBiz({
      name: '',
      type: 'Kuliner',
      products: '',
      address: '',
      lat: '',
      lng: '',
      rating: '5.0',
      reviews: '1'
    });
    setIsAddModalOpen(false);
  };

  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        if (isAddModalOpen) {
          setNewBiz(prev => ({
            ...prev,
            lat: e.latlng.lat.toFixed(6),
            lng: e.latlng.lng.toFixed(6)
          }));
        }
      }
    });
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #171C38 !important;
          color: #FAF6EE !important;
          border-radius: 16px !important;
          padding: 0 !important;
          overflow: hidden;
          border: 1.5px solid rgba(255, 107, 26, 0.3) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 240px !important;
        }
        .leaflet-popup-tip {
          background: #171C38 !important;
          border: 1px solid rgba(255, 107, 26, 0.3) !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #FAF6EE !important;
          padding: 8px 8px 0 0 !important;
          font-size: 16px !important;
          z-index: 10;
        }
      `}</style>
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
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)} 
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-white border border-[#FF6B1A]/35 text-[#FF6B1A] hover:bg-[#FF6B1A]/5 transition-all press flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />Daftarkan Usaha
          </button>
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
            <div className="glass-card rounded-[20px] p-1 overflow-hidden shadow-lg shadow-orange-500/5 w-full border-2 border-[#171C38] relative">
              {/* Map Address Search Bar */}
              <form onSubmit={handleMapSearch} className="absolute top-4 left-4 z-[1000] flex items-center gap-1 bg-white/95 backdrop-blur-md border border-[#E8E8E8] hover:border-[#FF6B1A]/40 rounded-xl p-1 shadow-lg max-w-[280px] sm:max-w-[340px] transition-all">
                <input
                  type="text"
                  placeholder="Cari lokasi/alamat..."
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-transparent border-none text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178]/60 outline-none w-40 sm:w-52"
                />
                <button
                  type="submit"
                  disabled={mapSearchLoading}
                  className="p-1.5 rounded-lg bg-[#FF6B1A] text-white hover:bg-[#e05615] transition-all press disabled:opacity-50 flex items-center justify-center"
                >
                  {mapSearchLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>

              {/* Map Type Switcher (Peta / Satelit ala Google Maps) */}
              <div className="absolute top-4 right-4 z-[1000] flex bg-[#171C38]/90 backdrop-blur-md border border-[#FF6B1A]/30 rounded-xl p-0.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => setMapType('roadmap')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-300 press-sm ${
                    mapType === 'roadmap'
                      ? 'bg-[#FF6B1A] text-white shadow-sm'
                      : 'text-[#FAF6EE]/80 hover:text-white'
                  }`}
                >
                  Peta
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-300 press-sm ${
                    mapType === 'satellite'
                      ? 'bg-[#FF6B1A] text-white shadow-sm'
                      : 'text-[#FAF6EE]/80 hover:text-white'
                  }`}
                >
                  Satelit
                </button>
              </div>

              {/* Map Filter Categories (Floating Bottom Center) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-1 bg-[#171C38]/90 backdrop-blur-md border border-[#FF6B1A]/30 rounded-2xl p-1 shadow-lg overflow-x-auto max-w-[90%] scrollbar-none">
                {['Semua', 'Kuliner', 'Minuman', 'Kerajinan', 'Jasa', 'Usaha Saya'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#FF6B1A] text-white shadow-sm'
                        : 'text-[#FAF6EE]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <MapContainer center={mapCenter} zoom={mapZoom} className="h-[400px] md:h-[500px] w-full rounded-[18px]" scrollWheelZoom={true}>
                <TileLayer 
                  attribution='&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a>' 
                  url={mapType === 'roadmap' 
                    ? "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
                    : "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  }
                  subdomains={['mt0','mt1','mt2','mt3']}
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                <MapClickHandler />
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="text-xs font-bold text-[#171C38] text-left">
                        📍 Lokasi Saya{selectedProvinsi ? ` — ${selectedProvinsi.nama}` : ''}
                        {selectedKabupaten && <><br /><span className="text-[#6F7178] font-semibold">{selectedKabupaten.nama}</span></>}
                      </div>
                    </Popup>
                  </Marker>
                )}
                {[...UMKM_LOCATIONS, ...customLocations]
                  .filter(umkm => {
                    if (selectedCategory === 'Semua') return true;
                    if (selectedCategory === 'Usaha Saya') return umkm.isUserCreated;
                    return umkm.type.toLowerCase().includes(selectedCategory.toLowerCase());
                  })
                  .map((umkm, i) => {
                    const isUserBiz = umkm.isUserCreated;
                    return (
                      <Marker key={i} position={[umkm.lat, umkm.lng]} icon={isUserBiz ? myUmkmIcon : umkmIcon}>
                        <Popup>
                          <div className="flex flex-col w-[240px] font-sans">
                            <img 
                              src={getOptimizedImgUrl(umkm.image)} 
                              alt={umkm.name} 
                              className="w-full h-28 object-cover rounded-t-[14px]" 
                              loading="lazy"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=240&q=70&fm=webp' }}
                            />
                            <div className="p-3 flex flex-col gap-1.5 bg-[#171C38]">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                                  isUserBiz ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#FF6B1A]/15 text-[#FF6B1A]'
                                }`}>
                                  {umkm.type}
                                </span>
                                {isUserBiz && (
                                  <span className="px-2 py-0.5 bg-[#10B981] text-slate-950 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                                    Usaha Terdaftar
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="font-extrabold text-sm text-[#FAF6EE] leading-tight">
                                {umkm.name}
                              </h4>
                              
                              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                                <span>⭐ {umkm.rating}</span>
                                <span className="text-[#6F7178] font-semibold">({umkm.reviews} ulasan)</span>
                              </div>
                              
                              <p className="text-[10px] text-[#FAF6EE]/70 font-semibold leading-relaxed mt-0.5">
                                🛍️ <span className="text-[#FF6B1A] font-bold">{umkm.products}</span>
                              </p>
                              
                              <p className="text-[9px] text-[#6F7178] font-medium leading-tight">
                                📍 {umkm.address}
                              </p>
                              
                              <div className="flex gap-2 mt-2.5 pt-2 border-t border-white/5">
                                <a 
                                  href={`https://www.google.com/maps/search/?api=1&query=${umkm.lat},${umkm.lng}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-2 bg-[#FF6B1A] text-white text-[10px] font-bold rounded-lg hover:bg-[#e05615] transition-all text-center"
                                >
                                  Petunjuk Rute
                                </a>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            {/* Tab Selector */}
            <div className="flex bg-[#F8ECD2]/50 p-1 rounded-xl border border-[#E8E8E8] gap-1">
              <button
                type="button"
                onClick={() => setLocationMode('explore')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all press ${
                  locationMode === 'explore'
                    ? 'bg-[#FF6B1A] text-white shadow-sm'
                    : 'text-[#6F7178] hover:text-[#FF6B1A]'
                }`}
              >
                Daftar Wilayah
              </button>
              <button
                type="button"
                onClick={() => setLocationMode('manual')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all press ${
                  locationMode === 'manual'
                    ? 'bg-[#FF6B1A] text-white shadow-sm'
                    : 'text-[#6F7178] hover:text-[#FF6B1A]'
                }`}
              >
                Pilih Manual
              </button>
            </div>

            {locationMode === 'explore' ? (
              <>
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
              </>
            ) : (
              <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-4 space-y-4 animate-fade-in text-left">
                <h4 className="font-bold text-xs text-[#171C38] mb-1">Pilih Wilayah Manual</h4>
                
                {/* Dropdown Provinsi */}
                <div>
                  <label htmlFor="manual-provinsi" className="block text-[10px] font-bold text-[#6F7178] mb-1">Provinsi</label>
                  <select
                    id="manual-provinsi"
                    value={selectedProvinsi?.nama || ''}
                    onChange={(e) => handleProvinsiSelect(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinsiList.map((p) => (
                      <option key={p.id} value={p.nama}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Kabupaten */}
                {selectedProvinsi && (
                  <div className="animate-fade-in">
                    <label htmlFor="manual-kabupaten" className="block text-[10px] font-bold text-[#6F7178] mb-1">Kabupaten/Kota</label>
                    <select
                      id="manual-kabupaten"
                      value={selectedKabupaten?.nama || ''}
                      onChange={(e) => handleKabupatenSelect(e.target.value)}
                      className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                    >
                      <option value="">-- Pilih Kabupaten/Kota --</option>
                      {kabupatenList.map((k) => (
                        <option key={k.id} value={k.nama}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Dropdown Kecamatan */}
                {selectedProvinsi && selectedKabupaten && (
                  <div className="animate-fade-in">
                    <label htmlFor="manual-kecamatan" className="block text-[10px] font-bold text-[#6F7178] mb-1">Kecamatan</label>
                    <select
                      id="manual-kecamatan"
                      value={selectedKecamatan?.nama || ''}
                      onChange={(e) => handleKecamatanSelect(e.target.value)}
                      className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-2.5 text-xs font-semibold focus-ring"
                    >
                      <option value="">-- Pilih Kecamatan --</option>
                      {kecamatanList.map((k) => (
                        <option key={k.id} value={k.nama}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Kelurahan List */}
                {selectedProvinsi && selectedKabupaten && selectedKecamatan && (
                  <div className="border-t border-[#E8E8E8]/50 pt-3 animate-fade-in">
                    <label className="block text-[10px] font-bold text-[#6F7178] mb-2">Desa/Kelurahan Terdaftar</label>
                    {subLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="w-5 h-5 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                        {kelurahanList.map((k) => (
                          <div key={k.id} className="p-2 rounded-lg text-[11px] border border-transparent hover:bg-[#F8ECD2]/50 text-[#171C38] font-medium">
                            {k.nama}
                          </div>
                        ))}
                        {kelurahanList.length === 0 && (
                          <p className="text-[11px] text-[#6F7178] text-center py-2">Tidak ada desa terdaftar.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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

            {/* LOCATION SCORING PANEL (New simulator) */}
            <div className="glass-card rounded-[20px] p-4 shadow-lg border border-[#E8E8E8] space-y-4">
              <h4 className="font-bold text-xs text-[#171C38] flex items-center gap-1.5 font-sans">
                <Building className="w-4.5 h-4.5 text-[#FF6B1A]" />
                <span>Simulator Kelayakan Lokasi</span>
              </h4>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="scoring-biztype" className="text-[10px] font-bold text-[#171C38]">Kategori Bisnis</label>
                  <select
                    id="scoring-biztype"
                    value={bizType}
                    onChange={(e) => setBizType(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] rounded-lg py-1.5 px-2 text-[10px] font-semibold text-[#6F7178] focus-ring"
                    style={{ colorScheme: 'light' }}
                  >
                    <option value="Kuliner / Makanan">Kuliner / Makanan</option>
                    <option value="Toko Kelontong / Retail">Toko Kelontong / Retail</option>
                    <option value="Jasa / Laundry / Barber">Jasa / Laundry / Barber</option>
                    <option value="Kafe / Coffee Shop">Kafe / Coffee Shop</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="scoring-radius" className="text-[10px] font-bold text-[#171C38]">Radius Jangkauan</label>
                  <select
                    id="scoring-radius"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] rounded-lg py-1.5 px-2 text-[10px] font-semibold text-[#6F7178] focus-ring"
                    style={{ colorScheme: 'light' }}
                  >
                    <option value="1 km">Radius 1 km</option>
                    <option value="3 km">Radius 3 km</option>
                    <option value="5 km">Radius 5 km</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculateScore}
                className="w-full btn-primary py-2.5 rounded-xl text-[10px] font-bold cursor-pointer"
              >
                Cek Skor Kelayakan
              </button>

              {scoreLoading && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-[#6F7178] font-bold">Menganalisis spasial wilayah...</span>
                </div>
              )}

              {scoreResult && (
                <div className="space-y-3.5 animate-bounce-in border-t border-[#E8E8E8] pt-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#171C38] uppercase">Skor Strategis Lokasi</span>
                    <span className="text-xl font-extrabold text-[#FF6B1A] text-glow-orange">{scoreResult.score} / 100</span>
                  </div>

                  <div className="space-y-2">
                    {/* Aksesibilitas */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-[#6F7178]">
                        <span>Aksesibilitas & Trafik</span>
                        <span>{scoreResult.access}%</span>
                      </div>
                      <div className="w-full bg-[#171C38]/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-[#FF6B1A] h-1" style={{ width: `${scoreResult.access}%` }} />
                      </div>
                    </div>

                    {/* Kompetisi */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-[#6F7178]">
                        <span>Kerapatan Kompetitor</span>
                        <span>{scoreResult.competitor}%</span>
                      </div>
                      <div className="w-full bg-[#171C38]/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-amber-500 h-1" style={{ width: `${scoreResult.competitor}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#6F7178] bg-[#171C38]/5 border border-[#E8E8E8] rounded-lg p-2.5 font-semibold leading-relaxed">
                    {scoreResult.tip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-[#171C38] font-sans">Daftar UMKM & Tempat Usaha Terdaftar</h3>
              <p className="text-[10px] text-[#6F7178] mt-0.5">Daftar pelaku usaha mikro yang terdaftar di sistem pemetaan wilayah Perintis.</p>
            </div>
            <span className="px-2.5 py-1 bg-[#FF6B1A]/10 text-[#FF6B1A] text-[10px] font-extrabold rounded-lg">
              Total: {[...UMKM_LOCATIONS, ...customLocations].length} Usaha
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-slate-50/50">
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider">Nama Usaha</th>
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider">Kategori</th>
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider">Produk Unggulan</th>
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider">Alamat</th>
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider">Rating</th>
                  <th className="py-3 px-3 text-[10px] font-extrabold text-[#6F7178] uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#171C38] divide-y divide-[#E8E8E8]/50">
                {[...UMKM_LOCATIONS, ...customLocations].map((umkm, idx) => {
                  const isUserBiz = umkm.isUserCreated;
                  return (
                    <tr key={idx} className="hover:bg-[#F8ECD2]/30 transition-colors">
                      <td className="py-3.5 px-3 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span>{umkm.name}</span>
                          {isUserBiz && (
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-extrabold rounded uppercase tracking-wider">
                              Usaha Saya
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                          isUserBiz ? 'bg-emerald-500/15 text-emerald-500' : 'bg-[#FF6B1A]/15 text-[#FF6B1A]'
                        }`}>
                          {umkm.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#6F7178] font-medium">{umkm.products}</td>
                      <td className="py-3.5 px-3 text-[#6F7178] font-medium max-w-[200px] truncate" title={umkm.address}>
                        {umkm.address}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-amber-500">
                        ⭐ {umkm.rating} <span className="text-[#6F7178] font-normal text-[10px]">({umkm.reviews})</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setMapCenter([umkm.lat, umkm.lng]);
                            setMapZoom(16);
                            setViewMode('map');
                          }}
                          className="px-3 py-1.5 bg-[#FF6B1A]/10 text-[#FF6B1A] hover:bg-[#FF6B1A] hover:text-white transition-all text-[10px] font-bold rounded-lg"
                        >
                          Lihat di Peta
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Modal Daftar Usaha Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-[0_8px_32px_rgba(23,28,56,0.12)] animate-scale-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
              <h3 className="text-lg font-extrabold text-[#171C38] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#FF6B1A]" />
                Daftarkan Usaha Baru
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#171C38]/5 text-[#6F7178] hover:text-[#171C38] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddBusiness} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Nama Usaha</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Warmindo Berkah" 
                  value={newBiz.name}
                  onChange={(e) => setNewBiz(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-white border border-[#E8E8E8] rounded-xl text-sm text-[#171C38] placeholder:text-[#6F7178]/50 focus:border-[#FF6B1A] outline-none transition-all shadow-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Kategori</label>
                  <select 
                    value={newBiz.type}
                    onChange={(e) => setNewBiz(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 bg-white border border-[#E8E8E8] rounded-xl text-sm text-[#171C38] focus:border-[#FF6B1A] outline-none transition-all shadow-sm"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Jasa">Jasa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Produk Unggulan</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Mie, Kopi" 
                    value={newBiz.products}
                    onChange={(e) => setNewBiz(prev => ({ ...prev, products: e.target.value }))}
                    className="w-full p-3 bg-white border border-[#E8E8E8] rounded-xl text-sm text-[#171C38] placeholder:text-[#6F7178]/50 focus:border-[#FF6B1A] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Jl. Kampus No. 12, Purwokerto" 
                  value={newBiz.address}
                  onChange={(e) => setNewBiz(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 bg-white border border-[#E8E8E8] rounded-xl text-sm text-[#171C38] placeholder:text-[#6F7178]/50 focus:border-[#FF6B1A] outline-none transition-all shadow-sm resize-none"
                />
              </div>

              <div className="bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 rounded-xl p-3 text-[10px] text-[#FF6B1A] font-bold leading-relaxed">
                👉 <strong>Cara menentukan koordinat:</strong><br />
                Klik lokasi mana saja di peta Google Maps untuk langsung mengisi Latitude & Longitude secara otomatis!
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    required
                    readOnly
                    placeholder="Pilih di peta" 
                    value={newBiz.lat}
                    className="w-full p-3 bg-slate-50 border border-[#E8E8E8] rounded-xl text-sm text-[#171C38]/60 outline-none cursor-not-allowed shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6F7178] uppercase tracking-wider mb-1.5">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    required
                    readOnly
                    placeholder="Pilih di peta" 
                    value={newBiz.lng}
                    className="w-full p-3 bg-slate-50 border border-[#E8E8E8] rounded-xl text-sm text-[#171C38]/60 outline-none cursor-not-allowed shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button"
                  onClick={() => {
                    if (userLocation) {
                      setNewBiz(prev => ({ ...prev, lat: userLocation.lat.toFixed(6), lng: userLocation.lng.toFixed(6) }));
                    } else {
                      alert("Gagal mendeteksi lokasi GPS Anda.");
                    }
                  }}
                  className="flex-1 py-3 bg-slate-50 text-[#171C38] text-xs font-bold rounded-xl hover:bg-slate-100 border border-[#E8E8E8] transition-all text-center"
                >
                  Gunakan Lokasi GPS
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#FF6B1A] text-white text-xs font-extrabold rounded-xl hover:bg-[#e05615] transition-all text-center shadow-md shadow-orange-500/10"
                >
                  Daftarkan Usaha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
