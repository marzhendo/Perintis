import React, { useState, useEffect } from 'react';
import { Search, Download, ArrowUp, ArrowDown, Calendar, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { fetchCommodities, getFallbackCommodities } from '../services/commodityApi';
import { useToast } from '../components/Toast';
import { CardSkeleton, Shimmer } from '../components/LoadingSkeleton';

// Mock Seasonality Data for Indonesian Food Commodities
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
    Jul: 'Sedang', Agu: 'Sedang', Sep: 'Tinggi', Okt: 'Tinggi', Nov: 'Tinggi', Des: 'Tinggi',
    tip: 'Musim panen raya terjadi di April-Juni (harga terendah). Lakukan pembelian borongan (bulk) di bulan Mei untuk persediaan stok.'
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
  const [selectedCommoditySeason, setSelectedCommoditySeason] = useState('Cabai Rawit');
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    fetchCommodities(region)
      .then(data => { setCommodities(data); setLoading(false); })
      .catch(() => {
        setCommodities(getFallbackCommodities(region));
        setLoading(false);
        toast.info('Menampilkan data offline — server tidak merespon');
      });
  }, [region]);
  
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

  const activeSeason = SEASONAL_DATA[selectedCommoditySeason] || SEASONAL_DATA['Cabai Rawit'];

  return (
    <div className="space-y-8 animate-fade-in text-left relative z-10 w-full">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Dashboard Harga Pangan</h2>
          <p className="text-sm text-[#6F7178] mt-1 font-semibold">
            Pantau pergerakan harga komoditas pangan terkini untuk estimasi biaya usaha.
            {region && <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold text-[10px] border border-[#FF6B1A]/20 shadow-[0_0_8px_rgba(255,107,26,0.1)]">{region}</span>}
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7178]" />
          <input 
            type="text"
            placeholder="Cari komoditas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl text-sm font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring"
          />
        </div>
      </header>

      {/* Decorative Blob */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {/* Grid: Commodities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filtered.slice(0, 4).map((item, i) => (
          <div key={item.id} className="glass-card rounded-[20px] p-6 flex flex-col gap-4 shadow-lg shadow-orange-500/5 animate-slide-up" style={{ animationDelay: `${(i + 1) * 0.08}s` }}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B1A]/10 flex items-center justify-center text-[#FF6B1A] border border-[#FF6B1A]/20 shadow-[0_0_8px_rgba(255,107,26,0.1)]">
                  <span className="font-bold text-xs">{item.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#171C38] text-sm leading-tight">{item.name}</h3>
                  <span className="text-[10px] text-[#6F7178] uppercase font-bold tracking-wider">{item.unit}</span>
                </div>
              </div>
              
              {item.isUp !== null && (
                <div className={`px-2 py-1 rounded-full flex items-center gap-0.5 text-[10px] font-bold ${
                  item.isUp 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
                  stroke={item.isUp ? "#F43F5E" : item.isUp === false ? "#10B981" : "#94A3B8"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={getSparklinePoints(item.history)}
                />
              </svg>
            </div>
          </div>
        ))}
      </section>

      {/* KALENDER MUSIMAN PANGAN & PREDIKSI HARGA (New extension) */}
      <section className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8] w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E8E8] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <Calendar className="w-5 h-5 text-[#FF6B1A]" />
              <span>Kalender Musiman & Risiko Harga Pangan</span>
            </h3>
            <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">Analisis siklus fluktuasi harga pangan tahunan untuk mengantisipasi lonjakan modal belanja.</p>
          </div>
          <div className="flex bg-[#171C38]/5 p-1 rounded-2xl border border-[#E8E8E8]">
            {Object.keys(SEASONAL_DATA).map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCommoditySeason(item)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all press-sm ${
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
      <section className="glass-card rounded-[20px] p-6 overflow-hidden w-full">
        {loading ? (
          <div className="space-y-4">
            <Shimmer className="h-6 w-48 animate-pulse" />
            <Shimmer className="h-8 w-full animate-pulse" />
            <Shimmer className="h-8 w-full animate-pulse" />
            <Shimmer className="h-8 w-full animate-pulse" />
          </div>
        ) : (
        <>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[#171C38]">Riwayat Harga Terkini</h3>
          <button className="text-[#FF6B1A] font-semibold text-xs hover:bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 press">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#FF6B1A]/10">
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Komoditas</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Harga</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Perubahan</th>
                <th className="py-3 px-4 text-xs font-bold text-[#6F7178] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#6F7178] divide-y divide-orange-500/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#171C38]/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#171C38]">{item.name}</td>
                  <td className="py-4 px-4 text-[#6F7178]">{item.date}</td>
                  <td className="py-4 px-4 font-semibold">{formatRupiah(item.price)}</td>
                  <td className={`py-4 px-4 font-semibold ${
                    item.changeRp > 0 
                      ? 'text-rose-400' 
                      : item.changeRp < 0 
                        ? 'text-emerald-400' 
                        : 'text-[#6F7178]'
                  }`}>
                    {item.changeRp > 0 ? `+ ${formatRupiah(item.changeRp)}` : item.changeRp < 0 ? `- ${formatRupiah(Math.abs(item.changeRp))}` : 'Rp 0'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.isUp === true
                        ? 'bg-rose-500/10 text-rose-400'
                        : item.isUp === false
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-700/50 text-[#6F7178]'
                    }`}>
                      {item.isUp === true ? 'Naik' : item.isUp === false ? 'Turun' : 'Stabil'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#6F7178] font-semibold">Komoditas tidak ditemukan.</td>
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
