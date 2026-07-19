import React, { useState } from 'react';
import {
  Home,
  Layers,
  Sparkles,
  Calculator,
  MessageSquare,
  TrendingUp,
  MapPin,
  Award,
  Menu
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // 4 menu utama yang tampil langsung di bottom nav
  const primaryItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'validator', label: 'Cek Ide', icon: Sparkles },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
  ];

  // 4 menu sekunder yang dikelompokkan di dalam "Lainnya"
  const secondaryItems = [
    { id: 'harga', label: 'Harga Pangan', icon: Layers, desc: 'Pantau harga pangan real-time' },
    { id: 'lokasi', label: 'Lokasi Pasar', icon: MapPin, desc: 'Peta lokasi pasar terdekat' },
    { id: 'roi', label: 'Proyeksi ROI', icon: TrendingUp, desc: 'Analisis laba & modal usaha' },
    { id: 'legalitas', label: 'Legalitas', icon: Award, desc: 'Panduan sertifikasi ekspor' },
  ];

  const handlePrimaryClick = (id) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  const handleSecondaryClick = (id) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  const isSecondaryActive = secondaryItems.some(item => activeTab === item.id);

  return (
    <>
      {/* Backdrop transparan untuk menutup menu Lainnya saat diklik di luar */}
      {isMoreOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] lg:hidden animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      <nav className="lg:hidden fixed bottom-4 left-3 right-3 z-50 bg-[#171C38]/90 backdrop-blur-md border border-[#FF6B1A]/20 rounded-[28px] flex items-center justify-between py-2 px-3 shadow-2xl shadow-orange-500/10">
        
        {/* Pop-up menu sekunder "Lainnya" */}
        {isMoreOpen && (
          <div className="absolute bottom-16 left-0 right-0 bg-[#171C38]/95 backdrop-blur-xl border border-[#FF6B1A]/25 rounded-[24px] p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 shadow-2xl animate-scale-in z-50">
            <div className="col-span-full border-b border-white/5 pb-1.5 mb-0.5 flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7178]">Layanan Tambahan</span>
            </div>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSecondaryClick(item.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-300 press-sm ${
                    isActive
                      ? 'bg-[#FF6B1A]/15 border-[#FF6B1A]/40 text-[#FF6B1A] font-bold shadow-[0_0_12px_rgba(255,107,26,0.15)]'
                      : 'bg-white/5 border-transparent text-[#FAF6EE]/80 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#FF6B1A]/20 text-[#FF6B1A]' : 'bg-[#171C38]/60 text-[#FAF6EE]/60'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate">{item.label}</span>
                    <span className="text-[9px] text-[#6F7178] font-semibold leading-none mt-0.5 truncate">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Ikon Menu Utama */}
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isMoreOpen;
          return (
            <button
              key={item.id}
              onClick={() => handlePrimaryClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all duration-300 press ${
                isActive
                  ? 'text-[#FF6B1A] font-bold scale-105 drop-shadow-[0_0_4px_rgba(255,107,26,0.5)]'
                  : 'text-[#6F7178] hover:text-slate-200'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Tombol Menu "Lainnya" */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          aria-label="Menu lainnya"
          className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all duration-300 press ${
            isMoreOpen || isSecondaryActive
              ? 'text-[#FF6B1A] font-bold scale-105 drop-shadow-[0_0_4px_rgba(255,107,26,0.5)]'
              : 'text-[#6F7178] hover:text-slate-200'
          }`}
        >
          <Menu className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold mt-0.5">Lainnya</span>
        </button>

      </nav>
    </>
  );
}
