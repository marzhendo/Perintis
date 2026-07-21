import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Sparkles, Calculator, TrendingUp, Award, Send, Sun, Moon } from 'lucide-react';
import logo from '../assets/images/Perintis.svg';
import ProfileMenu from './ProfileMenu';

export default function Header({ activeTab, setActiveTab, user, unreadCount, onOpenAuth, onLogout, theme, toggleTheme }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mainMenuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'harga', label: 'Pantau Harga' },
    { id: 'lokasi', label: 'Peta Lokasi' },
  ];

  const toolsItems = [
    { id: 'validator', label: 'Cek Ide AI', icon: Sparkles, desc: 'Validasi kelayakan ide bisnis' },
    { id: 'calculator', label: 'Hitung Keuntungan', icon: Calculator, desc: 'Simulasi HPP, Harian, & BEP' },
    { id: 'roi', label: 'Proyeksi ROI', icon: TrendingUp, desc: 'Analisis modal & cash runway' },
    { id: 'legalitas', label: 'Ekspor & Sertifikasi', icon: Award, desc: 'Kuis ekspor & izin PIRT/Halal' },
    { id: 'marketing', label: 'AI Copywriter', icon: Send, desc: 'Generator iklan & kartu nama 3D' },
  ];

  const isToolActive = toolsItems.some(item => item.id === activeTab);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      role="navigation"
      className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1100px] rounded-[30px] bg-white/95 backdrop-blur-md border-2 border-[#171C38] shadow-xl z-50 justify-between items-center px-5 py-2 transition-all duration-300"
    >
      {/* Brand */}
      <div className="w-1/5">
        <button onClick={() => setActiveTab('home')} className="w-7 h-7 rounded-full overflow-hidden bg-white shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer">
          <img src={logo} alt="Perintis" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center flex-grow gap-1.5 relative">
        {mainMenuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setDropdownOpen(false);
              }}
              className={`font-bold text-[10px] xl:text-xs whitespace-nowrap transition-all duration-300 px-3.5 py-1.5 rounded-full active:scale-90 focus-ring cursor-pointer ${
                isActive
                  ? 'text-white bg-[#FF6B1A] border border-[#FF6B1A] shadow-[0_4px_12px_rgba(255,107,26,0.25)]'
                  : 'text-[#171C38] hover:text-[#FF6B1A] hover:bg-[#FF6B1A]/5 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* Alat Bisnis Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`font-bold text-[10px] xl:text-xs whitespace-nowrap transition-all duration-300 px-3.5 py-1.5 rounded-full active:scale-90 focus-ring cursor-pointer flex items-center gap-1 ${
              isToolActive || dropdownOpen
                ? 'text-white bg-[#FF6B1A] border border-[#FF6B1A] shadow-[0_4px_12px_rgba(255,107,26,0.25)]'
                : 'text-[#171C38] hover:text-[#FF6B1A] hover:bg-[#FF6B1A]/5 border border-transparent'
            }`}
          >
            <span>Alat Bisnis</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Box */}
          {dropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 border-2 border-[#171C38] rounded-2xl shadow-2xl p-2 z-50 animate-bounce-in space-y-1 text-left backdrop-blur-md">
              {toolsItems.map((tool) => {
                const ToolIcon = tool.icon;
                const isSelected = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTab(tool.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 text-left press-sm cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 text-[#FF6B1A]'
                        : 'hover:bg-slate-50 border border-transparent text-[#171C38]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#FF6B1A]/25' : 'bg-slate-100'}`}>
                      <ToolIcon className="w-4 h-4 text-[#FF6B1A]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold">{tool.label}</div>
                      <div className="text-[9px] text-[#6F7178] font-semibold mt-0.5 leading-tight">{tool.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Forum Tab */}
        <button
          onClick={() => {
            setActiveTab('forum');
            setDropdownOpen(false);
          }}
          className={`font-bold text-[10px] xl:text-xs whitespace-nowrap transition-all duration-300 px-3.5 py-1.5 rounded-full active:scale-90 focus-ring cursor-pointer ${
            activeTab === 'forum'
              ? 'text-white bg-[#FF6B1A] border border-[#FF6B1A] shadow-[0_4px_12px_rgba(255,107,26,0.25)]'
              : 'text-[#171C38] hover:text-[#FF6B1A] hover:bg-[#FF6B1A]/5 border border-transparent'
          }`}
        >
          Forum
        </button>

        {/* Blog Tab */}
        <button
          onClick={() => {
            setActiveTab('blog');
            setDropdownOpen(false);
          }}
          className={`font-bold text-[10px] xl:text-xs whitespace-nowrap transition-all duration-300 px-3.5 py-1.5 rounded-full active:scale-90 focus-ring cursor-pointer ${
            activeTab === 'blog'
              ? 'text-white bg-[#FF6B1A] border border-[#FF6B1A] shadow-[0_4px_12px_rgba(255,107,26,0.25)]'
              : 'text-[#171C38] hover:text-[#FF6B1A] hover:bg-[#FF6B1A]/5 border border-transparent'
          }`}
        >
          Blog
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end w-1/5 gap-1.5 relative">
        <button
          onClick={toggleTheme}
          className="text-[#171C38]/60 hover:text-[#171C38] hover:bg-[#171C38]/10 rounded-full p-1.5 transition-all cursor-pointer"
          title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          onClick={() => {
            setActiveTab('notifikasi');
            setDropdownOpen(false);
          }}
          className={`relative text-[#171C38]/60 hover:text-[#171C38] hover:bg-[#171C38]/10 rounded-full p-1.5 transition-all ${activeTab === 'notifikasi' ? 'text-[#171C38] bg-[#171C38]/10' : ''} cursor-pointer`}
          title="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          {user && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF6B1A] text-[#171C38] text-[7px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-soft">
              {unreadCount}
            </span>
          )}
        </button>

        <ProfileMenu
          user={user}
          onLogout={onLogout}
          onOpenAuth={onOpenAuth}
          onNavigate={(tab) => {
            setActiveTab(tab);
            setDropdownOpen(false);
          }}
          unreadCount={unreadCount}
        />
      </div>
    </nav>
  );
}
