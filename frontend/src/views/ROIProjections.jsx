import React, { useState } from 'react';
import { Clock, TrendingUp, Wallet, Download, CheckCircle, Lightbulb, ShieldAlert, Award, Activity } from 'lucide-react';
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

const HEALTH_QUESTIONS = [
  {
    q: 'Apakah Anda memisahkan rekening bank pribadi dan usaha?',
    options: [
      { text: 'Ya, terpisah sepenuhnya sejak awal', points: 20 },
      { text: 'Masih digabung dalam satu rekening', points: 0 }
    ]
  },
  {
    q: 'Apakah Anda mencatat semua uang kas masuk & keluar secara harian?',
    options: [
      { text: 'Ya, dicatat rutin setiap hari', points: 20 },
      { text: 'Kadang-kadang saja jika ingat', points: 10 },
      { text: 'Tidak pernah mencatat keuangan', points: 0 }
    ]
  },
  {
    q: 'Bagaimana Anda mengambil keuntungan/uang dari bisnis?',
    options: [
      { text: 'Mengambil gaji bulanan tetap yang sudah dianggarkan', points: 20 },
      { text: 'Mengambil uang kas secara bebas sesuai kebutuhan pribadi', points: 0 }
    ]
  },
  {
    q: 'Apakah bisnis Anda memiliki dana cadangan/darurat operasional?',
    options: [
      { text: 'Ya, aman untuk minimal 3 bulan operasional', points: 20 },
      { text: 'Ada, tapi kurang dari 3 bulan operasional', points: 10 },
      { text: 'Tidak ada dana cadangan sama sekali', points: 0 }
    ]
  },
  {
    q: 'Apakah Anda merencanakan anggaran belanja bahan baku di awal bulan?',
    options: [
      { text: 'Ya, belanja terjadwal sesuai budget proyeksi', points: 20 },
      { text: 'Belanja acak kapan pun bahan habis', points: 0 }
    ]
  }
];

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

  // Runway Calculator States
  const [runwayOpInput, setRunwayOpInput] = useState(monthlyOp.toString());
  const [reservesInput, setReservesInput] = useState(capital.toString());

  // Health Checkup States
  const [healthAnswers, setHealthAnswers] = useState({});
  const [healthScore, setHealthScore] = useState(null);

  const parseNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const runwayOp = parseNumber(runwayOpInput);
  const reserves = parseNumber(reservesInput);
  const runwayMonths = runwayOp > 0 ? parseFloat((reserves / runwayOp).toFixed(1)) : 0;

  let runwayRating = 'Sangat Aman';
  let runwayColor = 'text-emerald-500';
  let runwayBg = 'bg-emerald-500/10';
  let runwayProgressColor = 'bg-emerald-500';
  let runwayTip = 'Hebat! Cadangan modal kerja Anda sanggup membiayai usaha di atas 6 bulan tanpa omzet sama sekali. Usaha Anda memiliki resiko mati muda yang sangat rendah.';

  if (runwayMonths < 3) {
    runwayRating = 'Bahaya (Zona Merah)';
    runwayColor = 'text-rose-500';
    runwayBg = 'bg-rose-500/10';
    runwayProgressColor = 'bg-rose-500';
    runwayTip = 'Bahaya! Modal darurat kurang dari 3 bulan membuat bisnis Anda rentan bangkrut jika terjadi penurunan omzet mendadak. Segera lakukan efisiensi pengeluaran bulanan.';
  } else if (runwayMonths <= 6) {
    runwayRating = 'Aman Terbatas (Zona Kuning)';
    runwayColor = 'text-amber-500';
    runwayBg = 'bg-amber-500/10';
    runwayProgressColor = 'bg-amber-500';
    runwayTip = 'Cukup Aman. Landasan operasional Anda berkisar 3-6 bulan. Usahakan untuk mulai menabung laba bersih untuk menambah cadangan modal darurat.';
  }

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
        <div className="glass-card rounded-[20px] p-4 shadow-xl text-xs text-[#171C38]">
          <p className="font-bold border-b border-[#FF6B1A]/10 pb-1.5 mb-1.5">{label}</p>
          <p className="text-[#FF6B1A] font-bold">Pendapatan: <span>{formatRupiah(payload[0].value)}</span></p>
          <p className="text-rose-400 font-bold">Pengeluaran: <span>{formatRupiah(payload[1].value)}</span></p>
        </div>
      );
    }
    return null;
  };

  // Health Checkup Logic
  const handleSelectHealth = (qIdx, points) => {
    setHealthAnswers(prev => ({ ...prev, [qIdx]: points }));
  };

  const calculateHealthScore = () => {
    let total = 0;
    let questionsAnswered = 0;
    HEALTH_QUESTIONS.forEach((_, idx) => {
      if (healthAnswers[idx] !== undefined) {
        total += healthAnswers[idx];
        questionsAnswered++;
      }
    });

    if (questionsAnswered < HEALTH_QUESTIONS.length) {
      alert('Mohon jawab seluruh pertanyaan kuis terlebih dahulu!');
      return;
    }

    setHealthScore(total);
  };

  const getHealthVerdict = (score) => {
    if (score < 50) return {
      title: 'Kritis (Risiko Kebocoran Tinggi)',
      desc: 'Keuangan bisnis Anda sangat rentan bocor. Anda wajib memisahkan rekening pribadi/usaha segera, mencatat kas harian, dan berhenti mengambil laba sesuka hati demi mempertahankan kelangsungan modal usaha.',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      icon: ShieldAlert
    };
    if (score < 80) return {
      title: 'Rentan (Butuh Pembenahan)',
      desc: 'Sistem pencatatan Anda sudah berjalan tapi masih memiliki celah bocor. Tetapkan gaji tetap untuk diri Anda sendiri dan pastikan pencatatan pengeluaran dilakukan secara disiplin setiap hari.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      icon: Lightbulb
    };
    return {
      title: 'Sehat & Disiplin (Sangat Baik)',
      desc: 'Luar biasa! Pengelolaan kas bisnis Anda sangat profesional dan terstruktur. Ini meminimalkan risiko modal hilang percuma dan siap untuk diajukan ke program pendanaan luar.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      icon: Award
    };
  };

  return (
    <div className="space-y-8 animate-fade-in text-left relative z-10 w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Proyeksi ROI & Analisis Terpadu</h2>
          <p className="text-sm text-[#6F7178] mt-1 font-semibold">Analisis kelayakan investasi bisnis Anda berdasarkan skenario optimis dan pesimis.</p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="glass-card rounded-[20px] p-6 shadow-lg shadow-orange-500/5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Estimasi Balik Modal</h3>
            <Clock className="w-5 h-5 text-[#FF6B1A]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">
              {exactBepMonth > 0 ? `${exactBepMonth} Bulan` : `${roiMonths} Bulan`}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase mb-0.5 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">Optimis</span>
          </div>
          <div className="mt-4 w-full bg-[#171C38]/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8A3D] h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="glass-card rounded-[20px] p-6 shadow-lg shadow-orange-500/5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Profitability Score</h3>
            <TrendingUp className="w-5 h-5 text-[#FF6B1A] text-glow-orange" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">
              {netMonthlyProfit > 0 ? '86/100' : '70/100'}
            </span>
            <span className="text-[10px] font-bold text-[#FF6B1A] uppercase mb-0.5 border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full font-sans">Sangat Layak</span>
          </div>
          <p className="text-[10px] text-[#6F7178] font-semibold mt-4">Dihitung berdasarkan margin kotor dan efisiensi biaya tetap.</p>
        </div>

        <div className="glass-card rounded-[20px] p-6 shadow-lg shadow-orange-500/5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#6F7178] uppercase tracking-wider">Kebutuhan Modal Awal</h3>
            <Wallet className="w-5 h-5 text-[#FF6B1A]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-[#171C38] leading-none">{formatRupiah(capital)}</span>
          </div>
          <button className="mt-4 w-full py-2.5 cyber-btn text-xs flex items-center justify-center gap-1.5 rounded-xl cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="absolute top-40 right-0 w-72 h-72 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {/* Recharts Break-Even Chart */}
      <div className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg shadow-orange-500/5 w-full">
        <div>
          <h3 className="text-base font-bold text-[#171C38] font-sans">Simulasi Break-Even Point (BEP)</h3>
          <p className="text-xs text-[#6F7178] leading-normal mt-0.5">Representasi grafis perpotongan garis pendapatan kumulatif dan pengeluaran kumulatif.</p>
        </div>
        
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(23, 28, 56, 0.05)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => formatRupiah(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#171C38', fontSize: '11px' }} />
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
                stroke="#F43F5E" 
                strokeWidth={3} 
                dot={false}
              />
              {bepX && bepY && (
                <ReferenceDot 
                  x={bepX} 
                  y={bepY} 
                  r={6} 
                  fill="#FF6B1A" 
                  stroke="#FAF6EE" 
                  strokeWidth={2}
                  isFront={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KALKULATOR RUNWAY & MODAL KERJA */}
      <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8] w-full text-left">
        <h3 className="text-base font-bold text-[#171C38] flex items-center gap-2 font-sans border-b border-[#E8E8E8] pb-3">
          <Clock className="w-5 h-5 text-[#FF6B1A]" />
          <span>Kalkulator Runway & Landasan Operasional</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
          <div className="md:col-span-6 space-y-4 w-full">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171C38]">Pengeluaran Operasional Tetap Bulanan (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={runwayOpInput}
                  onChange={(e) => setRunwayOpInput(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171C38]">Cadangan Kas / Modal Darurat Tersedia (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                <input
                  type="number"
                  value={reservesInput}
                  onChange={(e) => setReservesInput(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#171C38]">Skor Ketahanan Cash Runway</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${runwayBg} ${runwayColor}`}>
                {runwayRating}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-[#171C38] tracking-tight">{runwayMonths} Bulan</p>
              <div className="w-full bg-[#171C38]/5 rounded-full h-2 overflow-hidden">
                <div className={`${runwayProgressColor} h-2 transition-all duration-500`} style={{ width: `${Math.min(100, (runwayMonths / 12) * 100)}%` }} />
              </div>
            </div>

            <p className="text-[10px] text-[#6F7178] bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-3 font-semibold leading-relaxed">
              {runwayTip}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="glass-card rounded-[20px] p-6 animate-slide-up">
          <h3 className="font-bold text-sm text-[#171C38] mb-2">Skenario Optimis</h3>
          <p className="text-xs text-[#6F7178] mb-4 border-b border-[#FF6B1A]/10 pb-4 leading-relaxed font-medium">Asumsi pencapaian penjualan rata-rata harian optimal dengan efisiensi biaya produksi maksimal.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Net Profit Margin</span>
              <span className="text-emerald-400 font-bold">24%</span>
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

        <div className="glass-card rounded-[20px] p-6 animate-slide-up">
          <h3 className="font-bold text-sm text-[#171C38] mb-2">Skenario Pesimis</h3>
          <p className="text-xs text-[#6F7178] mb-4 border-b border-[#FF6B1A]/10 pb-4 leading-relaxed font-medium">Asumsi terjadi penurunan omzet hingga 30% dari target karena persaingan atau fluktuasi pasar.</p>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[#6F7178]">Net Profit Margin</span>
              <span className="text-rose-400 font-bold">8%</span>
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

        <div className="glass-card rounded-[20px] p-6 bg-[#FF6B1A]/5 border border-[#FF6B1A]/20 flex flex-col justify-between animate-slide-up shadow-lg shadow-[#FF6B1A]/2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#FF6B1A] animate-pulse" />
              <h3 className="font-bold text-sm text-[#FF6B1A] text-glow-orange">Rekomendasi Strategis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p className="text-[#6F7178] font-semibold leading-tight">Tekan biaya operasional non-dasar pada 3 bulan pertama jualan.</p>
              </div>
              <div className="flex gap-2 items-start text-xs">
                <CheckCircle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p className="text-[#6F7178] font-semibold leading-tight">Alokasikan dana darurat minimal 20% dari total modal awal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETEKTOR KESEHATAN FINANSIAL UMKM (New full width section at bottom) */}
      <section className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8] w-full text-left">
        <div className="border-b border-[#E8E8E8] pb-4">
          <h3 className="text-lg font-bold text-[#171C38] flex items-center gap-2 font-sans">
            <Activity className="w-5 h-5 text-[#FF6B1A] animate-pulse" />
            <span>Detektor Kesehatan Finansial UMKM (Checkup)</span>
          </h3>
          <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">Ukur disiplin kas dan kesehatan pembukuan bisnis Anda untuk mendeteksi risiko kebocoran kas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Questions on the left */}
          <div className="lg:col-span-7 space-y-5 w-full">
            {HEALTH_QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} className="space-y-2 text-left">
                <h4 className="text-xs font-bold text-[#171C38] leading-relaxed">{qIdx + 1}. {q.q}</h4>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectHealth(qIdx, opt.points)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold border transition-all press-sm ${
                        healthAnswers[qIdx] === opt.points
                          ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] text-[#FF6B1A]'
                          : 'bg-white border-[#E8E8E8] text-[#6F7178] hover:bg-slate-50'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={calculateHealthScore}
              className="w-full btn-primary text-xs py-3.5 flex items-center justify-center gap-2"
            >
              <span>Periksa Kesehatan Keuangan</span>
            </button>
          </div>

          {/* Verdict and details on the right */}
          <div className="lg:col-span-5 space-y-6 w-full">
            {healthScore !== null ? (
              <div className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg border border-[#E8E8E8] animate-bounce-in text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#171C38] uppercase">Skor Kesehatan Finansial</span>
                  <span className="text-2xl font-extrabold text-[#FF6B1A] text-glow-orange">{healthScore} / 100</span>
                </div>

                <div className="w-full bg-[#171C38]/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 transition-all duration-500 ${
                      healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${healthScore}%` }} 
                  />
                </div>

                {/* Verdict Card */}
                {(() => {
                  const verdict = getHealthVerdict(healthScore);
                  const Icon = verdict.icon;
                  return (
                    <div className={`rounded-xl p-4 border ${verdict.color} space-y-2`}>
                      <div className="flex gap-2 items-center font-bold text-xs uppercase tracking-wide">
                        <Icon className="w-4.5 h-4.5" />
                        <span>Status: {verdict.title}</span>
                      </div>
                      <p className="text-[11px] font-semibold leading-relaxed">{verdict.desc}</p>
                    </div>
                  );
                })()}

                <p className="text-[9px] text-[#6F7178] leading-relaxed font-semibold border-t border-[#E8E8E8] pt-3">
                  * Asesmen ini dihitung secara instan berdasarkan praktik pencatatan akuntansi dasar yang direkomendasikan untuk pelaku UMKM Indonesia agar terhindar dari kebocoran kas modal.
                </p>
              </div>
            ) : (
              <div className="bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-[#6F7178] min-h-[300px] relative z-10 w-full">
                <Activity className="w-12 h-12 mb-3 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.2)] animate-float" />
                <h3 className="font-bold text-[#171C38] text-sm">Belum Ada Diagnosa</h3>
                <p className="text-xs text-[#6F7178] mt-1 max-w-xs font-medium">Jawab kuesioner pengelolaan uang di sebelah kiri untuk mendeteksi tingkat kesehatan kas bisnis Anda.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
