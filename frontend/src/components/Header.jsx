import React from 'react';
import { Bell } from 'lucide-react';
import logo from '../assets/images/Perintis.svg';
import ProfileMenu from './ProfileMenu';

export default function Header({ activeTab, setActiveTab, user, unreadCount, onOpenAuth, onLogout }) {
  const menuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'harga', label: 'Pantau Harga' },
    { id: 'lokasi', label: 'Peta Lokasi' },
    { id: 'validator', label: 'Cek Ide' },
    { id: 'calculator', label: 'Hitung Keuntungan' },
    { id: 'roi', label: 'Proyeksi ROI' },
    { id: 'forum', label: 'Forum' },
  ];

  return (
    <nav
      role="navigation"
      className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1100px] rounded-[30px] bg-[#171C38] shadow-xl z-50 justify-between items-center px-5 py-2.5 transition-all duration-300"
    >
      {/* Brand */}
      <div className="w-1/5">
        <button onClick={() => setActiveTab('home')} className="w-7 h-7 rounded-full overflow-hidden bg-white shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer">
          <img src={logo} alt="Perintis" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center flex-grow gap-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`font-semibold text-[10px] xl:text-xs whitespace-nowrap transition-all duration-300 px-2 xl:px-2.5 py-1.5 rounded-full active:scale-90 focus-ring ${
                isActive
                  ? 'text-white bg-white/10 border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right */}
      <div className="flex items-center justify-end w-1/5 gap-1 relative">
        <button
          onClick={() => setActiveTab('notifikasi')}
          className={`relative text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all ${activeTab === 'notifikasi' ? 'text-white bg-white/10' : ''}`}
          title="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          {user && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF6B1A] text-white text-[7px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-soft">
              {unreadCount}
            </span>
          )}
        </button>

        <ProfileMenu
          user={user}
          onLogout={onLogout}
          onOpenAuth={onOpenAuth}
          onNavigate={setActiveTab}
          unreadCount={unreadCount}
        />
      </div>
    </nav>
  );
}
