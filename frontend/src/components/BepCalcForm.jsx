import React from 'react';
import { Calculator as CalcIcon, Percent, TrendingUp, ShieldAlert } from 'lucide-react';

function RupiahInput({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-[#6F7178] mb-2">{label}</label>
      <div className="relative press-sm">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7178] font-semibold text-sm">Rp</span>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
        />
      </div>
    </div>
  );
}

export default function BepCalcForm({ bepForm, setBepForm, result, loading, formatRupiah, onCalculate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="glass-card rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[#FF6B1A]/10 pb-4">
            <div className="bg-[#FF6B1A]/10 p-2 rounded-full text-[#FF6B1A] border border-[#FF6B1A]/20">
              <CalcIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#171C38]">Komponen Biaya Bisnis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RupiahInput id="bep-capital" label="Kebutuhan Modal Awal" value={bepForm.capital} onChange={(v) => setBepForm({ ...bepForm, capital: v })} />
            <RupiahInput id="bep-monthly-op" label="Biaya Operasional Bulanan (Tetap)" value={bepForm.monthlyOp} onChange={(v) => setBepForm({ ...bepForm, monthlyOp: v })} />
            <RupiahInput id="bep-selling-price" label="Harga Jual per Unit" value={bepForm.sellingPrice} onChange={(v) => setBepForm({ ...bepForm, sellingPrice: v })} />
            <RupiahInput id="bep-material-cost" label="Bahan Baku per Unit (Variabel HPP)" value={bepForm.materialCost} onChange={(v) => setBepForm({ ...bepForm, materialCost: v })} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        {result ? (
          <div className="glass-card rounded-[20px] p-6 space-y-4 animate-fade-in shadow-lg shadow-orange-500/5">
            <h3 className="font-bold text-[#171C38] text-sm border-b border-orange-500/15 pb-2 mb-2">Proyeksi Kelayakan Finansial</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F7178] font-medium">HPP per Unit</span>
                <span className="font-bold text-[#171C38]">{formatRupiah(result.hpp)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F7178] font-medium">Margin per Unit</span>
                <span className="font-bold text-[#FF6B1A] text-glow-orange">{formatRupiah(result.margin)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F7178] font-medium">BEP Penjualan Bulanan</span>
                <span className="font-bold text-[#171C38]">{result.bepUnits} Unit</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6F7178] font-medium">Balik Modal (ROI)</span>
                <span className="font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full border border-[#FF6B1A]/20 shadow-[0_0_8px_rgba(255,107,26,0.1)]">{result.roiMonths} Bulan</span>
              </div>
            </div>
            <div className="bg-[#FF6B1A]/5 border border-[#FF6B1A]/10 rounded-xl p-3 flex items-start gap-2 mt-4">
              <Percent className="w-4 h-4 text-[#FF6B1A] mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-[#6F7178] leading-normal font-medium">Margin keuntungan bersih sebesar <strong>{Math.round((result.margin / bepForm.sellingPrice) * 100)}%</strong> dari harga jual.</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl p-6 text-center text-[#6F7178] flex flex-col items-center justify-center min-h-[150px]">
            <CalcIcon className="w-10 h-10 mb-2 stroke-[1.5] text-[#6F7178]" />
            <h4 className="font-bold text-xs text-[#171C38]">Belum Ada Perhitungan</h4>
            <p className="text-[10px] text-[#6F7178] mt-0.5 font-medium">Isi data dan tekan tombol hitung.</p>
          </div>
        )}

        <button
          onClick={onCalculate}
          disabled={loading || bepForm.sellingPrice <= bepForm.materialCost}
          className="w-full cyber-btn text-sm py-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 rounded-xl"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#050714] border-t-transparent rounded-full animate-spin" />
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
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-rose-400 leading-normal font-semibold">Peringatan: Harga jual harus lebih tinggi daripada biaya bahan baku per unit!</p>
          </div>
        )}
      </div>
    </div>
  );
}
