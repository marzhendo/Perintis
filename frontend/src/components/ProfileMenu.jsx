import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, BookOpen, LogOut, ChevronDown, HelpCircle } from 'lucide-react';

export default function ProfileMenu({ user, onLogout, onOpenAuth, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAuth}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
          title="Masuk"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <button onClick={onOpenAuth} className="btn-primary text-xs px-5 py-2.5">
          Mulai Sekarang
        </button>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const menuItems = [
    { id: 'profile', label: 'Profil Saya', icon: User, desc: 'Kelola data diri dan preferensi' },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell, desc: 'Aktivitas dan pengingat', badge: 2 },
    { id: 'guide', label: 'Panduan', icon: BookOpen, desc: 'Pelajari fitur platform' },
    { id: 'bantuan', label: 'Pusat Bantuan', icon: HelpCircle, desc: 'FAQ dan dukungan' },
    { id: 'logout', label: 'Keluar Akun', icon: LogOut, desc: '', danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/10 transition-all press focus-ring"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B1A] to-[#FF8A3D] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
          {initials}
        </div>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl p-2 shadow-2xl z-50 text-left animate-scale-in border border-[#E8E8E8]">
          <div className="px-4 py-3 border-b border-[#E8E8E8]">
            <p className="font-bold text-sm text-[#171C38] truncate">{user.name}</p>
            <p className="text-xs text-[#6F7178] truncate mt-0.5">{user.email}</p>
          </div>

          <div className="py-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              if (item.id === 'logout') {
                return (
                  <button
                    key={item.id}
                    onClick={() => { setOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1 press-sm focus-ring"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => { setOpen(false); onNavigate(item.id); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#171C38] hover:bg-[#F8ECD2]/50 transition-colors relative press-sm focus-ring"
                >
                  <Icon className="w-4 h-4 text-[#6F7178]" />
                  <div className="flex-1 text-left">
                    <span>{item.label}</span>
                    {item.desc && <p className="text-[10px] text-[#6F7178] font-normal mt-0.5">{item.desc}</p>}
                  </div>
                  {item.badge && (
                    <span className="bg-[#FF6B1A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
