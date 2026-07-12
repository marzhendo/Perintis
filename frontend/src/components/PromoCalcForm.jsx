import React, { useState } from 'react';
import { Percent, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

export default function PromoCalcForm() {
  const [priceA, setPriceA] = useState('15000');
  const [costA, setCostA] = useState('8000');
  const [priceB, setPriceB] = useState('12000');
  const [costB, setCostB] = useState('6000');
  const [bundlePrice, setBundlePrice] = useState('22000');

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

  const pA = parseNumber(priceA);
  const cA = parseNumber(costA);
  const pB = parseNumber(priceB);
  const cB = parseNumber(costB);
  const bP = parseNumber(bundlePrice);

  const normalTotalJual = pA + pB;
  const totalCost = cA + cB;
  const discountNominal = normalTotalJual - bP;
  const discountPercent = normalTotalJual > 0 ? Math.max(0, Math.round((discountNominal / normalTotalJual) * 100)) : 0;
  const profitNominal = bP - totalCost;
  const profitMargin = bP > 0 ? Math.round((profitNominal / bP) * 100) : 0;

  // Recommendations and status check
  let statusColor = 'border-l-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
  let alertIcon = CheckCircle2;
  let statusTitle = 'Margin Aman & Sehat';
  let statusDesc = `Paket bundling Anda menghasilkan margin keuntungan bersih sebesar ${profitMargin}% (${formatRupiah(profitNominal)} per penjualan). Penjualan ini dinilai sangat aman dilakukan.`;

  if (bP < totalCost) {
    statusColor = 'border-l-rose-500';
    badgeColor = 'bg-rose-50 text-rose-600 border-rose-100';
    alertIcon = ShieldAlert;
    statusTitle = 'Bahaya! Menjual Rugi';
    statusDesc = `Harga paket bundling (${formatRupiah(bP)}) berada DI BAWAH total biaya modal/HPP (${formatRupiah(totalCost)}). Anda akan mengalami kerugian sebesar ${formatRupiah(Math.abs(profitNominal))} di setiap penjualan!`;
  } else if (profitMargin < 15) {
    statusColor = 'border-l-amber-500';
    badgeColor = 'bg-amber-50 text-amber-600 border-amber-100';
    alertIcon = AlertTriangle;
    statusTitle = 'Margin Terlalu Tipis';
    statusDesc = `Margin keuntungan bersih hanya ${profitMargin}% (${formatRupiah(profitNominal)}). Disarankan menaikkan harga bundling minimal ke ${formatRupiah(totalCost * 1.2)} untuk menjaga kelangsungan arus kas.`;
  }

  const AlertIconComponent = alertIcon;

  return (
    <div className="space-y-6 animate-fade-in w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Side: Calculations Inputs */}
        <div className="lg:col-span-7 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg">
            <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex justify-between items-center">
              <span>Simulasi Harga Bundling / Promo</span>
              <Percent className="w-4 h-4 text-[#FF6B1A]" />
            </h3>

            {/* Item A */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Harga Jual Item A (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={priceA}
                    onChange={(e) => setPriceA(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">HPP / Modal Item A (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={costA}
                    onChange={(e) => setCostA(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Item B */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#E8E8E8] pt-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Harga Jual Item B (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={priceB}
                    onChange={(e) => setPriceB(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">HPP / Modal Item B (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={costB}
                    onChange={(e) => setCostB(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Proposed Bundle Price */}
            <div className="space-y-1.5 border-t border-[#E8E8E8] pt-4">
              <label className="block text-xs font-bold text-[#171C38] flex items-center gap-1.5">
                <span>Rencana Harga Jual Bundling / Paket Combo (Rp)</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#6F7178]" title="Harga promo gabungan kedua item saat dijual bersamaan." />
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Simulation Results & Alerts */}
        <div className="lg:col-span-5 space-y-6 w-full">
          <div className={`glass-card rounded-[20px] p-6 space-y-5 shadow-lg border-l-4 ${statusColor}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider">Hasil Analisis Promo</h4>
              <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                {statusTitle}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-[#6F7178] uppercase">Total Modal (HPP)</span>
                <p className="text-lg font-bold text-[#171C38]">{formatRupiah(totalCost)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-[#6F7178] uppercase">Total Jual Normal</span>
                <p className="text-lg font-bold text-[#171C38]">{formatRupiah(normalTotalJual)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-[#6F7178] uppercase">Besar Diskon</span>
                <p className="text-lg font-bold text-[#FF6B1A]">
                  {formatRupiah(discountNominal)} ({discountPercent}%)
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-[#6F7178] uppercase">Margin Keuntungan</span>
                <p className={`text-lg font-bold ${profitNominal >= 0 ? 'text-[#171C38]' : 'text-rose-500'}`}>
                  {profitMargin}%
                </p>
              </div>
            </div>

            <div className="bg-[#171C38]/5 rounded-xl p-3 flex gap-2.5 items-start">
              <AlertIconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: bP < totalCost ? '#f43f5e' : profitMargin < 15 ? '#fbbf24' : '#10b981' }} />
              <p className="text-[11px] text-[#6F7178] font-semibold leading-relaxed">{statusDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
