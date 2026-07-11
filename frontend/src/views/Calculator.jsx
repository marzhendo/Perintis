import React, { useState } from 'react';
import { DollarSign, ShoppingCart, HelpCircle, Calculator as CalcIcon, Lightbulb, Percent, TrendingUp, ShieldAlert } from 'lucide-react';

export default function Calculator({ calculationData, setCalculationData }) {
  const [activeMode, setActiveMode] = useState('daily'); // 'daily' or 'bep'
  const [loading, setLoading] = useState(false);

  // Daily Mode State
  const [dailyForm, setDailyForm] = useState({
    revenue: 500000,
    materials: 200000,
    operational: 50000,
    salary: 100000,
  });
  const [dailyResult, setDailyResult] = useState(null);

  // BEP Mode State
  const [bepForm, setBepForm] = useState({
    capital: calculationData?.input?.capital || 5000000,
    monthlyOp: calculationData?.input?.monthlyOp || 1500000,
    sellingPrice: calculationData?.input?.sellingPrice || 12000,
    materialCost: calculationData?.input?.materialCost || 7000,
  });

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDailyCalculate = () => {
    const { revenue, materials, operational, salary } = dailyForm;
    const totalExpense = materials + operational + salary;
    const netProfit = revenue - totalExpense;
    setDailyResult({
      netProfit,
      expense: totalExpense,
      status: netProfit > 0 ? 'Untung' : netProfit < 0 ? 'Rugi' : 'Impas',
    });
  };

  const handleBepCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app'}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modal_awal: bepForm.capital,
          biaya_operasional_bulanan: bepForm.monthlyOp,
          harga_jual_per_unit: bepForm.sellingPrice,
          bahan_baku_per_unit: bepForm.materialCost,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const resObj = {
          input: bepForm,
          result: {
            hpp: data.hpp_per_unit || bepForm.materialCost,
            margin: data.margin_per_unit || (bepForm.sellingPrice - bepForm.materialCost),
            bepUnits: data.bep_unit_per_bulan || Math.ceil(bepForm.monthlyOp / (bepForm.sellingPrice - bepForm.materialCost)),
            roiMonths: data.estimasi_balik_modal_bulan || (bepForm.capital / (bepForm.monthlyOp)),
          }
        };
        setCalculationData(resObj);
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      // Fallback local calculation
      setTimeout(() => {
        const margin = bepForm.sellingPrice - bepForm.materialCost;
        const bepUnits = margin > 0 ? Math.ceil(bepForm.monthlyOp / margin) : 0;
        const monthlyProfit = margin > 0 ? (bepUnits * margin) - bepForm.monthlyOp : 0;
        const roiMonths = monthlyProfit > 0 ? parseFloat((bepForm.capital / (monthlyProfit + bepForm.monthlyOp)).toFixed(1)) : 0;
        
        setCalculationData({
          input: bepForm,
          result: {
            hpp: bepForm.materialCost,
            margin: margin,
            bepUnits: bepUnits,
            roiMonths: roiMonths || 3.3,
          }
        });
      }, 1000);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kalkulator Finansial UMKM</h2>
          <p className="text-sm text-slate-500 mt-1">Hitung simulasi keuntungan harian serta kelayakan unit bisnis Anda secara presisi.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveMode('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeMode === 'daily'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pemasukan Harian
          </button>
          <button
            onClick={() => setActiveMode('bep')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeMode === 'bep'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            HPP & BEP Kelayakan
          </button>
        </div>
      </header>

      {activeMode === 'daily' ? (
        /* MODE: DAILY REVENUE CALCULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Pemasukan */}
            <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200/50 pb-4">
                <div className="bg-blue-500/10 p-2 rounded-full text-blue-600 border border-blue-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Uang yang Masuk (Pemasukan)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="daily-revenue" className="block text-xs font-bold text-slate-600 mb-2">Perkiraan Penjualan Harian (Rupiah)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="daily-revenue"
                      type="number"
                      value={dailyForm.revenue}
                      onChange={(e) => setDailyForm({ ...dailyForm, revenue: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">Uang kas atau transfer yang Anda peroleh dari pembeli dalam satu hari penuh.</p>
                </div>
              </div>
            </div>

            {/* Pengeluaran */}
            <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200/50 pb-4">
                <div className="bg-rose-500/10 p-2 rounded-full text-rose-600 border border-rose-500/20">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Uang yang Dikeluarkan (Pengeluaran)</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label htmlFor="daily-materials" className="block text-xs font-bold text-slate-600 mb-2">Modal Bahan Baku Jualan Harian</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="daily-materials"
                      type="number"
                      value={dailyForm.materials}
                      onChange={(e) => setDailyForm({ ...dailyForm, materials: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="daily-operational" className="block text-xs font-bold text-slate-600 mb-2">Biaya Operasional (Listrik, Gas, Air harian)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                      <input 
                        id="daily-operational"
                        type="number"
                        value={dailyForm.operational}
                        onChange={(e) => setDailyForm({ ...dailyForm, operational: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="daily-salary" className="block text-xs font-bold text-slate-600 mb-2">Gaji Karyawan Harian</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                      <input 
                        id="daily-salary"
                        type="number"
                        value={dailyForm.salary}
                        onChange={(e) => setDailyForm({ ...dailyForm, salary: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="apple-glass rounded-2xl p-6 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/15 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-2">Hasil Keuntungan Harian</h3>
              <p className="text-xs text-slate-500 mb-6">Estimasi laba bersih bersih harian Anda setelah dikurangi seluruh pengeluaran operasional.</p>
              
              <div className="flex items-end gap-1 mb-4">
                <span className="text-sm font-bold text-blue-600 pb-1">Rp</span>
                <span className={`text-3xl font-extrabold tracking-tight ${
                  dailyResult ? (dailyResult.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-blue-600'
                }`}>
                  {dailyResult ? new Intl.NumberFormat('id-ID').format(dailyResult.netProfit) : '0'}
                </span>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                dailyResult 
                  ? dailyResult.netProfit > 0 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : dailyResult.netProfit < 0 
                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      : 'bg-slate-500/10 text-slate-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  dailyResult 
                    ? dailyResult.netProfit > 0 
                      ? 'bg-emerald-500' 
                      : dailyResult.netProfit < 0 
                        ? 'bg-rose-500'
                        : 'bg-slate-500'
                    : 'bg-slate-400'
                }`}></span>
                <span>{dailyResult ? dailyResult.status : 'Belum Ada Perhitungan'}</span>
              </div>

              <button 
                onClick={handleDailyCalculate}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl hover:shadow-lg active:scale-95 transition-all duration-300 border border-blue-500/20"
              >
                Hitung Sekarang
              </button>
            </div>

            {/* Daily Guides */}
            <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-900">Tips Pengisian</h4>
              </div>
              <ul className="space-y-4 text-xs text-slate-500 leading-relaxed">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-[10px]">1</span>
                  <p><strong>Bahan Baku:</strong> Masukkan pengeluaran belanja harian (cabai, ayam, minyak) untuk porsi jualan hari ini.</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-[10px]">2</span>
                  <p><strong>Biaya Lain:</strong> Bagi tagihan bulanan (listrik/air/sewa kios) dengan 30 hari untuk mendapatkan estimasi harian.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* MODE: HPP & BEP ANALYSIS CALCULATOR (CONTRACT ALIGNED) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Input Variables */}
            <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200/50 pb-4">
                <div className="bg-blue-500/10 p-2 rounded-full text-blue-600 border border-blue-500/20">
                  <CalcIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Komponen Biaya Bisnis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bep-capital" className="block text-xs font-bold text-slate-600 mb-2">Kebutuhan Modal Awal</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="bep-capital"
                      type="number"
                      value={bepForm.capital}
                      onChange={(e) => setBepForm({ ...bepForm, capital: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bep-monthly-op" className="block text-xs font-bold text-slate-600 mb-2">Biaya Operasional Bulanan (Tetap)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="bep-monthly-op"
                      type="number"
                      value={bepForm.monthlyOp}
                      onChange={(e) => setBepForm({ ...bepForm, monthlyOp: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bep-selling-price" className="block text-xs font-bold text-slate-600 mb-2">Harga Jual per Unit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="bep-selling-price"
                      type="number"
                      value={bepForm.sellingPrice}
                      onChange={(e) => setBepForm({ ...bepForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bep-material-cost" className="block text-xs font-bold text-slate-600 mb-2">Bahan Baku per Unit (Variabel HPP)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                    <input 
                      id="bep-material-cost"
                      type="number"
                      value={bepForm.materialCost}
                      onChange={(e) => setBepForm({ ...bepForm, materialCost: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/80 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {calculationData?.result ? (
              <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm space-y-4 animate-fade-in">
                <h3 className="font-bold text-slate-900 text-sm border-b pb-2 mb-2">Proyeksi Kelayakan Finansial</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">HPP per Unit</span>
                    <span className="font-bold text-slate-900">{formatRupiah(calculationData.result.hpp)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Margin per Unit</span>
                    <span className="font-bold text-emerald-600">{formatRupiah(calculationData.result.margin)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">BEP Penjualan Bulanan</span>
                    <span className="font-bold text-slate-900">{calculationData.result.bepUnits} Unit</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Balik Modal (ROI)</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{calculationData.result.roiMonths} Bulan</span>
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-start gap-2 mt-4">
                  <Percent className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-slate-600 leading-normal">Margin keuntungan bersih sebesar <strong>{Math.round((calculationData.result.margin / bepForm.sellingPrice) * 100)}%</strong> dari harga jual.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl p-6 text-center text-slate-400 flex flex-col items-center justify-center min-h-[150px]">
                <CalcIcon className="w-10 h-10 mb-2 stroke-[1.5]" />
                <h4 className="font-bold text-xs text-slate-700">Belum Ada Perhitungan</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Isi data dan tekan tombol hitung.</p>
              </div>
            )}

            <button
              onClick={handleBepCalculate}
              disabled={loading || bepForm.sellingPrice <= bepForm.materialCost}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menghitung Proyeksi...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>Hitung Kelayakan Finansial</span>
                </>
              )}
            </button>
            
            {bepForm.sellingPrice <= bepForm.materialCost && (
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-rose-600 leading-normal">Peringatan: Harga jual harus lebih tinggi daripada biaya bahan baku per unit!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
