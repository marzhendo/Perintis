import React from 'react';
import {
  Home,
  Layers,
  Sparkles,
  Calculator,
  MessageSquare,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'harga', label: 'Harga', icon: Layers },
    { id: 'lokasi', label: 'Lokasi', icon: MapPin },
    { id: 'validator', label: 'Cek Ide', icon: Sparkles },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'legalitas', label: 'Legalitas', icon: Award },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'roi', label: 'ROI', icon: TrendingUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-2 right-2 z-50 bg-[#171C38]/85 backdrop-blur-md border border-[#FF6B1A]/20 rounded-[30px] flex items-center justify-around py-2.5 px-1 shadow-xl shadow-orange-500/5">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-300 press ${
              isActive
                ? 'text-[#FF6B1A] font-bold scale-105 drop-shadow-[0_0_4px_rgba(0,242,254,0.6)]'
                : 'text-[#6F7178] hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[8px] uppercase tracking-wide font-semibold mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
