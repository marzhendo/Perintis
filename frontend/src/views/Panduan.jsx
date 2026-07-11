import React from 'react';
import { BookOpen, Shield, HelpCircle, Layers, CheckCircle } from 'lucide-react';

export default function Panduan() {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">Panduan Penggunaan Perintis</h2>
        <p className="text-sm text-slate-500 mt-1">Panduan operasional dan rujukan teknis arsitektur decoupled platform Perintis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Accordion/Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Pendahuluan */}
          <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>1. Pendahuluan & Lingkup Produk</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) dan Deskripsi Perancangan Perangkat Lunak (DPPL) menetapkan Perintis sebagai platform digital pendukung calon pelaku UMKM. 
              Fitur utamanya meliputi pencarian ide bisnis dengan kecerdasan buatan, validasi kelayakan ide (Validator), dashboard harga komoditas pokok riil, serta simulasi matematika finansial (BEP, HPP, ROI).
            </p>
          </div>

          {/* Arsitektur */}
          <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>2. Arsitektur Decoupled Teknologi</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
              <p>Platform dikembangkan dengan memisahkan Frontend dan Backend secara modular:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/40 p-4 rounded-xl border border-white/50">
                  <h4 className="font-bold text-slate-800 mb-1">Frontend (React Vite)</h4>
                  <p className="text-[11px] text-slate-500">Membangun antarmuka yang responsif, ter-compile cepat menggunakan Vite, styling menggunakan Tailwind CSS v4, dan dideploy pada Firebase Hosting statik.</p>
                </div>
                <div className="bg-white/40 p-4 rounded-xl border border-white/50">
                  <h4 className="font-bold text-slate-800 mb-1">Backend (FastAPI Python)</h4>
                  <p className="text-[11px] text-slate-500">REST API berkecepatan tinggi yang menangani komputasi keuangan dan integrasi aman dengan kecerdasan buatan. Dideploy di Koyeb atau Render.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>3. Panduan Fitur Finansial</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-700">Rumus Kalkulator Finansial Core:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>HPP (Harga Pokok Penjualan):</strong> Seluruh biaya bahan baku langsung yang dibutuhkan untuk membuat satu unit barang dagangan.</li>
                <li><strong>Margin per Unit:</strong> Harga Jual dikurangi HPP per Unit.</li>
                <li><strong>BEP Bulanan (Unit):</strong> Biaya Tetap Operasional Bulanan dibagi Margin per Unit.</li>
                <li><strong>Estimasi ROI (Bulan):</strong> Kebutuhan Modal Awal dibagi laba bersih per bulan.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Security & Best Practices */}
        <div className="lg:col-span-4 space-y-6">
          <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm bg-blue-500/5">
            <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" />
              <span>Best Practices Keamanan</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p><strong>Strict CORS:</strong> Pastikan backend membatasi asal domain (CORS) hanya untuk Firebase Hosting domain Anda.</p>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p><strong>Secrets (.env):</strong> API Key layanan AI rahasia harus disimpan di server-side backend, jangan pernah diekspos di frontend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
