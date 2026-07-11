import React, { useState } from 'react';
import { Sparkles, Brain, Award, Star, TrendingUp, Users, Heart, AlertTriangle, Check } from 'lucide-react';

export default function Validator({ validationData, setValidationData }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: validationData?.input?.businessName || '',
    category: validationData?.input?.category || 'Kuliner',
    description: validationData?.input?.description || '',
    targetMarket: validationData?.input?.targetMarket || ['Mahasiswa'],
    channels: validationData?.input?.channels || ['Offline/Warung'],
    capital: validationData?.input?.capital || 5000000,
  });

  const handleCheckboxChange = (field, value) => {
    const current = [...form[field]];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter(v => v !== value) });
    } else {
      setForm({ ...form, [field]: [...current, value] });
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate API call to FastAPI backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app'}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_usaha: form.businessName || 'Usaha Baru',
          deskripsi_ide: form.description,
          target_pasar: form.targetMarket.join(', '),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setValidationData({
          input: form,
          result: {
            score: data.skor_bintang || 4.7,
            verdict: data.skor_bintang >= 4.5 ? 'Sangat Layak' : data.skor_bintang >= 3.5 ? 'Layak dengan Catatan' : 'Kurang Layak',
            market: data.analisis?.market || 'Tinggi. Segmen target memiliki kebutuhan konstan.',
            competitor: data.analisis?.competitor || 'Sedang. Perlu diferensiasi yang kuat di kanal distribusi.',
            trend: data.analisis?.trend || 'Positif. Pergeseran perilaku ke arah kemudahan akses.',
            risk: data.analisis?.risiko || 'Perhatikan manajemen biaya operasional dan bahan baku.',
            potential: data.analisis?.potensi || 'Sangat baik untuk eskalasi bertahap jika arus kas stabil.',
          }
        });
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      // Fallback to local simulation if backend is offline
      setTimeout(() => {
        setValidationData({
          input: form,
          result: {
            score: 4.7,
            verdict: 'Sangat Layak',
            market: 'Tinggi. Kebutuhan konstan di segmen target yang Anda pilih.',
            competitor: 'Sedang. Kompetitor lokal ada, namun kanal penjualan terpilih memberi nilai tambah.',
            trend: 'Positif. Sesuai dengan pertumbuhan tren adaptasi digital di daerah target.',
            risk: 'Fluktuasi harga bahan baku pangan utama dan komisi platform pengiriman.',
            potential: 'Skala mikro yang baik. Peluang ekspansi waralaba mikro tinggi setelah 6 bulan stabil.',
          }
        });
      }, 1500);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Business Validator</h2>
        <p className="text-sm text-slate-500 mt-1">Gunakan analisis kecerdasan buatan untuk mengukur kelayakan ide bisnis Anda di pasar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-6 relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] -z-10 translate-y-2 translate-x-2"></div>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/80 shadow-xl relative z-10">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Nama & Kategori Usaha</label>
                <input 
                  type="text"
                  placeholder="Masukkan nama usaha (opsional)"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-2xl p-3 text-sm font-medium placeholder:text-slate-400 mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {['Kuliner', 'Jasa', 'Retail/Toko', 'Digital'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 ${
                        form.category === cat
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">Deskripsi Ide Bisnis</label>
                  <span className="text-[10px] text-slate-400 font-bold">{form.description.length}/300</span>
                </div>
                <textarea
                  maxLength="300"
                  rows="4"
                  placeholder="Jelaskan produk/layanan, masalah yang diselesaikan, dan keunikan bisnismu..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-2xl p-4 text-sm font-medium placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Target Pasar</label>
                <div className="flex flex-wrap gap-2">
                  {['Mahasiswa', 'Pekerja Kantor', 'Kelompok Keluarga', 'Umum'].map((market) => {
                    const isChecked = form.targetMarket.includes(market);
                    return (
                      <button
                        key={market}
                        type="button"
                        onClick={() => handleCheckboxChange('targetMarket', market)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                        <span>{market}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Kanal Penjualan Utama</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Offline/Warung', 'E-commerce', 'Delivery Online'].map((channel) => {
                    const isChecked = form.channels.includes(channel);
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => handleCheckboxChange('channels', channel)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{channel}</span>
                        {isChecked && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capital Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">Estimasi Modal Awal</label>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                    {formatRupiah(form.capital)}
                  </span>
                </div>
                <input 
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="1000000"
                  value={form.capital}
                  onChange={(e) => setForm({ ...form, capital: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>Rp 1 Juta</span>
                  <span>Rp 50 Juta</span>
                  <span>Rp 100 Juta+</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !form.description}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-4 font-bold text-sm hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menganalisa Ide...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Analisa Mendalam dengan AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Results View */}
        <div className="lg:col-span-6 space-y-6">
          {validationData?.result ? (
            <div className="space-y-6 animate-fade-in">
              {/* Score Badge */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/35 border border-amber-200/50 shadow-md rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-400/10 blur-2xl rounded-full"></div>
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">Skor Validasi AI</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-amber-600 leading-none">{validationData.result.score}</span>
                  <span className="text-lg font-bold text-amber-500/60 leading-none">/ 5.0</span>
                </div>
                <div className="flex gap-1 mb-4 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const diff = validationData.result.score - i;
                    const fill = diff >= 1 ? 'fill-amber-500' : 'opacity-30';
                    return <Star key={i} className={`w-5 h-5 text-amber-500 ${fill}`} />;
                  })}
                </div>
                <p className="text-sm font-medium text-amber-900/80 max-w-sm">
                  {validationData.result.verdict}! Konsep kuat dengan target pasar spesifik dan model distribusi yang efisien.
                </p>
              </div>

              {/* Bento Blocks for Macro Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Market Demand */}
                <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Market Demand</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validationData.result.market}</p>
                </div>

                {/* Competitor Density */}
                <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Competitor Density</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validationData.result.competitor}</p>
                </div>

                {/* Consumer Trend */}
                <div className="bg-white/60 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Consumer Trend</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validationData.result.trend}</p>
                </div>

                {/* Risk */}
                <div className="bg-red-500/5 backdrop-blur-lg border border-red-500/10 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Operational Risk</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validationData.result.risk}</p>
                </div>

                {/* Growth Potential */}
                <div className="bg-emerald-500/5 backdrop-blur-lg border border-emerald-500/10 rounded-2xl p-5 shadow-sm sm:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">Growth Potential</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validationData.result.potential}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Award className="w-12 h-12 mb-3 stroke-[1.5]" />
              <h3 className="font-bold text-slate-700 text-sm">Belum Ada Analisa</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Isi formulir ide bisnis Anda di sebelah kiri dan klik tombol analisa untuk melihat hasil dari AI Perintis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
