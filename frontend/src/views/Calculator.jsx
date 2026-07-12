import React, { useState } from 'react';
import { calculateBep, getFallbackResult } from '../services/calculatorApi';
import { useToast } from '../components/Toast';
import DailyCalcForm from '../components/DailyCalcForm';
import BepCalcForm from '../components/BepCalcForm';
import TaxZakatForm from '../components/TaxZakatForm';
import PromoCalcForm from '../components/PromoCalcForm';
import RecipeCostForm from '../components/RecipeCostForm';
import ProfitGoalForm from '../components/ProfitGoalForm';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(val);
};

export default function Calculator({ calculationData, setCalculationData }) {
  const [activeMode, setActiveMode] = useState('daily');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [dailyForm, setDailyForm] = useState({ revenue: 500000, materials: 200000, operational: 50000, salary: 100000 });
  const [dailyResult, setDailyResult] = useState(null);

  const [bepForm, setBepForm] = useState({
    capital: calculationData?.input?.capital || 5000000,
    monthlyOp: calculationData?.input?.monthlyOp || 1500000,
    sellingPrice: calculationData?.input?.sellingPrice || 12000,
    materialCost: calculationData?.input?.materialCost || 7000,
  });

  const handleDailyCalculate = () => {
    const { revenue, materials, operational, salary } = dailyForm;
    const totalExpense = materials + operational + salary;
    const netProfit = revenue - totalExpense;
    setDailyResult({
      netProfit, expense: totalExpense,
      status: netProfit > 0 ? 'Untung' : netProfit < 0 ? 'Rugi' : 'Impas',
    });
  };

  const handleBepCalculate = async () => {
    if (!bepForm.sellingPrice || !bepForm.materialCost) {
      toast.error('Mohon isi harga jual dan biaya bahan baku');
      return;
    }
    setLoading(true);
    try {
      const result = await calculateBep(bepForm);
      setCalculationData({ input: bepForm, result });
      toast.success('Hasil kalkulasi ROI sudah siap');
    } catch {
      const result = getFallbackResult(bepForm);
      setCalculationData({ input: bepForm, result });
      toast.info('Menampilkan hasil simulasi — server tidak merespon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Kalkulator Finansial UMKM</h2>
          <p className="text-sm text-[#6F7178] mt-1">Hitung simulasi keuntungan harian serta kelayakan unit bisnis Anda secara presisi.</p>
        </div>
        <div className="flex bg-[#171C38]/5 p-1 rounded-2xl border border-[#E8E8E8] shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveMode('daily')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'daily'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Pemasukan Harian
          </button>
          <button
            onClick={() => setActiveMode('bep')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'bep'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            HPP & BEP Kelayakan
          </button>
          <button
            onClick={() => setActiveMode('taxzakat')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'taxzakat'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Pajak & Zakat
          </button>
          <button
            onClick={() => setActiveMode('promo')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'promo'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Paket Promo
          </button>
          <button
            onClick={() => setActiveMode('resep')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'resep'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            HPP Resep
          </button>
          <button
            onClick={() => setActiveMode('targetprofit')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press whitespace-nowrap ${
              activeMode === 'targetprofit'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Target Profit
          </button>
        </div>
      </header>

      {activeMode === 'daily' ? (
        <DailyCalcForm form={dailyForm} setForm={setDailyForm} result={dailyResult} onCalculate={handleDailyCalculate} />
      ) : activeMode === 'bep' ? (
        <BepCalcForm bepForm={bepForm} setBepForm={setBepForm} result={calculationData?.result} loading={loading} formatRupiah={formatRupiah} onCalculate={handleBepCalculate} />
      ) : activeMode === 'taxzakat' ? (
        <TaxZakatForm />
      ) : activeMode === 'promo' ? (
        <PromoCalcForm />
      ) : activeMode === 'resep' ? (
        <RecipeCostForm />
      ) : (
        <ProfitGoalForm />
      )}
    </div>
  );
}
