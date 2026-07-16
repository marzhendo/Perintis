import React from 'react';
import { DollarSign, ShoppingCart, Lightbulb } from 'lucide-react';

function RupiahInput({ id, label, value, onChange, description }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-[#6F7178] mb-2">{label}</label>
      <div className="relative press-sm">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7178] font-semibold text-sm">Rp</span>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            let val = e.target.value;
            if (val.length > 12) val = val.slice(0, 12);
            onChange(parseFloat(val) || 0);
          }}
          className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold text-[#171C38] transition-all focus-ring"
        />
      </div>
      {description && <p className="text-[10px] text-[#6F7178] mt-1 leading-normal font-medium">{description}</p>}
    </div>
  );
}

export default function DailyCalcForm({ form, setForm, result, onCalculate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="glass-card rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[#FF6B1A]/10 pb-4">
            <div className="bg-[#FF6B1A]/10 p-2 rounded-full text-[#FF6B1A] border border-[#FF6B1A]/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#171C38]">Uang yang Masuk (Pemasukan)</h3>
          </div>
          <div className="space-y-4">
            <RupiahInput
              id="daily-revenue"
              label="Perkiraan Penjualan Harian (Rupiah)"
              value={form.revenue}
              onChange={(v) => setForm({ ...form, revenue: v })}
              description="Uang kas atau transfer yang Anda peroleh dari pembeli dalam satu hari penuh."
            />
          </div>
        </div>

        <div className="glass-card rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[#FF6B1A]/10 pb-4">
            <div className="bg-rose-500/10 p-2 rounded-full text-rose-400 border border-rose-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#171C38]">Uang yang Dikeluarkan (Pengeluaran)</h3>
          </div>
          <div className="space-y-5">
            <RupiahInput
              id="daily-materials"
              label="Modal Bahan Baku Jualan Harian"
              value={form.materials}
              onChange={(v) => setForm({ ...form, materials: v })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RupiahInput
                id="daily-operational"
                label="Biaya Operasional (Listrik, Gas, Air harian)"
                value={form.operational}
                onChange={(v) => setForm({ ...form, operational: v })}
              />
              <RupiahInput
                id="daily-salary"
                label="Gaji Karyawan Harian"
                value={form.salary}
                onChange={(v) => setForm({ ...form, salary: v })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-card rounded-[20px] p-6 shadow-lg shadow-orange-500/5">
          <h3 className="font-bold text-[#171C38] text-base mb-2">Hasil Keuntungan Harian</h3>
          <p className="text-xs text-[#6F7178] mb-6">Estimasi laba bersih bersih harian Anda setelah dikurangi seluruh pengeluaran operasional.</p>

          <div className="flex items-end gap-1 mb-4">
            <span className="text-sm font-bold text-[#FF6B1A] pb-1">Rp</span>
            <span className={`text-3xl font-extrabold tracking-tight ${
              result ? (result.netProfit >= 0 ? 'text-[#FF6B1A] text-glow-orange' : 'text-rose-400') : 'text-[#FF6B1A]'
            }`}>
              {result ? new Intl.NumberFormat('id-ID').format(result.netProfit) : '0'}
            </span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            result
              ? result.netProfit > 0
                ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 shadow-[0_0_8px_rgba(0,242,254,0.1)]'
                : result.netProfit < 0
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-slate-700 text-[#6F7178]'
              : 'bg-[#171C38]/5 text-[#6F7178] border border-[#E8E8E8]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              result
                ? result.netProfit > 0 ? 'bg-[#FF6B1A] shadow-[0_0_6px_#FF6B1A]' : result.netProfit < 0 ? 'bg-rose-500' : 'bg-slate-400'
                : 'bg-slate-400'
            }`} />
            <span>{result ? result.status : 'Belum Ada Perhitungan'}</span>
          </div>

          <button onClick={onCalculate} className="w-full mt-6 cyber-btn text-sm py-3.5 rounded-xl">
            Hitung Sekarang
          </button>
        </div>

        <div className="glass-card rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#FF6B1A] animate-pulse" />
            <h4 className="font-bold text-sm text-[#171C38]">Tips Pengisian</h4>
          </div>
          <ul className="space-y-4 text-xs text-[#6F7178] leading-relaxed">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 flex items-center justify-center font-bold text-[10px]">1</span>
              <p><strong>Bahan Baku:</strong> Masukkan pengeluaran belanja harian (cabai, ayam, minyak) untuk porsi jualan hari ini.</p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 flex items-center justify-center font-bold text-[10px]">2</span>
              <p><strong>Biaya Lain:</strong> Bagi tagihan bulanan (listrik/air/sewa kios) dengan 30 hari untuk mendapatkan estimasi harian.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
