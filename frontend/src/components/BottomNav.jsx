import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  Layers 
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'harga', label: 'Harga', icon: Layers },
    { id: 'validator', label: 'Validator', icon: Sparkles },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'roi', label: 'ROI', icon: TrendingUp },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl flex items-center justify-around py-3 px-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'text-blue-400 bg-white/10 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wide font-medium mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
