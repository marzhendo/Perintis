import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, Video, Share2, Clipboard, Check, HelpCircle, Phone, MapPin, QrCode } from 'lucide-react';
import { useToast } from '../components/Toast';
import { fetchApi } from '../services/apiClient';

export default function AICopywriter() {
  const [activeTab, setActiveTab] = useState('writer'); // 'writer' or 'card'
  const toast = useToast();

  // AI Copywriter States
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('Mahasiswa/Anak Muda');
  const [tone, setTone] = useState('Lucu & Santai');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [generatedResults, setGeneratedResults] = useState(null);

  // Card Designer States
  const [cardBizName, setCardBizName] = useState('Warung Nusantara');
  const [cardOwner, setCardOwner] = useState('Fatir Gibran');
  const [cardSlogan, setCardSlogan] = useState('Cita Rasa Autentik Selera Nusantara');
  const [cardWA, setCardWA] = useState('0812-3456-7890');
  const [cardAddress, setCardAddress] = useState('Jl. Merdeka No. 45, Bandung');
  const [cardTheme, setCardTheme] = useState('classic'); // 'classic', 'orange', 'emerald', 'gold'
  const [cardFlipped, setCardFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!productName.trim() || !productDesc.trim()) {
      toast.error('Mohon isi nama dan deskripsi produk');
      return;
    }

    setLoading(true);
    setGeneratedResults(null);

    try {
      const response = await fetchApi('/api/copywriter', {
        method: 'POST',
        body: JSON.stringify({
          product_name: productName,
          product_desc: productDesc,
          target_audience: targetAudience,
          tone: tone,
        }),
      });

      const results = [
        {
          platform: 'Instagram / Facebook',
          icon: Send,
          color: 'text-pink-500 bg-pink-50 border-pink-100',
          copy: response.instagram_caption,
        },
        {
          platform: 'WhatsApp Broadcast',
          icon: MessageCircle,
          color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
          copy: response.whatsapp_message,
        },
        {
          platform: 'TikTok / Reels Video Hook & Script',
          icon: Video,
          color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
          copy: response.tiktok_script,
        }
      ];

      setGeneratedResults(results);
      toast.success('Konten promosi berhasil dibuat oleh AI');
    } catch (err) {
      toast.error('Gagal membuat konten promosi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Salin teks berhasil');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Card Theme Configs
  const themes = {
    classic: {
      frontBg: 'bg-[#FAF6EE]',
      backBg: 'bg-[#171C38]',
      textFront: 'text-[#171C38]',
      textBack: 'text-[#FAF6EE]',
      accent: 'text-[#FF6B1A]',
      accentBg: 'bg-[#FF6B1A]',
      border: 'border-[#171C38]/20',
      shadow: 'shadow-[#171C38]/10'
    },
    orange: {
      frontBg: 'bg-gradient-to-br from-[#FF6B1A] to-[#FF8A3D]',
      backBg: 'bg-gradient-to-br from-[#FF8A3D] to-[#FF6B1A]',
      textFront: 'text-white',
      textBack: 'text-white',
      accent: 'text-white',
      accentBg: 'bg-white',
      border: 'border-white/20',
      shadow: 'shadow-orange-500/20'
    },
    emerald: {
      frontBg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
      backBg: 'bg-gradient-to-br from-teal-700 to-emerald-600',
      textFront: 'text-white',
      textBack: 'text-white',
      accent: 'text-[#FAF6EE]',
      accentBg: 'bg-white',
      border: 'border-white/20',
      shadow: 'shadow-emerald-500/20'
    },
    gold: {
      frontBg: 'bg-[#1a1a1a]',
      backBg: 'bg-[#2a2a2a]',
      textFront: 'text-[#d4af37]',
      textBack: 'text-[#d4af37]',
      accent: 'text-[#fcf6ba]',
      accentBg: 'bg-[#d4af37]',
      border: 'border-[#d4af37]/30',
      shadow: 'shadow-yellow-500/10'
    }
  };

  const activeTheme = themes[cardTheme] || themes.classic;

  return (
    <div className="space-y-8 animate-fade-in text-left w-full relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Pemasaran & Konten Kreatif</h2>
          <p className="text-sm text-[#6F7178] mt-1 font-semibold">Tulis materi iklan secara instan dan desain kartu nama digital interaktif untuk promosi usaha Anda.</p>
        </div>
        <div className="flex bg-[#171C38]/5 p-1 rounded-2xl border border-[#E8E8E8] shadow-inner">
          <button
            onClick={() => setActiveTab('writer')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press ${
              activeTab === 'writer'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Generator Teks Iklan
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 press ${
              activeTab === 'card'
                ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]'
                : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
            }`}
          >
            Kartu Nama 3D
          </button>
        </div>
      </header>

      {activeTab === 'writer' ? (
        /* ==================== AI COPYWRITER TAB ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8]">
              <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B1A]" />
                <span>Detail Produk</span>
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Nama Produk / Jasa</label>
                <input
                  type="text"
                  placeholder="Contoh: Keripik Singkong Pedas Nyos"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 px-4 text-xs font-semibold text-[#171C38] transition-all focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Deskripsi Singkat Keunggulan Produk</label>
                <textarea
                  rows={4}
                  placeholder="Contoh: Keripik singkong gurih renyah dengan bumbu cabai rawit melimpah tanpa pengawet tambahan."
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 px-4 text-xs font-semibold text-[#171C38] transition-all resize-none focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Target Calon Pembeli</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 px-4 text-xs font-semibold text-[#6F7178] transition-all focus-ring"
                  style={{ colorScheme: 'light' }}
                >
                  <option value="Mahasiswa/Anak Muda">Mahasiswa / Anak Muda</option>
                  <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                  <option value="Pekerja Kantoran">Pekerja Kantoran</option>
                  <option value="Anak Sekolah">Anak Sekolah</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Gaya / Nada Penulisan</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl py-3 px-4 text-xs font-semibold text-[#6F7178] transition-all focus-ring"
                  style={{ colorScheme: 'light' }}
                >
                  <option value="Lucu & Santai">Lucu & Santai</option>
                  <option value="Persuasif & Mendesak">Persuasif & Mendesak (Promo)</option>
                  <option value="Ramah & Personal">Ramah & Personal</option>
                  <option value="Profesional">Formal & Profesional</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full btn-primary text-xs py-3.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Membuat Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Buat Konten Promosi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 w-full">
            {loading ? (
              <div className="glass-card rounded-[20px] p-12 text-center border border-[#E8E8E8] space-y-4">
                <div className="w-10 h-10 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#6F7178] font-bold">Kecerdasan Buatan Perintis sedang menyusun kata-kata promosi terbaik untuk Anda...</p>
              </div>
            ) : generatedResults ? (
              <div className="space-y-6 animate-fade-in w-full">
                {generatedResults.map((res, i) => {
                  const Icon = res.icon;
                  return (
                    <div key={i} className="glass-card rounded-[20px] p-6 space-y-4 shadow-lg border border-[#E8E8E8] w-full text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${res.color}`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider">{res.platform}</h4>
                        </div>
                        <button
                          onClick={() => handleCopy(res.copy, i)}
                          className="text-[#FF6B1A] hover:bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold press-sm"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="w-3.5 h-3.5" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-4 text-xs font-semibold text-[#171C38] whitespace-pre-wrap leading-relaxed font-sans select-all">
                        {res.copy}
                      </pre>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-[#6F7178] min-h-[350px] relative z-10 w-full">
                <Share2 className="w-12 h-12 mb-3 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.2)] animate-float" />
                <h3 className="font-bold text-[#171C38] text-sm">Belum Ada Konten</h3>
                <p className="text-xs text-[#6F7178] mt-1 max-w-xs font-medium">Isi detail produk usaha Anda di sebelah kiri dan klik tombol untuk menghasilkan materi promosi instan.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== CARD DESIGNER TAB ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Inputs on the left */}
          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8]">
              <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-[#FF6B1A]" />
                <span>Data Kartu Bisnis</span>
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Nama Usaha / Toko</label>
                <input
                  type="text"
                  value={cardBizName}
                  onChange={(e) => setCardBizName(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Nama Pemilik</label>
                <input
                  type="text"
                  value={cardOwner}
                  onChange={(e) => setCardOwner(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Slogan Bisnis</label>
                <input
                  type="text"
                  value={cardSlogan}
                  onChange={(e) => setCardSlogan(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={cardWA}
                  onChange={(e) => setCardWA(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Alamat Toko</label>
                <input
                  type="text"
                  value={cardAddress}
                  onChange={(e) => setCardAddress(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#171C38]">Skema Warna Desain</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'classic', label: 'Classic', color: 'bg-[#171C38]' },
                    { id: 'orange', label: 'Orange', color: 'bg-orange-500' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
                    { id: 'gold', label: 'Gold', color: 'bg-[#d4af37]' }
                  ].map((themeOpt) => (
                    <button
                      key={themeOpt.id}
                      onClick={() => setCardTheme(themeOpt.id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[9px] font-bold transition-all press-sm cursor-pointer ${
                        cardTheme === themeOpt.id
                          ? 'border-[#FF6B1A] bg-[#FF6B1A]/5 text-[#FF6B1A]'
                          : 'border-[#E8E8E8] bg-white text-[#6F7178] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${themeOpt.color}`} />
                      <span>{themeOpt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D flip card mockup on the right */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6 w-full py-6">
            
            {/* 3D Perspective card container */}
            <div 
              className="w-full max-w-[400px] h-[230px] cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              <div 
                className={`w-full h-full relative transition-transform duration-700 ease-in-out shadow-xl rounded-[18px] border ${activeTheme.border} ${activeTheme.shadow}`}
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: cardFlipped ? 'rotateY(180deg)' : 'none' 
                }}
              >
                
                {/* CARD FRONT SIDE */}
                <div 
                  className={`absolute inset-0 w-full h-full p-6 flex flex-col justify-between rounded-[18px] select-none ${activeTheme.frontBg} ${activeTheme.textFront}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Perintis UMKM Card</span>
                    <Sparkles className={`w-5 h-5 ${activeTheme.accent}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold tracking-tight">{cardBizName}</h3>
                    <p className="text-[10px] font-semibold opacity-75 italic">{cardSlogan}</p>
                  </div>

                  <div className="flex justify-between items-end border-t border-dashed border-current pt-3 opacity-80">
                    <span className="text-[10px] font-bold">{cardOwner}</span>
                    <span className="text-[8px] font-semibold uppercase tracking-wider">Pemilik Usaha</span>
                  </div>
                </div>

                {/* CARD BACK SIDE */}
                <div 
                  className={`absolute inset-0 w-full h-full p-6 flex flex-col justify-between rounded-[18px] select-none ${activeTheme.backBg} ${activeTheme.textBack}`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)' 
                  }}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="space-y-2 text-left">
                      <h4 className="text-sm font-extrabold">{cardBizName}</h4>
                      
                      <div className="space-y-1 text-[9px] font-semibold opacity-85">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{cardWA}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-2 leading-tight">{cardAddress}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic QR Code SVG Simulator */}
                    <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center border border-current shadow-inner flex-shrink-0">
                      <QrCode className="w-full h-full text-slate-800" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-dashed border-current/30 pt-3 text-[8px] font-bold tracking-wider opacity-75">
                    <span>Scan Kontak WA</span>
                    <span>Hubungi Kami</span>
                  </div>

                </div>

              </div>
            </div>

            <p className="text-xs text-[#6F7178] font-bold text-center italic">
              * Klik kartu di atas untuk membalik dan melihat sisi belakang.
            </p>

          </div>
        </div>
      )}
    </div>
  );
}
