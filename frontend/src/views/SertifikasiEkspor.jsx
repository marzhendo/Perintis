import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, HelpCircle, Star, Globe, FileText, ArrowRight, Wallet, Percent } from 'lucide-react';

const LEGALITY_CHANNELS = {
  PIRT: [
    { id: 'p1', text: 'Memiliki Nomor Induk Berusaha (NIB)' },
    { id: 'p2', text: 'Mengikuti Penyuluhan Keamanan Pangan (PKP)' },
    { id: 'p3', text: 'Memiliki denah lokasi dan bangunan tempat produksi' },
    { id: 'p4', text: 'Rancangan label kemasan memenuhi ketentuan BPOM' }
  ],
  HALAL: [
    { id: 'h1', text: 'Memiliki NIB berbasis risiko rendah/menengah' },
    { id: 'h2', text: 'Bahan baku yang digunakan dijamin kehalalannya (Sertifikat Halal Bahan)' },
    { id: 'h3', text: 'Memiliki manual Sistem Jaminan Produk Halal (SJPH)' },
    { id: 'h4', text: 'Melakukan pendaftaran online di SIHALAL BPJPH' }
  ],
  BPOM: [
    { id: 'b1', text: 'Memiliki badan usaha berbentuk CV atau PT' },
    { id: 'b2', text: 'Memiliki denah bangunan yang terpisah dengan rumah tangga' },
    { id: 'b3', text: 'Telah lulus audit sarana Cara Ritel/Produksi Pangan Olahan yang Baik (CPPOB)' },
    { id: 'b4', text: 'Memiliki sertifikat izin edar laboratorium terakreditasi' }
  ]
};

const QUIZ_QUESTIONS = [
  {
    q: 'Bagaimana kapasitas produksi produk usaha Anda saat ini?',
    options: [
      { text: 'Hanya dibuat berdasarkan pesanan skala rumah tangga (Pre-order)', points: 10 },
      { text: 'Kapasitas produksi harian konstan, siap memasok skala lokal kota', points: 20 },
      { text: 'Kapasitas produksi skala besar industri dengan mesin manufaktur', points: 30 }
    ]
  },
  {
    q: 'Apakah produk Anda telah memiliki kemasan siap ekspor?',
    options: [
      { text: 'Kemasan plastik polos dengan stiker sederhana', points: 10 },
      { text: 'Kemasan cetak (printed) lengkap dengan komposisi bahasa Indonesia', points: 20 },
      { text: 'Kemasan kedap udara/aluminium foil lengkap dengan bahasa Inggris & Nutrition Facts', points: 30 }
    ]
  },
  {
    q: 'Bagaimana status legalitas dan izin edar usaha Anda?',
    options: [
      { text: 'Belum memiliki izin usaha (hanya jualan perorangan)', points: 10 },
      { text: 'Sudah memiliki NIB dan sertifikat PIRT/Halal', points: 20 },
      { text: 'Sudah lengkap berbadan hukum (CV/PT), NIB, Halal, dan Izin Edar BPOM MD/ML', points: 40 }
    ]
  }
];

export default function SertifikasiEkspor() {
  const [checkedLegals, setCheckedLegals] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // KUR Loan Simulator States
  const [kurChecked, setKurChecked] = useState({});
  const [plafon, setPlafon] = useState(10000000); // 10 Million IDR
  const [tenor, setTenor] = useState(12); // 12 months

  const toggleCheck = (id) => {
    setCheckedLegals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleKurCheck = (id) => {
    setKurChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgress = (items) => {
    const checkedCount = items.filter(item => checkedLegals[item.id]).length;
    return Math.round((checkedCount / items.length) * 100);
  };

  const handleSelectQuiz = (qIdx, points) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: points }));
  };

  const calculateQuizScore = () => {
    let total = 0;
    let questionsAnswered = 0;
    
    QUIZ_QUESTIONS.forEach((_, idx) => {
      if (quizAnswers[idx] !== undefined) {
        total += quizAnswers[idx];
        questionsAnswered++;
      }
    });

    if (questionsAnswered < QUIZ_QUESTIONS.length) {
      alert('Mohon jawab seluruh pertanyaan kuis terlebih dahulu!');
      return;
    }

    setQuizScore(total);
  };

  const getVerdict = (score) => {
    if (score < 50) return {
      title: 'Kesiapan Dasar (Skala Lokal)',
      desc: 'Fokuslah terlebih dahulu pada pelengkapan legalitas dasar domestik seperti PIRT dan Halal, serta standardisasi kualitas rasa/kemasan sebelum menjajal pasar ekspor.'
    };
    if (score <= 80) return {
      title: 'Kesiapan Menengah (Siap Agregator)',
      desc: 'Produk Anda potensial! Anda dapat mencoba ekspor tidak langsung melalui pihak ketiga (eksportir agregator) sambil menyempurnakan izin BPOM sarana produksi.'
    };
    return {
      title: 'Kesiapan Ekspor Mandiri',
      desc: 'Hebat! Sarana usaha, legalitas, dan kapasitas Anda telah sangat memadai untuk melakukan ekspor mandiri atau mendaftar di program business matching internasional!'
    };
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // KUR Calculation: Bunga 6% flat efektif per tahun
  const totalInterest = plafon * 0.06 * (tenor / 12);
  const totalReturn = plafon + totalInterest;
  const monthlyInstallment = totalReturn / tenor;

  const isKurEligible = Object.values(kurChecked).filter(Boolean).length === 4;

  return (
    <div className="space-y-8 animate-fade-in text-left w-full relative z-10">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Legalitas, Ekspor & Pendanaan</h2>
        <p className="text-sm text-[#6F7178] mt-1 font-semibold">Simulasikan kesiapan ekspor produk, lengkapi berkas perizinan, dan kalkulasikan kelayakan modal usaha KUR.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left Side: Certifications Progress Checklists */}
        <div className="lg:col-span-7 space-y-6 w-full">
          
          <div className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8]">
            <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF6B1A]" />
              <span>Panduan Izin & Sertifikasi Nasional</span>
            </h3>

            {/* PIRT Certification Checklist */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-[#171C38]">1. Izin Edar P-IRT (Pangan Rumah Tangga)</h4>
                <span className="text-[10px] font-bold text-[#FF6B1A]">{getProgress(LEGALITY_CHANNELS.PIRT)}%</span>
              </div>
              <div className="w-full bg-[#171C38]/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#FF6B1A] h-1.5 transition-all duration-500" style={{ width: `${getProgress(LEGALITY_CHANNELS.PIRT)}%` }} />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1.5">
                {LEGALITY_CHANNELS.PIRT.map(item => (
                  <label key={item.id} className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold font-sans">
                    <input
                      type="checkbox"
                      checked={!!checkedLegals[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 rounded border-[#E8E8E8] text-[#FF6B1A] focus:ring-[#FF6B1A]"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Halal Certification Checklist */}
            <div className="space-y-3 border-t border-[#E8E8E8] pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-[#171C38]">2. Sertifikat Halal Indonesia (BPJPH)</h4>
                <span className="text-[10px] font-bold text-emerald-600">{getProgress(LEGALITY_CHANNELS.HALAL)}%</span>
              </div>
              <div className="w-full bg-[#171C38]/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${getProgress(LEGALITY_CHANNELS.HALAL)}%` }} />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1.5">
                {LEGALITY_CHANNELS.HALAL.map(item => (
                  <label key={item.id} className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold font-sans">
                    <input
                      type="checkbox"
                      checked={!!checkedLegals[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 rounded border-[#E8E8E8] text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BPOM Certification Checklist */}
            <div className="space-y-3 border-t border-[#E8E8E8] pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-[#171C38]">3. Izin Edar BPOM MD/ML (Skala Industri)</h4>
                <span className="text-[10px] font-bold text-purple-600">{getProgress(LEGALITY_CHANNELS.BPOM)}%</span>
              </div>
              <div className="w-full bg-[#171C38]/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-1.5 transition-all duration-500" style={{ width: `${getProgress(LEGALITY_CHANNELS.BPOM)}%` }} />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1.5">
                {LEGALITY_CHANNELS.BPOM.map(item => (
                  <label key={item.id} className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold font-sans">
                    <input
                      type="checkbox"
                      checked={!!checkedLegals[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 rounded border-[#E8E8E8] text-purple-500 focus:ring-purple-500"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Quiz Export Readiness */}
        <div className="lg:col-span-5 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8]">
            <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF6B1A]" />
              <span>Kuis Kesiapan Ekspor AI</span>
            </h3>

            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={idx} className="space-y-2 text-left">
                  <h4 className="text-xs font-bold text-[#171C38] leading-relaxed">{idx + 1}. {q.q}</h4>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectQuiz(idx, opt.points)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold border transition-all press-sm ${
                          quizAnswers[idx] === opt.points
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
            </div>

            <button
              onClick={calculateQuizScore}
              className="w-full btn-primary text-xs py-3.5 flex items-center justify-center gap-2"
            >
              <span>Hitung Kesiapan Ekspor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quiz Result Display */}
            {quizScore !== null && (
              <div className="border-t border-[#E8E8E8] pt-4 space-y-3 animate-bounce-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#171C38] uppercase">Skor Kesiapan Ekspor</span>
                  <span className="text-2xl font-extrabold text-[#FF6B1A] text-glow-orange">{quizScore} / 100</span>
                </div>
                <div className="bg-[#171C38]/5 rounded-xl p-3 text-left space-y-1">
                  <h4 className="text-xs font-bold text-[#FF6B1A]">{getVerdict(quizScore).title}</h4>
                  <p className="text-[11px] text-[#6F7178] leading-relaxed font-semibold">{getVerdict(quizScore).desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PLAFON / SIMULASI KUR PENDANAAN (New full width section at bottom) */}
      <section className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8] w-full text-left">
        <div className="border-b border-[#E8E8E8] pb-4">
          <h3 className="text-lg font-bold text-[#171C38] flex items-center gap-2 font-sans">
            <Wallet className="w-5 h-5 text-[#FF6B1A]" />
            <span>Kalkulator & Kelayakan Kredit Usaha Rakyat (KUR)</span>
          </h3>
          <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">Uji kelayakan dokumen usaha Anda untuk mengajukan pinjaman KUR bunga 6% efektif pertahun.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Kelayakan Checklist */}
          <div className="lg:col-span-6 space-y-4 w-full">
            <h4 className="font-bold text-xs text-[#171C38] border-b border-[#E8E8E8] pb-1.5">Syarat Kelayakan Pengajuan</h4>
            
            <div className="space-y-3 pt-1">
              <label className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold">
                <input
                  type="checkbox"
                  checked={!!kurChecked.k1}
                  onChange={() => toggleKurCheck('k1')}
                  className="mt-0.5 rounded border-[#E8E8E8] text-[#FF6B1A]"
                />
                <span>Telah menjalankan usaha produktif secara aktif minimal selama 6 bulan.</span>
              </label>

              <label className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold">
                <input
                  type="checkbox"
                  checked={!!kurChecked.k2}
                  onChange={() => toggleKurCheck('k2')}
                  className="mt-0.5 rounded border-[#E8E8E8] text-[#FF6B1A]"
                />
                <span>Tidak sedang menerima kredit modal kerja / investasi aktif dari bank lain.</span>
              </label>

              <label className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold">
                <input
                  type="checkbox"
                  checked={!!kurChecked.k3}
                  onChange={() => toggleKurCheck('k3')}
                  className="mt-0.5 rounded border-[#E8E8E8] text-[#FF6B1A]"
                />
                <span>Memiliki surat keterangan usaha / Nomor Induk Berusaha (NIB) legal.</span>
              </label>

              <label className="flex gap-2.5 items-start text-xs text-[#6F7178] cursor-pointer hover:text-[#171C38] transition-colors font-semibold">
                <input
                  type="checkbox"
                  checked={!!kurChecked.k4}
                  onChange={() => toggleKurCheck('k4')}
                  className="mt-0.5 rounded border-[#E8E8E8] text-[#FF6B1A]"
                />
                <span>Memiliki riwayat kredit bersih / lolos BI Checking (SLIK OJK Kol-1).</span>
              </label>
            </div>

            <div className="pt-2">
              <span className={`text-[10px] font-bold border px-3 py-1 rounded-full ${
                isKurEligible 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {isKurEligible ? '🟢 LAYAK MENGAJUKAN (Peluang Disetujui Tinggi)' : '🟡 BELUM LAYAK (Lengkapi Persyaratan)'}
              </span>
            </div>
          </div>

          {/* Cicilan Simulator */}
          <div className="lg:col-span-6 space-y-4 w-full">
            <h4 className="font-bold text-xs text-[#171C38] border-b border-[#E8E8E8] pb-1.5 flex justify-between items-center">
              <span>Simulasi Angsuran Bulanan</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Bunga 6% Flat/Thn</span>
            </h4>

            {/* Plafon range input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#171C38]">
                <span>Plafon Pinjaman</span>
                <span>{formatRupiah(plafon)}</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="100000000"
                step="5000000"
                value={plafon}
                onChange={(e) => setPlafon(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#171C38]/5 rounded-lg appearance-none cursor-pointer accent-[#FF6B1A]"
              />
              <div className="flex justify-between text-[8px] font-bold text-[#6F7178]">
                <span>Rp 10 Juta</span>
                <span>Rp 100 Juta</span>
              </div>
            </div>

            {/* Tenor dropdown */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-[#171C38]">Tenor Jangka Waktu (Bulan)</label>
              <select
                value={tenor}
                onChange={(e) => setTenor(parseInt(e.target.value))}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#6F7178]"
                style={{ colorScheme: 'light' }}
              >
                <option value="12">12 Bulan (1 Tahun)</option>
                <option value="24">24 Bulan (2 Tahun)</option>
                <option value="36">36 Bulan (3 Tahun)</option>
              </select>
            </div>

            {/* Installment Result Box */}
            <div className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-3.5 flex justify-between items-center mt-4">
              <div>
                <span className="text-[9px] font-extrabold uppercase text-[#6F7178]">Estimasi Angsuran Bulanan</span>
                <p className="text-2xl font-extrabold text-[#FF6B1A] text-glow-orange leading-none mt-1">{formatRupiah(monthlyInstallment)}</p>
              </div>
              <div className="text-right text-[10px] font-semibold text-[#6F7178]">
                <span>Total Pengembalian:</span>
                <p className="font-bold text-[#171C38]">{formatRupiah(totalReturn)}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
