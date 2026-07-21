import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Award, ArrowRight, HelpCircle, CheckCircle2, Printer } from 'lucide-react';

const GOLD_PRICE_PER_GRAM = 1400000; // Harga emas standar per gram dalam Rupiah
const NISAB_GOLD_GRAMS = 85;
const ANNUAL_NISAB = NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM; // Rp 119,000,000

export default function TaxZakatForm() {
  const [isWpOp, setIsWpOp] = useState(true); // Wajib Pajak Orang Pribadi
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [assets, setAssets] = useState('');
  const [liabilities, setLiabilities] = useState('');
  const [annualRevenueEstimate, setAnnualRevenueEstimate] = useState('0'); // Estimasi Omzet Setahun untuk threshold Rp 500 juta
  const [showResults, setShowResults] = useState(false);
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);

  const handleParamChange = (setter, value) => {
    // Batasi input maksimal 12 digit (999 Miliar Rupiah) untuk mencegah layout pecah/overflow
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    setter(value);
    setShowResults(false);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const parseNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const revenue = parseNumber(monthlyRevenue);
  const currentAssets = parseNumber(assets);
  const currentLiabilities = parseNumber(liabilities);
  const estAnnual = parseNumber(annualRevenueEstimate);

  // Pajak Calculation (PPh Final UMKM 0.5% PP 23/2018 & UU HPP)
  let monthlyTax = 0;
  let taxNote = '';
  if (isWpOp) {
    if (estAnnual <= 500000000) {
      monthlyTax = 0;
      taxNote = 'Bebas Pajak (Omzet setahun Anda di bawah Rp 500 Juta, sesuai UU HPP untuk WP Orang Pribadi).';
    } else {
      // Hitung proporsi pajak jika omzet tahunan melebihi 500jt
      // Sederhananya, jika omzet tahunan di atas 500jt, bagian di atas 500jt dikenakan PPh Final 0.5%
      const excess = estAnnual - 500000000;
      const proportion = excess / estAnnual;
      monthlyTax = revenue * proportion * 0.005;
      taxNote = `Dikenai PPh Final 0.5% hanya pada omzet yang melebihi batas Rp 500 Juta/tahun.`;
    }
  } else {
    monthlyTax = revenue * 0.005;
    taxNote = 'Dikenai PPh Final 0.5% secara langsung (Berlaku untuk Wajib Pajak Badan/CV/PT).';
  }

  // Zakat Perniagaan Calculation (Zakat Niaga 2.5%)
  const netAssets = currentAssets - currentLiabilities;
  const isEligibleZakat = netAssets >= ANNUAL_NISAB;
  const annualZakat = isEligibleZakat ? netAssets * 0.025 : 0;
  const monthlyZakat = annualZakat / 12;

  return (
    <div className="space-y-6 animate-fade-in w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Side: Calculations Inputs */}
        <div className="lg:col-span-7 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg">
            <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3">Parameter Simulasi</h3>
            
            {/* Tipe Wajib Pajak */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#171C38]">Kategori Wajib Pajak</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleParamChange(setIsWpOp, true)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all press-sm border ${
                    isWpOp
                      ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] border-[#FF6B1A]'
                      : 'bg-white border-[#E8E8E8] text-[#6F7178] hover:bg-slate-50'
                  }`}
                >
                  Orang Pribadi (Perorangan)
                </button>
                <button
                  type="button"
                  onClick={() => handleParamChange(setIsWpOp, false)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all press-sm border ${
                    !isWpOp
                      ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] border-[#FF6B1A]'
                      : 'bg-white border-[#E8E8E8] text-[#6F7178] hover:bg-slate-50'
                  }`}
                >
                  Badan (CV, PT, Koperasi)
                </button>
              </div>
            </div>

            {/* Input Omzet Bulanan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171C38]">Omzet Pendapatan Bulanan (Rp)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  placeholder="Contoh: 15000000"
                  value={monthlyRevenue}
                  onChange={(e) => handleParamChange(setMonthlyRevenue, e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
                />
              </div>
            </div>

            {/* Input Estimasi Omzet Tahunan (Hanya jika WP OP) */}
            {isWpOp && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="block text-xs font-bold text-[#171C38] flex items-center gap-1.5 relative">
                  <span>Proyeksi Omzet Setahun (Rp)</span>
                  <button
                    type="button"
                    onClick={() => setShowTaxTooltip(!showTaxTooltip)}
                    onBlur={() => setTimeout(() => setShowTaxTooltip(false), 200)}
                    className="text-[#6F7178] hover:text-[#FF6B1A] transition-colors focus:outline-none cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                  {showTaxTooltip && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-[#171C38] text-white text-[10px] font-semibold rounded-xl shadow-xl z-50 animate-fade-in leading-relaxed normal-case">
                      <div className="absolute left-4 bottom-[-4px] w-2 h-2 bg-[#171C38] rotate-45" />
                      Digunakan untuk mengukur batas bebas pajak Rp 500 Juta setahun bagi wajib pajak orang pribadi (WP OP) UMKM.
                    </div>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    placeholder="Contoh: 120000000 (120 Juta)"
                    value={annualRevenueEstimate}
                    onChange={(e) => handleParamChange(setAnnualRevenueEstimate, e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
            )}

            <div className="border-t border-[#E8E8E8] pt-4 grid grid-cols-2 gap-4">
              {/* Input Aset Lancar Niaga */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Aset Lancar Niaga (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    placeholder="Kas + Stok barang"
                    value={assets}
                    onChange={(e) => handleParamChange(setAssets, e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>

              {/* Input Utang Lancar Dagang */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Utang Jatuh Tempo (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    placeholder="Utang bahan baku"
                    value={liabilities}
                    onChange={(e) => handleParamChange(setLiabilities, e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Action Button: Calculate */}
            <button
              onClick={() => setShowResults(true)}
              className="w-full bg-[#FF6B1A] hover:bg-[#FF8A3D] text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 press shadow-md hover:shadow-lg mt-4"
            >
              <DollarSign className="w-4 h-4" />
              <span>Hitung Pajak & Zakat</span>
            </button>

          </div>
        </div>

        {/* Right Side: Calculation Results & Edu Badges */}
        <div className="lg:col-span-5 space-y-6 w-full">
          
          {!showResults ? (
            <div className="glass-card rounded-[20px] p-8 text-center border border-[#E8E8E8] flex flex-col items-center justify-center min-h-[300px] text-[#6F7178] space-y-3">
              <Award className="w-12 h-12 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.1)]" />
              <h4 className="font-bold text-sm text-[#171C38]">Hasil Simulasi</h4>
              <p className="text-xs text-[#6F7178] font-semibold max-w-xs leading-relaxed">
                Silakan isi data keuangan usaha Anda pada formulir di sebelah kiri dan klik tombol <b>Hitung Pajak & Zakat</b> untuk memproses hasil kalkulasi.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-in">
              {/* Result Card: Pajak */}
              <div className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg border-l-4 border-l-[#FF6B1A]">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#FF6B1A] uppercase tracking-wider">Pajak UMKM PPh Final</h4>
                  <span className="text-[10px] font-bold text-[#171C38] bg-white border border-[#E8E8E8] px-2 py-0.5 rounded-full">PP 23/2018</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#6F7178] uppercase">Estimasi Pajak Bulanan</span>
                  <p className="text-3xl font-extrabold text-[#171C38] tracking-tight">{formatRupiah(monthlyTax)}</p>
                </div>

                <div className="bg-[#171C38]/5 rounded-xl p-3 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#6F7178] font-semibold leading-relaxed">{taxNote}</p>
                </div>
              </div>

              {/* Result Card: Zakat */}
              <div className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase tracking-wider">Zakat Perniagaan (Maal)</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Nisab: 85g Emas</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#6F7178] uppercase">Estimasi Zakat Bulanan</span>
                  <p className="text-3xl font-extrabold text-[#171C38] tracking-tight">
                    {isEligibleZakat ? formatRupiah(monthlyZakat) : 'Belum Wajib'}
                  </p>
                </div>

                <div className="bg-[#171C38]/5 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <ShieldAlert className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isEligibleZakat ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <p className="text-[11px] text-[#6F7178] font-semibold leading-relaxed">
                      {isEligibleZakat 
                        ? `Aset bersih perniagaan Anda (${formatRupiah(netAssets)}) telah mencapai batas nisab minimal setahun (${formatRupiah(ANNUAL_NISAB)}).`
                        : `Aset bersih perniagaan Anda (${formatRupiah(netAssets)}) belum mencapai batas nisab minimal setahun (${formatRupiah(ANNUAL_NISAB)}).`
                      }
                    </p>
                  </div>
                  <p className="text-[9px] text-[#6F7178] border-t border-[#E8E8E8] pt-2 font-medium">
                    *Simulasi menggunakan estimasi harga emas Rp {formatRupiah(GOLD_PRICE_PER_GRAM)}/gram. Zakat ditunaikan setahun sekali sebesar 2.5% dari sisa aset lancar dikurangi utang.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
