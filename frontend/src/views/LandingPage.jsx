import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, Calculator, Layers, MessageSquare, Sparkles, CheckCircle2, ShieldCheck, ChevronRight, HelpCircle, MessageCircle, Play, X, User } from 'lucide-react';

const MOCK_NOTIFS = [
  { name: 'Fatir G.', action: 'baru saja memvalidasi ide', detail: 'Kedai Kopi' },
  { name: 'Siti R.', action: 'baru saja menghitung BEP', detail: 'Warung Geprek' },
  { name: 'Budi S.', action: 'baru saja memantau harga', detail: 'Beras Premium' },
  { name: 'Rico W.', action: 'baru saja memulai diskusi', detail: 'Pinjaman Modal' },
  { name: 'Dewi A.', action: 'baru saja memvalidasi ide', detail: 'Jasa Desain' },
];

export default function LandingPage({ setActiveTab }) {
  const [notifIndex, setNotifIndex] = useState(0);
  const [showNotif, setShowNotif] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotif(false);
      setTimeout(() => {
        setNotifIndex((prev) => (prev + 1) % MOCK_NOTIFS.length);
        setShowNotif(true);
      }, 500); // fade out transition delay
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentNotif = MOCK_NOTIFS[notifIndex];

  return (
    <div className="space-y-32 animate-fade-in relative z-10 w-full pb-20">
      
      {/* Hero Section — Centered, Inspired by dicoding.com/asah */}
      <section className="max-w-5xl mx-auto text-center pt-12 md:pt-20 px-4">
        
        {/* Social Proof Badge / Overlapping Avatars */}
        <div className="inline-flex items-center gap-3 bg-[#171C38]/5 border border-[#E8E8E8] px-4 py-2 rounded-full mb-8 animate-float">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B1A] to-[#FF8A3D] border border-[#171C38] flex items-center justify-center text-[8px] font-bold text-[#171C38]">UM</div>
            <div className="w-6 h-6 rounded-full bg-[#FF6B1A] border border-[#171C38] flex items-center justify-center text-[8px] font-bold text-[#171C38]">AI</div>
            <div className="w-6 h-6 rounded-full bg-[#FAF6EE] border border-[#171C38] flex items-center justify-center text-[8px] font-bold text-[#171C38]">KD</div>
          </div>
          <span className="text-[11px] font-bold text-[#171C38]/85 tracking-wide">
            Ribuan calon wirausaha telah memvalidasi ide bisnis di sini
          </span>
        </div>

        {/* Heading — Mixed Serif Italic & Sans Bold */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#171C38] leading-tight font-sans tracking-tight max-w-4xl mx-auto">
          <span className="italic font-heading text-[#FF6B1A] font-medium mr-2 text-glow-orange">Rintis</span>
          Usaha Impianmu <br className="hidden sm:inline" />
          Raih <span className="italic font-heading text-[#FF6B1A] font-medium ml-1 text-glow-orange">Sukses Keuangan</span>
        </h1>

        <p className="mt-8 text-base md:text-lg text-[#6F7178] max-w-2xl mx-auto leading-relaxed font-medium">
          Belajar langsung dari analisis cerdas AI untuk kuasai <strong>HPP</strong>, <strong>BEP</strong>, dan <strong>Proyeksi ROI</strong>. Validasi kelayakan usahamu dengan data pangan terintegrasi agar siap tempur di pasar nyata!
        </p>

        {/* Buttons / CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('validator')}
            className="cyber-btn text-sm px-10 py-4 flex items-center gap-3 press rounded-[18px]"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className="bg-[#171C38]/5 text-[#171C38] font-bold text-sm px-10 py-4 rounded-[18px] border border-[#171C38]/15 shadow-sm hover:bg-[#FF6B1A]/5 hover:border-[#FF6B1A]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 press cursor-pointer"
          >
            Pelajari Panduan
          </button>
        </div>

        {/* Illustration Sketch / Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-3xl mx-auto bg-[#171C38]/5 rounded-3xl p-4 border border-[#E8E8E8] shadow-2xl shadow-orange-500/5 group hover:border-[#FF6B1A]/20 transition-all duration-500">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#F8ECD2]/5 rounded-full blur-3xl -z-10" />
          <div className="w-full h-64 md:h-96 rounded-2xl bg-[#171C38] border border-[#E8E8E8] overflow-hidden flex flex-col relative">
            
            {/* Mock Dashboard Topbar */}
            <div className="h-10 bg-[#171C38]/5 border-b border-[#E8E8E8] px-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]/10" />
              <div className="h-4 w-40 bg-[#171C38]/5 rounded-md ml-4 border border-[#E8E8E8]" />
            </div>

            {/* Custom Interactive Vector Illustration */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
              <svg className="w-full h-full max-w-md text-[#6F7178] stroke-current opacity-80" fill="none" viewBox="0 0 400 200">
                {/* Grid */}
                <path d="M 0,20 L 400,20 M 0,60 L 400,60 M 0,100 L 400,100 M 0,140 L 400,140" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 40,0 L 40,200 M 120,0 L 120,200 M 200,0 L 200,200 M 280,0 L 280,200 M 360,0 L 360,200" strokeWidth="0.5" strokeDasharray="3 3" />
                
                {/* Graph lines */}
                <path d="M 40,160 Q 120,120 200,140 T 280,70 T 360,40" stroke="#FF6B1A" strokeWidth="3" className="drop-shadow-[0_0_8px_#FF6B1A]" />
                <path d="M 40,180 Q 120,150 200,100 T 280,90 T 360,20" stroke="#F8ECD2" strokeWidth="2" strokeDasharray="5 5" />
                
                {/* Node Points */}
                <circle cx="280" cy="70" r="5" fill="#FF6B1A" className="animate-ping" />
                <circle cx="280" cy="70" r="5" fill="#FF6B1A" />
                <circle cx="200" cy="140" r="4" fill="#F8ECD2" />
                <circle cx="360" cy="40" r="6" fill="#FF6B1A" />

                {/* Annotation */}
                <rect x="250" y="25" width="80" height="30" rx="6" fill="rgba(23, 28, 56, 0.9)" stroke="rgba(255, 107, 26, 0.3)" />
                <text x="290" y="43" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">BEP: 3 Bulan</text>
              </svg>

              {/* Float Widget */}
              <div className="absolute bottom-6 right-6 bg-[#171C38]/5 border border-[#E8E8E8] backdrop-blur-md rounded-2xl p-4 text-left shadow-lg">
                <p className="text-[10px] font-bold text-[#6F7178] uppercase tracking-wider">AI RECOMMENDATION</p>
                <p className="text-xs font-bold text-[#FF6B1A] mt-1">Ide Bisnis Sangat Layak (Skor 87%)</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Detailed Description / Penjelasan Lengkap (User Request) */}
      <section className="max-w-5xl mx-auto px-4 space-y-16">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-3 py-1 rounded-full uppercase tracking-wider border border-[#FF6B1A]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tentang Perintis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171C38] leading-tight font-sans">
              Menghilangkan Keraguan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#FF8A3D] text-glow-orange">
                Sebelum Memulai Investasi
              </span>
            </h2>
            <div className="space-y-4 text-sm text-[#6F7178] leading-relaxed font-medium">
              <p>
                Banyak usaha mikro dan kecil (UMKM) di Indonesia yang terpaksa gulung tikar dalam 6 bulan pertama karena perencanaan keuangan yang tidak matang serta kegagalan dalam membaca kebutuhan pasar. 
              </p>
              <p>
                <strong>Perintis</strong> hadir sebagai jembatan analisis digital. Kami memanfaatkan kecerdasan buatan (AI) untuk membantu pelaku usaha melakukan uji kelayakan secara objektif. Menggunakan integrasi data komoditas pangan terkini, Anda bisa memproyeksikan HPP secara presisi, mendeteksi potensi risiko kompetisi, hingga memperkirakan waktu balik modal (*Break-Even Point*) secara riil.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-8 space-y-6 shadow-xl border-[#FF6B1A]/20">
              <h3 className="font-bold text-lg text-[#171C38] font-sans">3 Pilar Utama Perintis</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start text-left">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider">Validasi Ide Terpadu</h4>
                    <p className="text-xs text-[#6F7178] mt-1 font-medium">Evaluasi menyeluruh pasar sasaran, kelebihan kompetitif, dan model pendapatan.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start text-left">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider">Simulasi Anggaran Riil</h4>
                    <p className="text-xs text-[#6F7178] mt-1 font-medium">Penghitungan HPP, proyeksi profit bulanan, serta ROI dinamis untuk founder.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start text-left">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider">Basis Data Pangan</h4>
                    <p className="text-xs text-[#6F7178] mt-1 font-medium">Integrasi fluktuasi harga bahan mentah harian dari pasar produsen terpercaya.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cara Kerja: Interactive Step-by-Step */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#171C38] font-sans">Siklus Pengembangan Bisnis Bersama Perintis</h2>
            <p className="text-[#6F7178] text-sm max-w-xl mx-auto font-semibold">Gunakan alat analisis kami secara berurutan untuk meminimalisasi risiko kerugian modal awal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              { step: '01', title: 'Cek Ide AI', desc: 'Uji tingkat persaingan dan kelayakan konsep produk di pasaran.' },
              { step: '02', title: 'Analisis Bahan', desc: 'Pantau harga pokok bahan mentah dari menu Pantau Harga.' },
              { step: '03', title: 'Simulasi HPP & BEP', desc: 'Input modal dan margin untuk mendapatkan harga jual ideal.' },
              { step: '04', title: 'Forum Komunitas', desc: 'Tanyakan kendala usahamu ke ribuan founder berpengalaman.' },
            ].map((s, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 relative border-[#E8E8E8] hover:border-[#FF6B1A]/20 transition-all duration-300 shadow-md">
                <span className="absolute right-4 top-4 font-mono font-black text-3xl text-[#6F7178]/20">{s.step}</span>
                <h4 className="text-sm font-bold text-[#FF6B1A] uppercase tracking-wider mb-2 font-sans">{s.title}</h4>
                <p className="text-xs text-[#6F7178] leading-relaxed font-semibold">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Features Grid Section */}
      <section className="max-w-5xl mx-auto space-y-12 px-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#171C38] font-sans">
            Semua yang Anda Butuhkan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#FF8A3D] text-glow-orange font-bold">
              dalam Satu Tempat
            </span>
          </h2>
          <p className="text-[#6F7178] max-w-xl mx-auto font-semibold">
            Alat cerdas untuk merencanakan, memvalidasi, dan mengembangkan usaha mikro Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'Validasi Ide Bisnis AI',
              desc: 'Dapatkan skor kelayakan, analisis pasar, dan saran diferensiasi untuk ide usaha Anda.',
            },
            {
              icon: Calculator,
              title: 'Simulasi Finansial Presisi',
              desc: 'Hitung HPP, BEP, margin, dan proyeksi ROI dengan visualisasi interaktif.',
            },
            {
              icon: Layers,
              title: 'Pantau Harga Bahan Pokok',
              desc: 'Akses harga komoditas pangan terkini untuk estimasi biaya produksi harian.',
            },
            {
              icon: MessageSquare,
              title: 'Forum Diskusi Terbuka',
              desc: 'Berbagi ide dan solusi bersama komunitas wirausaha yang suportif.',
            },
            {
              icon: Sparkles,
              title: 'Panduan Bisnis Lengkap',
              desc: 'Langkah demi langkah memulai dan mengelola bisnis dari nol.',
            },
            {
              icon: Brain,
              title: 'Proyeksi ROI & BEP',
              desc: 'Visualisasikan kapan bisnis Anda balik modal dengan grafik interaktif.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-[20px] p-8 card-hover press"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 flex items-center justify-center mb-5 shadow-[0_0_10px_rgba(255,107,26,0.1)]">
                  <Icon className="w-6 h-6 text-[#FF6B1A]" />
                </div>
                <h3 className="text-xl font-bold text-[#171C38] mb-3 font-sans">
                  {feature.title}
                </h3>
                <p className="text-[#6F7178] text-sm leading-relaxed font-semibold">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto text-center pb-16 px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-12 md:p-16 border border-[#FF6B1A]/20 shadow-[0_0_30px_rgba(255,107,26,0.1)]">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#171C38] mb-4 font-sans">
            Siap Memulai{' '}
            <span className="text-[#FF6B1A] text-glow-orange font-bold">
              Perjalanan Bisnismu?
            </span>
          </h2>
          <p className="text-[#6F7178] text-base max-w-lg mx-auto mb-8 font-semibold">
            Ribuan calon wirausaha telah menggunakan Perintis untuk memvalidasi ide mereka.
          </p>
          <button
            onClick={() => setActiveTab('validator')}
            className="cyber-btn text-base px-10 py-4 press rounded-[18px]"
          >
            Validasi Ide Sekarang
          </button>
        </div>
      </section>

      {/* REAL-TIME NOTIFICATION POPUP (Bottom-Left) — Inspired by dicoding.com/asah */}
      {showNotif && currentNotif && (
        <div className="fixed bottom-6 left-6 z-50 max-w-xs bg-[#FAF6EE]/95 backdrop-blur-md border border-[#FF6B1A]/30 rounded-2xl p-4 shadow-2xl shadow-orange-500/10 flex items-center gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 flex items-center justify-center flex-shrink-0 text-[#FF6B1A]">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#171C38] truncate">{currentNotif.name}</p>
            <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">{currentNotif.action} <span className="text-[#FF6B1A] font-bold">{currentNotif.detail}</span></p>
          </div>
          <button onClick={() => setShowNotif(false)} className="text-[#6F7178] hover:text-[#171C38] p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WHATSAPP SUPPORT WIDGET (Bottom-Right) — Inspired by dicoding.com/asah */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {chatOpen && (
          <div className="bg-[#FAF6EE]/95 backdrop-blur-md border border-[#FF6B1A]/30 rounded-2xl p-4 shadow-2xl max-w-xs text-left animate-scale-in mb-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-xs text-[#171C38]">Hubungi Kami</h4>
              <button onClick={() => setChatOpen(false)} className="text-[#6F7178] hover:text-[#171C38]">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-[#6F7178] font-semibold leading-relaxed">
              Punya pertanyaan seputar cara menghitung BEP, validasi AI, atau kendala teknis? Silakan hubungi kami via WhatsApp.
            </p>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors w-full justify-center"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat WhatsApp
            </a>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 rounded-full bg-emerald-500 text-[#171C38] flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-transform"
          title="Punya Pertanyaan?"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
