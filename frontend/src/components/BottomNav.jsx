import React from 'react';
import {
  Home,
  Layers,
  Sparkles,
  Calculator,
  MessageSquare,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'harga', label: 'Harga', icon: Layers },
    { id: 'lokasi', label: 'Lokasi', icon: MapPin },
    { id: 'validator', label: 'Cek Ide', icon: Sparkles },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'roi', label: 'ROI', icon: TrendingUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-2 right-2 z-50 bg-[#171C38] rounded-[30px] flex items-center justify-around py-2.5 px-1 shadow-xl">
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
                ? 'text-[#FF6B1A] font-bold scale-105'
                : 'text-white/50 hover:text-white/80'
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
