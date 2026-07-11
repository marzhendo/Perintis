import React, { useState } from 'react';
import { Search, Download, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

const INITIAL_COMMODITIES = [
  { id: 1, name: 'Beras Premium', unit: 'per Kg', price: 15400, change: 2.4, changeRp: 300, isUp: true, date: '24 Okt 2024', history: [14800, 14950, 15100, 15150, 15250, 15400], color: '#E11D48' },
  { id: 2, name: 'Cabai Rawit', unit: 'per Kg', price: 45000, change: -5.1, changeRp: -2500, isUp: false, date: '24 Okt 2024', history: [49500, 48000, 47800, 46500, 45800, 45000], color: '#10B981' },
  { id: 3, name: 'Daging Ayam', unit: 'per Ekor', price: 38500, change: 1.2, changeRp: 500, isUp: true, date: '23 Okt 2024', history: [37200, 37500, 38100, 38000, 38200, 38500], color: '#E11D48' },
  { id: 4, name: 'Bawang Merah', unit: 'per Kg', price: 28000, change: -0.8, changeRp: -200, isUp: false, date: '23 Okt 2024', history: [29200, 29000, 28800, 28500, 28200, 28000], color: '#10B981' },
  { id: 5, name: 'Minyak Goreng', unit: 'per Liter', price: 18200, change: 0.0, changeRp: 0, isUp: null, date: '22 Okt 2024', history: [18200, 18200, 18200, 18200, 18200, 18200], color: '#737686' },
  { id: 6, name: 'Gula Pasir', unit: 'per Kg', price: 16500, change: 0.6, changeRp: 100, isUp: true, date: '22 Okt 2024', history: [16100, 16200, 16300, 16400, 16400, 16500], color: '#E11D48' },
  { id: 7, name: 'Telur Ayam Ras', unit: 'per Kg', price: 27500, change: -1.8, changeRp: -500, isUp: false, date: '21 Okt 2024', history: [28900, 28700, 28400, 28000, 27800, 27500], color: '#10B981' },
  { id: 8, name: 'Bawang Putih', unit: 'per Kg', price: 32000, change: 1.5, changeRp: 450, isUp: true, date: '21 Okt 2024', history: [31000, 31200, 31400, 31500, 31800, 32000], color: '#E11D48' },
];

export default function HargaPangan() {
  const [search, setSearch] = useState('');
  
  const filtered = INITIAL_COMMODITIES.filter((item) =>
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
        const y = 30 - ((val - min) / range) * 20 - 5; // fit in 30px height, pad 5px
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Harga Pangan</h2>
          <p className="text-sm text-slate-500 mt-1">Pantau pergerakan harga komoditas pangan terkini untuk estimasi biaya usaha.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari komoditas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-2xl backdrop-blur-md transition-all text-sm font-medium placeholder:text-slate-400"
          />
        </div>
      </header>

      {/* Grid: Commodities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 4).map((item) => (
          <div key={item.id} className="apple-glass rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 shadow-sm border border-white/50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <span className="font-semibold text-xs">{item.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h3>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{item.unit}</span>
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
              <div className="text-xl font-extrabold text-slate-900">{formatRupiah(item.price)}</div>
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
      <section className="apple-glass rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Riwayat Harga Terkini</h3>
          <button className="text-blue-600 font-semibold text-xs hover:bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Komoditas</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Harga</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perubahan</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-900 divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-4 px-4 text-slate-500">{item.date}</td>
                  <td className="py-4 px-4 font-medium">{formatRupiah(item.price)}</td>
                  <td className={`py-4 px-4 font-semibold ${
                    item.changeRp > 0 
                      ? 'text-rose-600' 
                      : item.changeRp < 0 
                        ? 'text-emerald-600' 
                        : 'text-slate-500'
                  }`}>
                    {item.changeRp > 0 ? `+ ${formatRupiah(item.changeRp)}` : item.changeRp < 0 ? `- ${formatRupiah(Math.abs(item.changeRp))}` : 'Rp 0'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.isUp === true
                        ? 'bg-rose-500/10 text-rose-600'
                        : item.isUp === false
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-slate-500/10 text-slate-600'
                    }`}>
                      {item.isUp === true ? 'Naik' : item.isUp === false ? 'Turun' : 'Stabil'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">Komoditas tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
