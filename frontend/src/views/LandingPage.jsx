import React from 'react';
import { Rocket, ArrowRight, Sparkles, Store, CheckCircle, TrendingUp, Cpu, Database } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full w-max">
            <Rocket className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Platform Intelligence UMKM</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Validasi Ide Bisnis &<br />
            <span className="text-gradient">Simulasi Finansial UMKM</span>
          </h1>
          
          <p className="text-base text-slate-600 max-w-xl leading-relaxed">
            Ambil keputusan bisnis berbasis data. Analisis potensi pasar, kelayakan finansial, dan proyeksi ROI untuk usaha Anda dengan akurasi tinggi didukung kecerdasan buatan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('validator')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-0.5"
            >
              <span>Validasi Ide Bisnis</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setActiveTab('calculator')}
              className="apple-glass hover:bg-white text-slate-800 font-semibold text-sm px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Simulasi Finansial</span>
            </button>
          </div>
        </div>
        
        {/* Right: Glass Card Preview */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl rounded-full transform scale-110 -z-10"></div>
          
          <div className="apple-glass rounded-3xl p-8 shadow-2xl border border-white/60 w-full max-w-md transform hover:rotate-0 transition-transform duration-500 ease-out">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-base">Kedai Kopi Susu</h3>
                  <p className="text-xs text-slate-500">Analisis Wilayah Jakarta Selatan</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Layak</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/40 rounded-2xl p-4 border border-white/50 text-left">
                <p className="text-xs text-slate-500 mb-1">ROI Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">4.8</span>
                  <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                </div>
              </div>
              <div className="bg-white/40 rounded-2xl p-4 border border-white/50 text-left">
                <p className="text-xs text-slate-500 mb-1">BEP Estimasi</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">8</span>
                  <span className="text-xs text-slate-400 font-medium">Bulan</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Probabilitas Sukses</span>
                <span className="text-blue-600 font-bold">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Arsitektur Modern & Performa Tinggi</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Dibangun dengan teknologi terdepan untuk memastikan analisis yang cepat, akurat, dan aman bagi bisnis Anda.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Item 1 */}
          <div className="apple-glass rounded-3xl p-6 md:p-8 md:col-span-2 text-left flex items-start gap-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0 text-blue-600">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Decoupled FastAPI & React</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Pemisahan backend (FastAPI) dan frontend (React Vite) memastikan pemrosesan data instan. FastAPI menangani logika finansial berat dan integrasi AI, sementara React menyajikan visualisasi UI yang mulus, stabil, dan responsif.
              </p>
            </div>
          </div>
          
          {/* Bento Item 2 */}
          <div className="apple-glass rounded-3xl p-6 md:p-8 text-left flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Real-time</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Platform mengintegrasikan referensi harga pangan nasional untuk mendukung keputusan pengadaan bahan baku yang akurat dan up-to-date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
