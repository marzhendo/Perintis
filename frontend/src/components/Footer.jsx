import React from 'react';
import logo from '../assets/images/Perintis_OLD.svg';

export default function Footer({ setActiveTab }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200/50 bg-white/40 backdrop-blur-xl py-12 px-6 md:px-12 w-full text-slate-500 text-xs text-left">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10">
        
        {/* Column 1: Brand Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-0.5">
              <img src={logo} alt="Perintis Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Perintis
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 max-w-sm">
            Platform intelijen bisnis digital & simulasi finansial terintegrasi untuk calon pelaku usaha mikro, kecil, dan menengah di Indonesia. Bangun fondasi usahamu berbasis data.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Akses Navigasi</h4>
          <ul className="space-y-2 font-semibold">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-blue-600 transition-colors">
                Halaman Utama
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('harga')} className="hover:text-blue-600 transition-colors">
                Pantau Harga
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('guide')} className="hover:text-blue-600 transition-colors">
                Buku Panduan
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Features */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Fitur Analisis</h4>
          <ul className="space-y-2 font-semibold">
            <li>
              <button onClick={() => setActiveTab('validator')} className="hover:text-blue-600 transition-colors">
                Validasi Ide Bisnis AI
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('calculator')} className="hover:text-blue-600 transition-colors">
                Kalkulator BEP & HPP
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('forum')} className="hover:text-blue-600 transition-colors text-left">
                Forum Diskusi Terbuka
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-[1280px] mx-auto border-t border-slate-200/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-medium">
        <span>© {currentYear} Perintis. Dibuat dengan bangga untuk UMKM Indonesia.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600">Kebijakan Privasi</a>
          <a href="#" className="hover:text-slate-600">Ketentuan Layanan</a>
        </div>
      </div>
    </footer>
  );
}
