import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut } from 'lucide-react';

export default function MobileProfileDropdown({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B1A] to-[#FF8A3D] text-[#171C38] font-extrabold text-xs flex items-center justify-center shadow-md shadow-orange-500/10"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-[#FAF6EE]/95 backdrop-blur-md border border-[#FF6B1A]/20 shadow-xl rounded-2xl p-2 z-50 text-left animate-scale-in">
          <div className="px-3 py-2 border-b border-[#FF6B1A]/10">
            <p className="font-bold text-xs text-[#171C38] truncate">{user.name}</p>
            <p className="text-[10px] text-[#6F7178] truncate mt-0.5">{user.email}</p>
          </div>
          <div className="py-1">
            <button onClick={() => { setOpen(false); onNavigate('profile'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#6F7178] hover:text-[#171C38] hover:bg-[#171C38]/5 transition-colors">
              <User className="w-4 h-4 text-[#6F7178]" />
              <span>Profil Saya</span>
            </button>
            <button onClick={() => { setOpen(false); onNavigate('notifikasi'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#6F7178] hover:text-[#171C38] hover:bg-[#171C38]/5 transition-colors">
              <Bell className="w-4 h-4 text-[#6F7178]" />
              <span>Notifikasi</span>
            </button>
            <button onClick={() => { setOpen(false); onLogout(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors mt-1">
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
