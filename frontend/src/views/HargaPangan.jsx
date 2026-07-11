import React, { useState, useEffect } from 'react';
import { Search, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchCommodities, getFallbackCommodities } from '../services/commodityApi';
import { useToast } from '../components/Toast';
import { CardSkeleton, Shimmer } from '../components/LoadingSkeleton';

export default function HargaPangan({ region }) {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Dashboard Harga Pangan</h2>
          <p className="text-sm text-[#6F7178] mt-1">
            Pantau pergerakan harga komoditas pangan terkini untuk estimasi biaya usaha.
            {region && <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold text-[10px] border border-[#FF6B1A]/20">{region}</span>}
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
      </header>

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
          <h3 className="text-lg font-bold text-[#171C38]">Riwayat Harga Terkini</h3>
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
