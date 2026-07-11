import React, { useState } from 'react';
import logo from '../assets/images/Perintis_OLD.svg';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'harga', label: 'Pantau Harga' },
    { id: 'validator', label: 'Cek Ide' },
    { id: 'calculator', label: 'Hitung Keuntungan' },
    { id: 'roi', label: 'Proyeksi ROI' },
    { id: 'guide', label: 'Panduan' },
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[1280px] rounded-full border border-white/40 shadow-xl bg-white/70 backdrop-blur-xl z-50 justify-between items-center px-8 py-3 transition-all duration-300">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5 w-1/4">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-0.5">
          <img src={logo} alt="Perintis Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-extrabold text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Perintis
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-center flex-grow gap-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`font-semibold text-sm transition-all duration-300 px-4 py-2 rounded-full ${
                isActive
                  ? 'text-blue-600 bg-blue-500/10 border border-blue-500/10 shadow-sm'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100/50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center justify-end w-1/4 gap-3 relative">
        <button className="text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full p-2 transition-all">
          <Bell className="w-5 h-5 stroke-[2]" />
        </button>

        {user ? (
          /* LOGGED IN STATE */
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100/80 transition-all border border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner">
                {getInitials(user.name)}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white/90 border border-white/60 shadow-2xl rounded-2xl p-2 backdrop-blur-xl z-50 text-left animate-scale-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-800 leading-tight truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ANONYMOUS STATE */
          <>
            <button 
              onClick={onOpenAuth}
              className="text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full p-2 transition-all"
            >
              <User className="w-5 h-5 stroke-[2]" />
            </button>
            <button 
              onClick={onOpenAuth}
              className="bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-300 border border-blue-500/20"
            >
              Mulai Sekarang
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
