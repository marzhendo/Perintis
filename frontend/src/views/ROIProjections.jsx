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
  
  const capital = hasData ? calculationData.input.capital : 5000000;
  const monthlyOp = hasData ? calculationData.input.monthlyOp : 1500000;
  const bepUnits = hasData ? calculationData.result.bepUnits : 300;
  const sellingPrice = hasData ? calculationData.input.sellingPrice : 12000;
  const materialCost = hasData ? calculationData.input.materialCost : 7000;
  const roiMonths = hasData ? calculationData.result.roiMonths : 3.3;

  const salesVolumePerMonth = Math.ceil(bepUnits * 1.5) || 450;
  const monthlyRevenue = salesVolumePerMonth * sellingPrice;
  const monthlyVariableCost = salesVolumePerMonth * materialCost;
  const monthlyExpense = monthlyOp + monthlyVariableCost;

  const data = [];
  let minDiff = Infinity;

  for (let m = 0; m <= 24; m++) {
    const cumulativeCost = capital + m * monthlyExpense;
    const cumulativeRevenue = m * monthlyRevenue;
    
    const diff = Math.abs(cumulativeCost - cumulativeRevenue);
    if (m > 0 && diff < minDiff) {
      minDiff = diff;
    }
    
    data.push({
      month: `Bln ${m}`,
      monthNum: m,
      'Total Pengeluaran': cumulativeCost,
      'Total Pendapatan': cumulativeRevenue,
    });
  }

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
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] p-4 shadow-xl text-xs text-[#171C38]">
          <p className="font-bold border-b border-[#E8E8E8] pb-1.5 mb-1.5">{label}</p>
          <p className="text-[#FF6B1A]">Pendapatan: <span className="font-bold">{formatRupiah(payload[0].value)}</span></p>
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
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Proyeksi ROI & Analisis Terpadu</h2>
          <p className="text-sm text-[#6F7178] mt-1">Analisis kelayakan investasi bisnis Anda berdasarkan skenario optimis dan pesimis.</p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 card-lift press animate-slide-up delay-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Estimasi Balik Modal</h3>
            <Clock className="w-5 h-5 text-[#FF6B1A]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">
              {exactBepMonth > 0 ? `${exactBepMonth} Bulan` : `${roiMonths} Bulan`}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase mb-0.5 border border-emerald-500/15">Optimis</span>
          </div>
          <div className="mt-4 w-full bg-[#E8E8E8] rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8A3D] h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 card-lift press animate-slide-up delay-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Profitability Score</h3>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">
              {netMonthlyProfit > 0 ? '86/100' : '70/100'}
            </span>
            <span className="text-[10px] font-bold text-[#FF6B1A] uppercase mb-0.5">Sangat Layak</span>
          </div>
          <p className="text-[10px] text-[#6F7178] font-medium mt-4">Dihitung berdasarkan margin kotor dan efisiensi biaya tetap.</p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 card-lift press animate-slide-up delay-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Kebutuhan Modal Awal</h3>
            <Wallet className="w-5 h-5 text-[#FF8A3D]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">{formatRupiah(capital)}</span>
          </div>
          <button className="mt-4 w-full py-2 btn-primary text-xs flex items-center justify-center gap-1.5 press-sm">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="absolute top-40 right-0 w-72 h-72 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {/* Recharts Break-Even Chart */}
      <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 space-y-4 card-lift press">
        <div>
          <h3 className="text-base font-bold text-[#171C38]">Simulasi Break-Even Point (BEP)</h3>
          <p className="text-xs text-[#6F7178] leading-normal mt-0.5">Representasi grafis perpotongan garis pendapatan kumulatif dan pengeluaran kumulatif.</p>
        </div>
        
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" stroke="#6F7178" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#6F7178" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => formatRupiah(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="Total Pendapatan" 
                stroke="#FF6B1A" 
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
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 card-lift press animate-slide-up delay-1">
          <h3 className="font-bold text-sm text-[#171C38] mb-2">Skenario Optimis</h3>
          <p className="text-xs text-[#6F7178] mb-4 border-b border-[#E8E8E8] pb-4 leading-relaxed">Asumsi pencapaian penjualan rata-rata harian optimal dengan efisiensi biaya produksi maksimal.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Net Profit Margin</span>
              <span className="text-emerald-600 font-bold">24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Waktu Balik Modal</span>
              <span className="text-[#171C38]">{exactBepMonth > 0 ? `${Math.round(exactBepMonth * 0.8)} Bulan` : '6 Bulan'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Efisiensi Bahan Baku</span>
              <span className="text-[#171C38]">+10%</span>
            </div>
          </div>
        </div>

        {/* Scenario 2: Pessimistic */}
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 card-lift press animate-slide-up delay-2">
          <h3 className="font-bold text-sm text-[#171C38] mb-2">Skenario Pesimis</h3>
          <p className="text-xs text-[#6F7178] mb-4 border-b border-[#E8E8E8] pb-4 leading-relaxed">Asumsi terjadi penurunan omzet hingga 30% dari target karena persaingan atau fluktuasi pasar.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Net Profit Margin</span>
              <span className="text-rose-600 font-bold">8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Waktu Balik Modal</span>
              <span className="text-[#171C38]">{exactBepMonth > 0 ? `${Math.round(exactBepMonth * 1.5)} Bulan` : '14 Bulan'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Kenaikan Biaya Bahan</span>
              <span className="text-[#171C38]">+15%</span>
            </div>
          </div>
        </div>

        {/* Recommendation card */}
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 bg-[#FF6B1A]/5 border-[#FF6B1A]/10 flex flex-col justify-between card-lift press animate-slide-up delay-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#FF6B1A]" />
              <h3 className="font-bold text-sm text-[#FF6B1A]">Rekomendasi Strategis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p className="text-[#6F7178] font-medium leading-tight">Tekan biaya operasional non-dasar pada 3 bulan pertama jualan.</p>
              </div>
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p className="text-[#6F7178] font-medium leading-tight">Alokasikan dana darurat minimal 20% dari total modal awal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
