import React, { useState } from 'react';
import { Target, TrendingUp, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ProfitGoalForm() {
  const [targetProfit, setTargetProfit] = useState('5000000');
  const [price, setPrice] = useState('15000');
  const [cost, setCost] = useState('8000');
  const [fixedCost, setFixedCost] = useState('2000000');

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

  const target = parseNumber(targetProfit);
  const p = parseNumber(price);
  const c = parseNumber(cost);
  const fc = parseNumber(fixedCost);

  const marginPerUnit = p - c;
  const totalNeededGross = target + fc;
  const unitsPerMonth = marginPerUnit > 0 ? Math.ceil(totalNeededGross / marginPerUnit) : 0;
  const unitsPerDay = Math.ceil(unitsPerMonth / 30);
  const monthlyRevenue = unitsPerMonth * p;
  const grossMarginPercent = p > 0 ? Math.round((marginPerUnit / p) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Input Fields */}
        <div className="lg:col-span-7 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8] w-full">
            <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex justify-between items-center">
              <span>Rencana Target Profit Bulanan</span>
              <Target className="w-4 h-4 text-[#FF6B1A]" />
            </h3>

            {/* Target Profit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171C38]">Berapa Target Laba Bersih Bulanan yang Anda Inginkan? (Rp)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-[#171C38]"
                />
              </div>
            </div>

            {/* Price & HPP */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#E8E8E8] pt-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Harga Jual Per Unit (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Biaya Bahan Baku / HPP (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Fixed Costs */}
            <div className="space-y-1.5 border-t border-[#E8E8E8] pt-4">
              <label className="block text-xs font-bold text-[#171C38]">Biaya Operasional Tetap Bulanan (Sewa, Gaji, Listrik, dll) (Rp)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={fixedCost}
                  onChange={(e) => setFixedCost(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Output Analysis */}
        <div className="lg:col-span-5 space-y-6 w-full">
          {marginPerUnit <= 0 ? (
            <div className="glass-card rounded-[20px] p-6 border-l-4 border-l-rose-500 shadow-lg space-y-3">
              <div className="flex gap-2 items-center text-rose-500 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-xs uppercase tracking-wider">Kesalahan Margin</h4>
              </div>
              <p className="text-xs text-[#6F7178] leading-relaxed font-semibold">Harga jual target ({formatRupiah(p)}) harus lebih besar dari biaya modal bahan baku ({formatRupiah(c)}) agar bisa menghitung target penjualan. Naikkan harga jual produk Anda.</p>
            </div>
          ) : (
            <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border-l-4 border-l-[#FF6B1A] text-left">
              <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3">
                <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider font-sans">Simulasi Keberhasilan Target</h4>
                <span className="text-[10px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/5 border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">AI Calculated</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-[#6F7178] uppercase">Target Jual Per Hari</span>
                  <p className="text-3xl font-extrabold text-[#171C38] tracking-tight">{unitsPerDay} Porsi / Hari</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#E8E8E8] pt-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#6F7178] uppercase">Target Jual Bulanan</span>
                    <p className="text-sm font-extrabold text-[#171C38]">{unitsPerMonth} Porsi</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#6F7178] uppercase">Omzet Pendapatan Bulanan</span>
                    <p className="text-sm font-extrabold text-[#FF6B1A]">{formatRupiah(monthlyRevenue)}</p>
                  </div>
                </div>

                <div className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-3 flex gap-2.5 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold text-[#171C38]">Saran Operasional & Pemasaran</h5>
                    <p className="text-[9px] text-[#6F7178] leading-relaxed font-semibold">
                      Untuk meraih profit bersih {formatRupiah(target)}/bln, Anda harus menjual minimal {unitsPerDay} porsi/hari. Alokasikan sekitar {formatRupiah(monthlyRevenue * 0.05)} (5% dari omzet) untuk iklan lokal per bulan demi mendorong pencapaian transaksi harian.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
