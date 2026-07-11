import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  MessageSquare,
  Layers 
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'harga', label: 'Harga', icon: Layers },
    { id: 'validator', label: 'Cek Ide', icon: Sparkles },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'roi', label: 'ROI', icon: TrendingUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-2 right-2 z-50 bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl flex items-center justify-around py-2.5 px-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-blue-400 bg-white/10 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
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
