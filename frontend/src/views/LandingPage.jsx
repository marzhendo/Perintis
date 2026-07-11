import React from 'react';
import { ArrowRight, Brain, Calculator, Layers, MessageSquare, Sparkles } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="space-y-32 animate-fade-up">
      {/* Hero Section — Centered, Editorial */}
      <section className="max-w-4xl mx-auto text-center pt-16 md:pt-24">
        <div className="inline-flex items-center gap-2 bg-white/60 border border-[#E8E8E8] px-5 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-[#FF6B1A]" />
          <span className="text-xs font-semibold text-[#6F7178] uppercase tracking-wider">
            Platform Intelijensi UMKM
          </span>
        </div>

        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-[#171C38] leading-tight">
          Wujudkan Ide Bisnismu{' '}
          <span className="italic text-[#FF6B1A]">dengan Data</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[#6F7178] max-w-2xl mx-auto leading-relaxed">
          Perintis membantu Anda memvalidasi ide, simulasi finansial, dan
          pantau harga pangan dalam satu platform cerdas untuk wirausaha Indonesia.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('validator')}
            className="btn-primary text-base px-10 py-4 flex items-center gap-3 press"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className="bg-white text-[#171C38] font-semibold text-base px-10 py-4 rounded-[18px] border border-[#E8E8E8] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 press"
          >
            Pelajari Lebih Lanjut
          </button>
        </div>

        {/* Trust indicator */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[#6F7178]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Analisis AI Akurat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Data Pangan Terkini</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Gratis Selamanya</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#171C38]">
            Semua yang Anda Butuhkan{' '}
            <span className="italic text-[#FF6B1A]">dalam Satu Tempat</span>
          </h2>
          <p className="text-[#6F7178] max-w-xl mx-auto">
            Alat cerdas untuk merencanakan, memvalidasi, dan mengembangkan usaha
            mikro Anda.
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
                className="bg-white rounded-[20px] p-8 border border-[#E8E8E8] shadow-sm card-hover press"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B1A]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#FF6B1A]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#171C38] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6F7178] text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto text-center pb-16">
        <div className="bg-[#171C38] rounded-[32px] p-12 md:p-16 shadow-xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai{' '}
            <span className="italic text-[#FF6B1A]">Perjalanan Bisnismu?</span>
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto mb-8">
            Ribuan calon wirausaha telah menggunakan Perintis untuk memvalidasi ide mereka.
          </p>
          <button
            onClick={() => setActiveTab('validator')}
            className="btn-primary text-base px-10 py-4 press"
          >
            Validasi Ide Sekarang
          </button>
        </div>
      </section>
    </div>
  );
}
