import React from 'react';
import { Shield, Layers, CheckCircle, Sparkles, Calculator, MessageSquare, TrendingUp } from 'lucide-react';

export default function Panduan() {
  return (
    <div className="space-y-8 animate-fade-in text-left w-full relative z-10">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight font-sans">Panduan Memulai Bisnis Bersama Perintis</h2>
        <p className="text-sm text-[#6F7178] mt-1 font-semibold">Pelajari langkah-langkah praktis menggunakan platform Perintis untuk meminimalkan risiko dan memaksimalkan keuntungan usaha Anda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left Side: Step-by-Step Practical Guide */}
        <div className="lg:col-span-8 space-y-6 w-full">
          
          {/* Langkah 1 */}
          <div className="glass-card rounded-[20px] p-6 space-y-3 shadow-lg shadow-orange-500/5">
            <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <Sparkles className="w-5 h-5 text-[#FF6B1A]" />
              <span>Langkah 1: Validasi Kelayakan Ide Bisnis (Cek Ide)</span>
            </h3>
            <p className="text-xs text-[#6F7178] leading-relaxed font-medium">
              Buka menu <strong>Cek Ide</strong> untuk menguji potensi bisnis Anda. Masukkan nama, deskripsi ide produk, target pasar, serta perkiraan modal awal Anda. Kecerdasan buatan (AI) kami akan mengevaluasi tingkat kelayakan usaha Anda, memetakan potensi risiko operasional, menilai kepadatan kompetitor, serta memberikan saran pembeda (*unique selling points*) agar produk Anda lebih menonjol di pasar.
            </p>
          </div>

          {/* Langkah 2 */}
          <div className="glass-card rounded-[20px] p-6 space-y-3 shadow-lg shadow-orange-500/5">
            <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <Layers className="w-5 h-5 text-[#FF6B1A]" />
              <span>Langkah 2: Estimasi Harga Bahan Baku (Pantau Harga)</span>
            </h3>
            <p className="text-xs text-[#6F7178] leading-relaxed font-medium">
              Sebelum berbelanja bahan produksi, gunakan menu <strong>Pantau Harga</strong> untuk memantau fluktuasi harga komoditas pangan nasional terkini (seperti beras, cabai rawit, daging ayam, dll). Informasi tren harga ini sangat krusial untuk memperkirakan biaya belanja produksi harian Anda agar tidak melebihi anggaran modal.
            </p>
          </div>

          {/* Langkah 3 */}
          <div className="glass-card rounded-[20px] p-6 space-y-3 shadow-lg shadow-orange-500/5">
            <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <Calculator className="w-5 h-5 text-[#FF6B1A]" />
              <span>Langkah 3: Hitung HPP, Margin, & BEP (Kalkulator)</span>
            </h3>
            <p className="text-xs text-[#6F7178] leading-relaxed font-medium">
              Di menu <strong>Hitung Keuntungan</strong>, lakukan simulasi keuangan dengan dua cara:
            </p>
            <ul className="list-disc pl-5 text-xs text-[#6F7178] space-y-2 font-medium">
              <li><strong>Pemasukan Harian:</strong> Masukkan omzet harian dikurangi belanja bahan dan biaya operasional untuk mengetahui apakah usaha harian Anda untung atau rugi.</li>
              <li><strong>HPP & BEP Kelayakan:</strong> Masukkan modal awal, biaya tetap bulanan, harga jual per unit, dan biaya bahan baku per porsi untuk mengetahui Harga Pokok Penjualan (HPP), persentase margin keuntungan bersih, serta jumlah porsi minimal yang wajib terjual dalam sebulan agar tidak merugi.</li>
            </ul>
          </div>

          {/* Langkah 4 */}
          <div className="glass-card rounded-[20px] p-6 space-y-3 shadow-lg shadow-orange-500/5">
            <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <TrendingUp className="w-5 h-5 text-[#FF6B1A]" />
              <span>Langkah 4: Tinjau Waktu Balik Modal (Proyeksi ROI)</span>
            </h3>
            <p className="text-xs text-[#6F7178] leading-relaxed font-medium">
              Gunakan grafik di halaman <strong>Proyeksi ROI</strong> untuk memvisualisasikan perpotongan antara akumulasi pendapatan dan biaya usaha Anda dari waktu ke waktu. Bandingkan skenario optimis dan skenario pesimis untuk menentukan berapa bulan cadangan modal darurat operasional yang wajib Anda siapkan.
            </p>
          </div>

          {/* Langkah 5 */}
          <div className="glass-card rounded-[20px] p-6 space-y-3 shadow-lg shadow-orange-500/5">
            <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans">
              <MessageSquare className="w-5 h-5 text-[#FF6B1A]" />
              <span>Langkah 5: Diskusi Bersama Komunitas (Forum Terbuka)</span>
            </h3>
            <p className="text-xs text-[#6F7178] leading-relaxed font-medium">
              Jangan ragu untuk berdiskusi dengan sesama pengusaha di menu <strong>Forum</strong>. Bagikan tantangan operasional Anda, tanyakan alternatif pemasok bahan baku pangan murah, atau mintalah saran manajemen modal dari wirausaha lain yang lebih berpengalaman.
            </p>
          </div>

        </div>

        {/* Right Side: Golden Business Rules for Founders */}
        <div className="lg:col-span-4 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 bg-[#FF6B1A]/5 border border-[#FF6B1A]/20 text-left w-full shadow-lg shadow-[#FF6B1A]/2">
            <h3 className="text-sm font-bold text-[#FF6B1A] flex items-center gap-2 mb-4 text-glow-orange font-sans">
              <Shield className="w-4 h-4" />
              <span>Aturan Emas Memulai Bisnis</span>
            </h3>
            <div className="space-y-4 text-xs text-[#6F7178] leading-relaxed font-semibold">
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p><strong>Cadangkan Modal Darurat:</strong> Selalu siapkan dana operasional ekstra senilai minimal 3 bulan biaya operasional tetap untuk mengantisipasi masa sepi pembeli awal.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p><strong>Uji Coba Skala Kecil (MVP):</strong> Hindari menyewa kios besar di awal. Jual produk secara pre-order atau melalu pesan antar digital untuk menguji respon pasar.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p><strong>Pisahkan Uang Pribadi:</strong> Jangan satukan rekening bisnis dengan rekening kebutuhan pribadi untuk mempermudah audit arus kas bulanan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
