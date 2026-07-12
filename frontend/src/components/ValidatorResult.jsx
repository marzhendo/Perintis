import React, { useState } from 'react';
import { Star, TrendingUp, Users, Heart, AlertTriangle, Sparkles, Award, HelpCircle } from 'lucide-react';

function Card({ icon: Icon, color, title, children }) {
  const colorMap = {
    orange: { bg: 'bg-[#FF6B1A]/15', text: 'text-[#FF6B1A]', border: 'border-[#FF6B1A]/20' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    red: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20' },
  };
  const c = colorMap[color] || colorMap.orange;
  return (
    <div className="glass-card rounded-[20px] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center ${c.text} border ${c.border} shadow-[0_0_10px_rgba(255,255,255,0.02)]`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-sm text-[#171C38]">{title}</h4>
      </div>
      <p className="text-xs text-[#6F7178] leading-relaxed font-medium">{children}</p>
    </div>
  );
}

export default function ValidatorResult({ result }) {
  const [activeSwot, setActiveSwot] = useState(null);

  if (!result) {
    return (
      <div className="bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-[#6F7178] min-h-[300px] relative z-10">
        <Award className="w-12 h-12 mb-3 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]" />
        <h3 className="font-bold text-[#171C38] text-sm">Belum Ada Analisa</h3>
        <p className="text-xs text-[#6F7178] mt-1 max-w-xs font-medium">Isi formulir ide bisnis Anda di sebelah kiri dan klik tombol analisa untuk melihat hasil dari AI Perintis.</p>
      </div>
    );
  }

  // SWOT descriptions mapped from AI response parameters
  const swotData = {
    S: {
      title: 'Kekuatan (Strengths)',
      content: result.potential || 'Ide memiliki diferensiasi produk yang kuat atau keunikan tersendiri di pasar lokal.',
      strategy: 'Fokuskan pemasaran pada nilai unik ini untuk menarik loyalitas konsumen awal.',
      color: '#FF6B1A',
      bgLight: 'bg-[#FF6B1A]/5',
      borderLight: 'border-[#FF6B1A]/30',
    },
    W: {
      title: 'Kelemahan (Weaknesses)',
      content: result.risk || 'Ketergantungan modal awal dan biaya bahan baku yang fluktuatif di pasaran.',
      strategy: 'Lakukan efisiensi biaya tetap di awal dan buat opsi menu hemat untuk meminimalkan beban operasional.',
      color: '#fbbf24',
      bgLight: 'bg-amber-500/5',
      borderLight: 'border-amber-500/30',
    },
    O: {
      title: 'Peluang (Opportunities)',
      content: result.trend || 'Peningkatan kesadaran masyarakat terhadap tren gaya hidup sehat atau praktis.',
      strategy: 'Gunakan pemasaran digital dan pesan antar online untuk memperluas jangkauan pembeli.',
      color: '#10b981',
      bgLight: 'bg-emerald-500/5',
      borderLight: 'border-emerald-500/30',
    },
    T: {
      title: 'Ancaman (Threats)',
      content: result.competitor || 'Tingkat kepadatan kompetitor sejenis cukup tinggi di radius operasional.',
      strategy: 'Berikan program promo diskon atau kemitraan loyalitas pelanggan agar tidak mudah beralih.',
      color: '#f43f5e',
      bgLight: 'bg-rose-500/5',
      borderLight: 'border-rose-500/30',
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10 w-full">
      <div className="bg-gradient-to-br from-white/80 to-white/40 border border-[#FF6B1A]/30 shadow-lg shadow-[#FF6B1A]/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#FF6B1A]/10 blur-2xl rounded-full" />
        <h3 className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider mb-2 text-glow-orange font-sans">Skor Validasi AI</h3>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-5xl font-extrabold text-[#FF6B1A] leading-none text-glow-orange font-sans">{result.score}</span>
          <span className="text-lg font-bold text-[#FF6B1A]/50 leading-none">/ 5.0</span>
        </div>
        <div className="flex gap-1 mb-4 text-[#FF6B1A]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-5 h-5 text-[#FF6B1A] ${result.score - i >= 1 ? 'fill-[#FF6B1A]' : 'opacity-20'}`} />
          ))}
        </div>
        <p className="text-sm font-bold text-[#171C38] max-w-sm font-sans">{result.verdict}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card icon={TrendingUp} color="orange" title="Market Demand">{result.market}</Card>
        <Card icon={Users} color="amber" title="Competitor Density">{result.competitor}</Card>
        <Card icon={Heart} color="emerald" title="Consumer Trend">{result.trend}</Card>
        <Card icon={AlertTriangle} color="red" title="Operational Risk">{result.risk}</Card>
        <div className="sm:col-span-2">
          <Card icon={Sparkles} color="emerald" title="Growth Potential">{result.potential}</Card>
        </div>
      </div>

      {/* SWOT AI Matrix Section */}
      <div className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg border border-[#E8E8E8]">
        <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3">
          <div>
            <h4 className="font-bold text-sm text-[#171C38] uppercase tracking-wider font-sans">Matriks SWOT AI Interaktif</h4>
            <p className="text-[10px] text-[#6F7178] mt-0.5 font-semibold">Arahkan kursor atau klik salah satu kuadran untuk melihat rekomendasi aksi taktis.</p>
          </div>
          <HelpCircle className="w-4 h-4 text-[#6F7178]" />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {Object.entries(swotData).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setActiveSwot(key)}
              onClick={() => setActiveSwot(key === activeSwot ? null : key)}
              className={`p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between min-h-[110px] cursor-pointer relative overflow-hidden group ${
                activeSwot === key 
                  ? `${value.bgLight} ${value.borderLight} shadow-sm` 
                  : 'bg-white border-[#E8E8E8] hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: value.color }}>{value.title}</span>
                <span className="font-mono font-black text-2xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: value.color }}>{key}</span>
              </div>
              <p className="text-[10px] text-[#6F7178] line-clamp-3 font-semibold leading-relaxed mt-2">{value.content}</p>
            </button>
          ))}
        </div>

        {/* Selected SWOT Recommendation Alert Panel */}
        <div className="min-h-[70px] bg-[#171C38]/5 rounded-xl p-3 flex flex-col justify-center transition-all duration-300 border border-[#E8E8E8]">
          {activeSwot ? (
            <div className="space-y-1 animate-slide-up">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF6B1A]">Strategi Rekomendasi ({swotData[activeSwot].title}):</span>
              <p className="text-xs text-[#171C38] font-bold leading-relaxed">{swotData[activeSwot].strategy}</p>
            </div>
          ) : (
            <p className="text-xs text-[#6F7178] text-center italic font-semibold">Silakan sorot kuadran SWOT di atas untuk memunculkan saran taktis AI.</p>
          )}
        </div>
      </div>

    </div>
  );
}
