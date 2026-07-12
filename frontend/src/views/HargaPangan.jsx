import React, { useState, useEffect } from 'react';
import { Search, Download, ArrowUp, ArrowDown, MapPin, ChevronDown, ExternalLink, Calendar, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { fetchCommodities, getFallbackCommodities } from '../services/commodityApi';
import { useToast } from '../components/Toast';
import { CardSkeleton, Shimmer } from '../components/LoadingSkeleton';

// 34 provinsi sesuai data Bank Indonesia PIHPS
const BI_PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
  'Jambi', 'Bengkulu', 'Sumatera Selatan', 'Kepulauan Bangka Belitung',
  'Lampung', 'Banten', 'Jawa Barat', 'DKI Jakarta', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Selatan',
  'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara', 'Gorontalo',
  'Sulawesi Selatan', 'Sulawesi Tenggara', 'Sulawesi Tengah', 'Sulawesi Utara',
  'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat',
];

const SEASONAL_DATA = {
  'Cabai Rawit': {
    Jan: 'Tinggi', Feb: 'Tinggi', Mar: 'Sedang', Apr: 'Sedang', Mei: 'Rendah', Jun: 'Rendah',
    Jul: 'Rendah', Agu: 'Rendah', Sep: 'Rendah', Okt: 'Sedang', Nov: 'Tinggi', Des: 'Tinggi',
    tip: 'Puncak musim hujan menghambat panen cabai di Nov-Feb. Pertimbangkan stok cabai kering giling atau buat kontrak pasokan sejak Juni.'
  },
  'Bawang Merah': {
    Jan: 'Sedang', Feb: 'Sedang', Mar: 'Tinggi', Apr: 'Tinggi', Mei: 'Sedang', Jun: 'Rendah',
    Jul: 'Rendah', Agu: 'Rendah', Sep: 'Rendah', Okt: 'Sedang', Nov: 'Sedang', Des: 'Tinggi',
    tip: 'Harga cenderung melambung tinggi pada akhir tahun dan musim pancaroba (Maret-April). Beli dalam bentuk kering/awetan di bulan Agustus.'
  },
  'Daging Ayam': {
    Jan: 'Rendah', Feb: 'Rendah', Mar: 'Tinggi', Apr: 'Tinggi', Mei: 'Sedang', Jun: 'Rendah',
    Jul: 'Rendah', Agu: 'Rendah', Sep: 'Rendah', Okt: 'Rendah', Nov: 'Rendah', Des: 'Tinggi',
    tip: 'Mengalami lonjakan permintaan signifikan menjelang bulan suci Ramadan (Maret-April) dan libur akhir tahun (Desember).'
  },
  'Beras Premium': {
    Jan: 'Tinggi', Feb: 'Tinggi', Mar: 'Sedang', Apr: 'Rendah', Mei: 'Rendah', Jun: 'Rendah',
    Jul: 'Rendah', Agu: 'Rendah', Sep: 'Rendah', Okt: 'Sedang', Nov: 'Sedang', Des: 'Sedang',
    tip: 'Musim panen raya padi biasanya terjadi di April-Juni (harga terendah). Lakukan pembelian jumlah besar atau kontrak harga di periode ini.'
  }
};

const MONTHS_LIST = [
  { code: 'Jan', label: 'Jan' },
  { code: 'Feb', label: 'Feb' },
  { code: 'Mar', label: 'Mar' },
  { code: 'Apr', label: 'Apr' },
  { code: 'Mei', label: 'Mei' },
  { code: 'Jun', label: 'Jun' },
  { code: 'Jul', label: 'Jul' },
  { code: 'Agu', label: 'Agu' },
  { code: 'Sep', label: 'Sep' },
  { code: 'Okt', label: 'Okt' },
  { code: 'Nov', label: 'Nov' },
  { code: 'Des', label: 'Des' }
];

export default function HargaPangan({ region }) {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [selectedCommoditySeason, setSelectedCommoditySeason] = useState('Cabai Rawit');
  const activeSeason = SEASONAL_DATA[selectedCommoditySeason] || SEASONAL_DATA['Cabai Rawit'];
  const toast = useToast();

  // Use selectedProvince if set, otherwise fall back to region from props
  const activeLocation = selectedProvince || region || '';

  useEffect(() => {
    setLoading(true);
    fetchCommodities(activeLocation || null)
      .then(data => { setCommodities(data); setLoading(false); })
      .catch(() => {
        setCommodities(getFallbackCommodities(activeLocation || null));
        setLoading(false);
        toast.info('Menampilkan data offline — server tidak merespon');
      });
  }, [activeLocation]);

  const filtered = commodities.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getSparklinePoints = (history) => {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    return history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * 100;
        const y = 30 - ((val - min) / range) * 20 - 5;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const dataDate = commodities[0]?.date || '';

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header & Controls */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Dashboard Harga Pangan</h2>
            <p className="text-sm text-[#6F7178] mt-1">
              Pantau pergerakan harga komoditas pangan terkini untuk estimasi biaya usaha.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7178]" />
            <input
              type="text"
              placeholder="Cari komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl transition-all text-sm font-medium placeholder:text-[#6F7178] press-sm focus-ring"
            />
          </div>
        </div>

        {/* Province Selector + Source Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Province Dropdown */}
          <div className="relative">
            <button
              id="province-selector-btn"
              onClick={() => setIsProvinceOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E8E8] hover:border-[#FF6B1A]/40 rounded-xl text-sm font-semibold text-[#171C38] transition-all shadow-sm hover:shadow-md press-sm"
            >
              <MapPin className="w-4 h-4 text-[#FF6B1A]" />
              <span>{selectedProvince || 'Semua Provinsi'}</span>
              <ChevronDown className={`w-4 h-4 text-[#6F7178] transition-transform duration-200 ${isProvinceOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProvinceOpen && (
              <div className="absolute z-50 top-full left-0 mt-2 w-64 bg-white border border-[#E8E8E8] rounded-xl shadow-lg overflow-hidden animate-fade-in">
                <div className="max-h-72 overflow-y-auto">
                  {/* National option */}
                  <button
                    onClick={() => { setSelectedProvince(''); setIsProvinceOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!selectedProvince ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold' : 'text-[#171C38] hover:bg-[#F8ECD2] font-medium'}`}
                  >
                    🗺️ Semua Provinsi (Rata-rata Nasional)
                  </button>
                  <div className="border-t border-[#E8E8E8]" />
                  {BI_PROVINCES.map(prov => (
                    <button
                      key={prov}
                      onClick={() => { setSelectedProvince(prov); setIsProvinceOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedProvince === prov ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold' : 'text-[#171C38] hover:bg-[#F8ECD2] font-medium'}`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Source Attribution */}
          <div className="flex items-center gap-2 text-xs text-[#6F7178]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Sumber: <a
                href="https://www.bi.go.id/hargapangan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B1A] hover:underline font-semibold inline-flex items-center gap-0.5"
              >
                Bank Indonesia PIHPS
                <ExternalLink className="w-3 h-3" />
              </a>
              {dataDate && <span className="ml-1">· {dataDate}</span>}
            </span>
          </div>
        </div>
      </header>

      {/* Click-outside to close dropdown */}
      {isProvinceOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProvinceOpen(false)} />
      )}

      {/* Decorative Blob */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {/* Grid: Commodities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filtered.slice(0, 4).map((item, i) => (
          <div key={item.id} className={`bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 card-lift press animate-slide-up delay-${Math.min(i + 1, 8)}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B1A]/10 flex items-center justify-center text-[#FF6B1A] border border-[#FF6B1A]/20">
                  <span className="font-semibold text-xs">{item.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#171C38] text-sm leading-tight">{item.name}</h3>
                  <span className="text-[10px] text-[#6F7178] uppercase font-semibold tracking-wider">{item.unit}</span>
                </div>
              </div>

              {item.isUp !== null && (
                <div className={`px-2 py-1 rounded-full flex items-center gap-0.5 text-[10px] font-bold ${
                  item.isUp
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/15'
                    : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15'
                }`}>
                  {item.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{item.change > 0 ? `+${item.change}%` : `${item.change}%`}</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-xl font-extrabold text-[#171C38]">{formatRupiah(item.price)}</div>
            </div>

            <div className="h-10 w-full mt-1 opacity-80">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <polyline
                  fill="none"
                  stroke={item.isUp ? "#E11D48" : item.isUp === false ? "#10B981" : "#737686"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={getSparklinePoints(item.history)}
                />
              </svg>
            </div>
          </div>
        ))}
      </section>

      {/* KALENDER MUSIMAN PANGAN & PREDIKSI HARGA */}
      <section className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8] w-full text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <Calendar className="w-5 h-5 text-[#FF6B1A]" />
              <span>Kalender Musiman & Risiko Harga Pangan</span>
            </h3>
            <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">Analisis siklus fluktuasi harga pangan tahunan untuk mengantisipasi lonjakan modal belanja.</p>
          </div>
          <div className="flex bg-[#171C38]/5 p-1 rounded-2xl border border-[#E8E8E8] overflow-x-auto max-w-full">
            {Object.keys(SEASONAL_DATA).map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCommoditySeason(item)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all press-sm cursor-pointer whitespace-nowrap ${
                  selectedCommoditySeason === item
                    ? 'bg-[#FF6B1A]/10 text-[#FF6B1A]'
                    : 'text-[#6F7178] hover:text-[#171C38]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 12-Month Risk Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-3 w-full">
          {MONTHS_LIST.map((m) => {
            const risk = activeSeason[m.code];
            let badgeColor = 'bg-slate-100 text-slate-400 border-slate-200';
            if (risk === 'Tinggi') badgeColor = 'bg-rose-500/10 text-rose-600 border-rose-500/30';
            else if (risk === 'Sedang') badgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/30';
            else if (risk === 'Rendah') badgeColor = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';

            return (
              <div key={m.code} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#6F7178]">{m.label}</span>
                <div className={`w-full py-2.5 rounded-xl text-[9px] font-extrabold uppercase border text-center ${badgeColor}`}>
                  {risk}
                </div>
              </div>
            );
          })}
        </div>

        {/* Seasonal Recommendation Box */}
        <div className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
          <div className="text-left space-y-1">
            <h4 className="text-xs font-bold text-[#171C38]">Saran Taktis Mitigasi Risiko Bahan Baku</h4>
            <p className="text-[11px] text-[#6F7178] leading-relaxed font-semibold">{activeSeason.tip}</p>
          </div>
        </div>
      </section>

      {/* Historical Data Table */}
      <section className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            <Shimmer className="h-6 w-48" />
            <Shimmer className="h-8 w-full" />
            <Shimmer className="h-8 w-full" />
            <Shimmer className="h-8 w-full" />
          </div>
        ) : (
        <>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#171C38]">Riwayat Harga Terkini</h3>
            {selectedProvince && (
              <p className="text-xs text-[#6F7178] mt-0.5">
                Menampilkan harga nasional · Data provinsi per komoditas tersedia setelah pembaruan pagi
              </p>
            )}
          </div>
          <button className="text-[#FF6B1A] font-semibold text-xs hover:bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Komoditas</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Harga</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Perubahan</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#171C38] divide-y divide-[#E8E8E8]/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8ECD2]/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#171C38]">{item.name}</td>
                  <td className="py-4 px-4 text-[#6F7178]">{item.date}</td>
                  <td className="py-4 px-4 font-medium">{formatRupiah(item.price)}</td>
                  <td className={`py-4 px-4 font-semibold ${
                    item.changeRp > 0
                      ? 'text-rose-600'
                      : item.changeRp < 0
                        ? 'text-emerald-600'
                        : 'text-[#6F7178]'
                  }`}>
                    {item.changeRp > 0 ? `+ ${formatRupiah(item.changeRp)}` : item.changeRp < 0 ? `- ${formatRupiah(Math.abs(item.changeRp))}` : 'Rp 0'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.isUp === true
                        ? 'bg-rose-500/10 text-rose-600'
                        : item.isUp === false
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-[#6F7178]/10 text-[#6F7178]'
                    }`}>
                      {item.isUp === true ? 'Naik' : item.isUp === false ? 'Turun' : 'Stabil'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#6F7178] font-medium">Komoditas tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
        )}
      </section>
    </div>
  );
}
