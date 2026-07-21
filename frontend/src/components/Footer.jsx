import React from 'react';
import logo from '../assets/images/Perintis.svg';

export default function Footer({ setActiveTab }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF6EE]/90 backdrop-blur-md rounded-t-3xl border-t border-[#FF6B1A]/20 pt-12 pb-8 px-6 md:px-12 w-full shadow-[0_-4px_30px_rgba(23,28,56,0.05)] relative z-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10">

        {/* Column 1: Brand Info */}
        <div className="md:col-span-5 space-y-4">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 hover:opacity-80 active:scale-95 transition-all press">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm">
              <img src={logo} alt="Perintis" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-[#171C38] text-glow-orange">
              Perintis
            </span>
          </button>
          <p className="text-xs leading-relaxed text-[#171C38]/70 max-w-sm">
            Platform intelijen bisnis digital & simulasi finansial terintegrasi untuk calon pelaku usaha mikro, kecil, dan menengah di Indonesia. Bangun fondasi usahamu berbasis data.
          </p>
        </div>

        {/* Column 2: Navigasi */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-[#FF6B1A] text-[10px] uppercase tracking-wider">Navigasi</h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={() => setActiveTab('home')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Halaman Utama
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('harga')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Pantau Harga
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('lokasi')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Peta Lokasi
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('guide')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Panduan
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('blog')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Blog UMKM
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('notifikasi')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Notifikasi
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Fitur */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-[#FF6B1A] text-[10px] uppercase tracking-wider">Fitur</h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={() => setActiveTab('validator')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium text-left press">
                Validasi Ide Bisnis AI
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('calculator')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium press">
                Kalkulator BEP & HPP
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('legalitas')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium text-left press">
                Legalitas & Ekspor
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('marketing')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium text-left press">
                AI Copywriter Pemasaran
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('forum')} className="text-[#171C38]/70 hover:text-[#FF6B1A] transition-colors text-xs font-medium text-left press">
                Forum Diskusi Terbuka
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-[1200px] mx-auto border-t border-[#E8E8E8] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#171C38]/60 font-medium">
        <span>© {currentYear} Perintis. Dibuat dengan bangga untuk UMKM Indonesia.</span>
        <div className="flex gap-6">
          <button onClick={() => setActiveTab('privacy')} className="hover:text-[#FF6B1A] transition-colors press-sm">Kebijakan Privasi</button>
          <button onClick={() => setActiveTab('terms')} className="hover:text-[#FF6B1A] transition-colors press-sm">Ketentuan Layanan</button>
        </div>
      </div>
    </footer>
  );
}
