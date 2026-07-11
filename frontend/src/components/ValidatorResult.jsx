import React from 'react';
import { Star, TrendingUp, Users, Heart, AlertTriangle, Sparkles, Award } from 'lucide-react';

function Card({ icon: Icon, color, title, children }) {
  const colorMap = {
    orange: { bg: 'bg-[#FF6B1A]/10', text: 'text-[#FF6B1A]', border: 'border-[#FF6B1A]/20' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200/50' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200/50' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200/50' },
  };
  const c = colorMap[color] || colorMap.orange;
  return (
    <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 card-lift">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center ${c.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-sm text-[#171C38]">{title}</h4>
      </div>
      <p className="text-xs text-[#6F7178] leading-relaxed">{children}</p>
    </div>
  );
}

export default function ValidatorResult({ result }) {
  if (!result) {
    return (
      <div className="bg-[#F8ECD2]/30 border border-[#E8E8E8] border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-[#6F7178] min-h-[300px]">
        <Award className="w-12 h-12 mb-3 stroke-[1.5]" />
        <h3 className="font-bold text-[#171C38] text-sm">Belum Ada Analisa</h3>
        <p className="text-xs text-[#6F7178] mt-1 max-w-xs">Isi formulir ide bisnis Anda di sebelah kiri dan klik tombol analisa untuk melihat hasil dari AI Perintis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/35 border border-amber-200/50 shadow-md rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden card-lift">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-400/10 blur-2xl rounded-full" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">Skor Validasi AI</h3>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-5xl font-extrabold text-amber-600 leading-none">{result.score}</span>
          <span className="text-lg font-bold text-amber-500/60 leading-none">/ 5.0</span>
        </div>
        <div className="flex gap-1 mb-4 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-5 h-5 text-amber-500 ${result.score - i >= 1 ? 'fill-amber-500' : 'opacity-30'}`} />
          ))}
        </div>
        <p className="text-sm font-medium text-amber-900/80 max-w-sm">{result.verdict}</p>
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
    </div>
  );
}
