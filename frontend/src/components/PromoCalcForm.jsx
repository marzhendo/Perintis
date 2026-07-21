import React, { useState } from 'react';
import { Percent, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle, Award, Plus, Trash2 } from 'lucide-react';

export default function PromoCalcForm() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item A', price: '15000', cost: '8000' },
    { id: 2, name: 'Item B', price: '12000', cost: '6000' },
  ]);
  const [bundlePrice, setBundlePrice] = useState('22000');
  const [showResults, setShowResults] = useState(false);
  const [showPromoTooltip, setShowPromoTooltip] = useState(false);

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

  const handleParamChange = (setter, val) => {
    if (val.length > 12) {
      val = val.slice(0, 12);
    }
    setter(val);
    setShowResults(false);
  };

  const handleItemChange = (index, field, value) => {
    if (value.length > 12) value = value.slice(0, 12);
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    setShowResults(false);
  };

  const addItem = () => {
    const nextLetter = String.fromCharCode(65 + items.length); // A, B, C, D...
    const name = `Item ${nextLetter}`;
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: nextId, name, price: '0', cost: '0' }]);
    setShowResults(false);
  };

  const removeItem = (id) => {
    if (items.length <= 2) return; // Keep at least 2 items
    const filtered = items.filter(item => item.id !== id);
    const updated = filtered.map((item, index) => {
      const letter = String.fromCharCode(65 + index);
      return { ...item, name: `Item ${letter}` };
    });
    setItems(updated);
    setShowResults(false);
  };

  const bP = parseNumber(bundlePrice);
  const normalTotalJual = items.reduce((acc, item) => acc + parseNumber(item.price), 0);
  const totalCost = items.reduce((acc, item) => acc + parseNumber(item.cost), 0);
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

            {/* Dynamic Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className={`space-y-3 ${index > 0 ? 'border-t border-[#E8E8E8] pt-4' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#FF6B1A]">{item.name}</span>
                    {items.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                        title={`Hapus ${item.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#171C38]">Harga Jual {item.name} (Rp)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#171C38]">HPP / Modal {item.name} (Rp)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#FF6B1A]/30 text-[#FF6B1A] hover:bg-[#FF6B1A]/5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer mt-2 animate-pulse-soft"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item Bundling</span>
            </button>

            {/* Proposed Bundle Price */}
            <div className="space-y-1.5 border-t border-[#E8E8E8] pt-4">
              <label className="block text-xs font-bold text-[#171C38] flex items-center gap-1.5 relative">
                <span>Rencana Harga Jual Bundling / Paket Combo (Rp)</span>
                <button
                  type="button"
                  onClick={() => setShowPromoTooltip(!showPromoTooltip)}
                  onBlur={() => setTimeout(() => setShowPromoTooltip(false), 200)}
                  className="text-[#6F7178] hover:text-[#FF6B1A] transition-colors focus:outline-none cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                {showPromoTooltip && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-[#171C38] text-white text-[10px] font-semibold rounded-xl shadow-xl z-50 animate-fade-in leading-relaxed normal-case">
                    <div className="absolute left-4 bottom-[-4px] w-2 h-2 bg-[#171C38] rotate-45" />
                    Harga promo gabungan seluruh item saat dijual bersamaan sebagai satu paket bundling.
                  </div>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={bundlePrice}
                  onChange={(e) => handleParamChange(setBundlePrice, e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={() => setShowResults(true)}
              className="w-full bg-[#FF6B1A] hover:bg-[#FF8A3D] text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 press shadow-md hover:shadow-lg mt-4 cursor-pointer"
            >
              <Percent className="w-4 h-4" />
              <span>Hitung Analisis Promo</span>
            </button>

          </div>
        </div>

        {/* Right Side: Simulation Results & Alerts */}
        <div className="lg:col-span-5 space-y-6 w-full">
          {!showResults ? (
            <div className="glass-card rounded-[20px] p-8 text-center border border-[#E8E8E8] flex flex-col items-center justify-center min-h-[300px] text-[#6F7178] space-y-3">
              <Award className="w-12 h-12 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.1)]" />
              <h4 className="font-bold text-sm text-[#171C38]">Hasil Analisis Promo</h4>
              <p className="text-xs text-[#6F7178] font-semibold max-w-xs leading-relaxed">
                Silakan isi data harga jual dan modal produk Anda pada formulir di sebelah kiri dan klik tombol <b>Hitung Analisis Promo</b> untuk melihat hasil analisis profitabilitas.
              </p>
            </div>
          ) : (
            <div className={`glass-card rounded-[20px] p-6 space-y-5 shadow-lg border-l-4 ${statusColor} animate-slide-in`}>
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
          )}
        </div>
      </div>
    </div>
  );
}
