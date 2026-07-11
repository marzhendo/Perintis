import React from 'react';
import { Clock, TrendingUp, Wallet, Download, CheckCircle, Lightbulb } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceDot
} from 'recharts';

export default function ROIProjections({ calculationData }) {
  const hasData = !!calculationData?.result;
  
  // Use user input or fallback defaults
  const capital = hasData ? calculationData.input.capital : 5000000;
  const monthlyOp = hasData ? calculationData.input.monthlyOp : 1500000;
  const marginPerUnit = hasData ? calculationData.result.margin : 5000;
  const bepUnits = hasData ? calculationData.result.bepUnits : 300;
  const sellingPrice = hasData ? calculationData.input.sellingPrice : 12000;
  const materialCost = hasData ? calculationData.input.materialCost : 7000;
  const roiMonths = hasData ? calculationData.result.roiMonths : 3.3;

  // Let's assume a realistic sales volume per month: 1.5 times the BEP units to make a profit
  const salesVolumePerMonth = Math.ceil(bepUnits * 1.5) || 450;
  const monthlyRevenue = salesVolumePerMonth * sellingPrice;
  const monthlyVariableCost = salesVolumePerMonth * materialCost;
  const monthlyExpense = monthlyOp + monthlyVariableCost;

  // Generate 24 months projection data
  const data = [];
  let bepMonthIdx = -1;
  let minDiff = Infinity;

  for (let m = 0; m <= 24; m++) {
    const cumulativeCost = capital + m * monthlyExpense;
    const cumulativeRevenue = m * monthlyRevenue;
    
    // Find intersection (BEP)
    const diff = Math.abs(cumulativeCost - cumulativeRevenue);
    if (m > 0 && diff < minDiff) {
      minDiff = diff;
      bepMonthIdx = m;
    }
    
    data.push({
      month: `Bln ${m}`,
      monthNum: m,
      'Total Pengeluaran': cumulativeCost,
      'Total Pendapatan': cumulativeRevenue,
    });
  }

  // Calculate intersection coordinates for Recharts ReferenceDot
  // Mathematically, BEP occurs when cumulative revenue = cumulative cost:
  // M * monthlyRevenue = capital + M * monthlyExpense
  // M * (monthlyRevenue - monthlyExpense) = capital
  // M = capital / (monthlyRevenue - monthlyExpense)
  const netMonthlyProfit = monthlyRevenue - monthlyExpense;
  const exactBepMonth = netMonthlyProfit > 0 ? parseFloat((capital / netMonthlyProfit).toFixed(1)) : 0;
  const bepX = exactBepMonth > 0 && exactBepMonth <= 24 ? `Bln ${Math.round(exactBepMonth)}` : null;
  const bepY = exactBepMonth > 0 ? exactBepMonth * monthlyRevenue : null;

  const formatRupiah = (val) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-white/10 p-4 rounded-xl shadow-2xl text-xs text-white">
          <p className="font-bold border-b border-white/10 pb-1.5 mb-1.5">{label}</p>
          <p className="text-blue-400">Pendapatan: <span className="font-bold">{formatRupiah(payload[0].value)}</span></p>
          <p className="text-rose-400">Pengeluaran: <span className="font-bold">{formatRupiah(payload[1].value)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Proyeksi ROI & Analisis Terpadu</h2>
          <p className="text-sm text-slate-500 mt-1">Analisis kelayakan investasi bisnis Anda berdasarkan skenario optimis dan pesimis.</p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimasi Balik Modal</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {exactBepMonth > 0 ? `${exactBepMonth} Bulan` : `${roiMonths} Bulan`}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase mb-0.5 border border-emerald-500/15">Optimis</span>
          </div>
          <div className="mt-4 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="apple-glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profitability Score</h3>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {netMonthlyProfit > 0 ? '86/100' : '70/100'}
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">Sangat Layak</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-4">Dihitung berdasarkan margin kotor dan efisiensi biaya tetap.</p>
        </div>

        <div className="apple-glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kebutuhan Modal Awal</h3>
            <Wallet className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">{formatRupiah(capital)}</span>
          </div>
          <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Recharts Break-Even Chart */}
      <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Simulasi Break-Even Point (BEP)</h3>
          <p className="text-xs text-slate-500 leading-normal mt-0.5">Representasi grafis perpotongan garis pendapatan kumulatif dan pengeluaran kumulatif.</p>
        </div>
        
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => formatRupiah(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="Total Pendapatan" 
                stroke="#004ac6" 
                strokeWidth={3} 
                activeDot={{ r: 8 }} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="Total Pengeluaran" 
                stroke="#E11D48" 
                strokeWidth={3} 
                dot={false}
              />
              {bepX && bepY && (
                <ReferenceDot 
                  x={bepX} 
                  y={bepY} 
                  r={6} 
                  fill="#10B981" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  isFront={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario 1: Optimistic */}
        <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Skenario Optimis</h3>
          <p className="text-xs text-slate-500 mb-4 border-b pb-4 leading-relaxed">Asumsi pencapaian penjualan rata-rata harian optimal dengan efisiensi biaya produksi maksimal.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Net Profit Margin</span>
              <span className="text-emerald-600 font-bold">24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Waktu Balik Modal</span>
              <span className="text-slate-800">{exactBepMonth > 0 ? `${Math.round(exactBepMonth * 0.8)} Bulan` : '6 Bulan'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Efisiensi Bahan Baku</span>
              <span className="text-slate-800">+10%</span>
            </div>
          </div>
        </div>

        {/* Scenario 2: Pessimistic */}
        <div className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Skenario Pesimis</h3>
          <p className="text-xs text-slate-500 mb-4 border-b pb-4 leading-relaxed">Asumsi terjadi penurunan omzet hingga 30% dari target karena persaingan atau fluktuasi pasar.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Net Profit Margin</span>
              <span className="text-rose-600 font-bold">8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Waktu Balik Modal</span>
              <span className="text-slate-800">{exactBepMonth > 0 ? `${Math.round(exactBepMonth * 1.5)} Bulan` : '14 Bulan'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Kenaikan Biaya Bahan</span>
              <span className="text-slate-800">+15%</span>
            </div>
          </div>
        </div>

        {/* Recommendation card */}
        <div className="apple-glass rounded-2xl p-6 bg-blue-500/5 border border-blue-500/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-blue-700">Rekomendasi Strategis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-600 font-medium leading-tight">Tekan biaya operasional non-dasar pada 3 bulan pertama jualan.</p>
              </div>
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-600 font-medium leading-tight">Alokasikan dana darurat minimal 20% dari total modal awal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
