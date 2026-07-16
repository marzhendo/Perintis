import React, { useState, useEffect } from 'react';
import { validateBusiness, getFallbackResult } from '../services/validatorApi';
import { fetchViralTrends } from '../services/trendsApi';
import { useToast } from '../components/Toast';
import ValidatorForm from '../components/ValidatorForm';
import ValidatorResult from '../components/ValidatorResult';
import { getProvinsi, getKabupaten, getKecamatan } from '../services/areaService';
import { Sparkles, Zap, Loader2 } from 'lucide-react';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(val);
};


export default function Validator({ validationData, setValidationData, selectedRegion, setSelectedRegion }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);

  // Tren bisnis viral — di-fetch dari /api/trends saat mount
  const [trends, setTrends] = useState([]);
  const [isAiTrends, setIsAiTrends] = useState(false);
  const [trendsLoading, setTrendsLoading] = useState(true);

  // Parse selectedRegion string (e.g. "JAWA BARAT, KOTA BEKASI, JATIASIH")
  const parseRegionString = (str) => {
    if (!str) return { province: 'Seluruh Indonesia', kabupaten: '', kecamatan: '' };
    const parts = str.split(',').map(s => s.trim());
    return {
      province: parts[0] || 'Seluruh Indonesia',
      kabupaten: parts[1] || '',
      kecamatan: parts[2] || '',
    };
  };

  const initialRegion = parseRegionString(validationData?.input?.location || selectedRegion);

  const [form, setForm] = useState({
    businessName: validationData?.input?.businessName || '',
    category: validationData?.input?.category || 'Kuliner',
    description: validationData?.input?.description || '',
    targetMarket: validationData?.input?.targetMarket || ['Mahasiswa'],
    channels: validationData?.input?.channels || ['Offline/Warung'],
    capital: validationData?.input?.capital || 5000000,
    locationProvince: validationData?.input?.locationProvince || initialRegion.province,
    locationKabupaten: validationData?.input?.locationKabupaten || initialRegion.kabupaten,
    locationKecamatan: validationData?.input?.locationKecamatan || initialRegion.kecamatan,
  });

  useEffect(() => {
    getProvinsi().then(list => {
      setProvinsiList(list.sort((a, b) => a.nama.localeCompare(b.nama)));
    });
  }, []);

  // Fetch tren dari API saat mount — biasanya instant karena cached di backend
  useEffect(() => {
    let cancelled = false;
    fetchViralTrends()
      .then((data) => {
        if (cancelled) return;
        setTrends(data.trends ?? []);
        setIsAiTrends(data.is_ai_generated ?? false);
      })
      .catch(() => {
        // Network/server error total — FE tidak crash, section cukup kosong
        if (!cancelled) setTrends([]);
      })
      .finally(() => {
        if (!cancelled) setTrendsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Initialize kabupaten and kecamatan lists if province/kabupaten are pre-selected
  useEffect(() => {
    const initSubRegions = async () => {
      if (!provinsiList.length) return;
      
      const { province, kabupaten, kecamatan } = parseRegionString(selectedRegion || form.locationProvince);

      if (province && province !== 'Seluruh Indonesia') {
        const prov = provinsiList.find(p => p.nama === province);
        if (prov) {
          const kabs = await getKabupaten(prov.id);
          setKabupatenList(kabs);
          
          const targetKab = kabupaten || form.locationKabupaten;
          const kab = kabs.find(k => k.nama === targetKab);
          if (kab) {
            const kecs = await getKecamatan(kab.id);
            setKecamatanList(kecs);
          }
        }
      }
    };
    initSubRegions();
  }, [provinsiList, selectedRegion]);

  const updateGlobalRegion = (prov, kab, kec) => {
    if (!setSelectedRegion) return;
    const parts = [prov, kab, kec].filter(Boolean);
    if (parts.length > 0 && parts[0] !== 'Seluruh Indonesia') {
      setSelectedRegion(parts.join(', '));
    } else {
      setSelectedRegion(null);
    }
  };

  const handleProvinsiChange = async (provName) => {
    const prov = provinsiList.find(p => p.nama === provName);
    setForm(f => ({
      ...f,
      locationProvince: provName,
      locationKabupaten: '',
      locationKecamatan: ''
    }));
    setKabupatenList([]);
    setKecamatanList([]);
    updateGlobalRegion(provName, '', '');

    if (prov) {
      const kabs = await getKabupaten(prov.id);
      setKabupatenList(kabs);
    }
  };

  const handleKabupatenChange = async (kabName) => {
    const kab = kabupatenList.find(k => k.nama === kabName);
    setForm(f => ({
      ...f,
      locationKabupaten: kabName,
      locationKecamatan: ''
    }));
    setKecamatanList([]);
    updateGlobalRegion(form.locationProvince, kabName, '');

    if (kab) {
      const kecs = await getKecamatan(kab.id);
      setKecamatanList(kecs);
    }
  };

  const handleKecamatanChange = (kecName) => {
    setForm(f => ({
      ...f,
      locationKecamatan: kecName
    }));
    updateGlobalRegion(form.locationProvince, form.locationKabupaten, kecName);
  };

  const handleCheckboxChange = (field, value) => {
    const current = [...form[field]];
    setForm({
      ...form,
      [field]: current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value],
    });
  };

  const handleAnalyze = async () => {
    if (!form.description) {
      toast.error('Mohon isi deskripsi ide bisnis terlebih dahulu');
      return;
    }
    setLoading(true);
    
    // Construct single location string for backend payload
    const locParts = [];
    if (form.locationProvince && form.locationProvince !== 'Seluruh Indonesia') {
      locParts.push(form.locationProvince);
      if (form.locationKabupaten) locParts.push(form.locationKabupaten);
      if (form.locationKecamatan) locParts.push(form.locationKecamatan);
    }
    const locationStr = locParts.length > 0 ? locParts.join(', ') : 'Seluruh Indonesia';

    const payload = {
      ...form,
      location: locationStr
    };

    try {
      const result = await validateBusiness(payload);
      setValidationData({ input: form, result });
      toast.success('Analisis selesai! Lihat hasil di bawah.');
    } catch {
      const result = getFallbackResult();
      setValidationData({ input: form, result });
      toast.info('Menampilkan hasil simulasi — server tidak merespon');
    } finally {
      setLoading(false);
    }
  };

  // Mapping preset dari snake_case API ke camelCase yang dibutuhkan ValidatorForm
  const handleUsePreset = (preset) => {
    setForm({
      ...form,
      businessName: preset.business_name,
      category: preset.category,
      description: preset.description,
      // targetMarket & channels tidak digenerate Gemini — pakai default umum
      targetMarket: ['Umum'],
      channels: ['Offline/Warung'],
    });
    toast.success(`Ide "${preset.business_name}" berhasil dimuat! Silakan klik Analisa Bisnis.`);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">AI Business Validator</h2>
        <p className="text-sm text-[#6F7178] mt-1">Gunakan analisis kecerdasan buatan untuk mengukur kelayakan ide bisnis Anda di pasar.</p>
      </header>

      <div className="absolute top-20 -left-20 w-80 h-80 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6 relative animate-slide-up delay-1">
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 relative z-10">
            <ValidatorForm
              form={form}
              setForm={setForm}
              loading={loading}
              onAnalyze={handleAnalyze}
              formatRupiah={formatRupiah}
              handleCheckboxChange={handleCheckboxChange}
              provinsiList={provinsiList}
              kabupatenList={kabupatenList}
              kecamatanList={kecamatanList}
              onProvinsiChange={handleProvinsiChange}
              onKabupatenChange={handleKabupatenChange}
              onKecamatanChange={handleKecamatanChange}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 animate-slide-up delay-2">
          <ValidatorResult result={validationData?.result} />
        </div>
      </div>

      {/* DETEKTOR TREN BISNIS VIRAL */}
      <section className="glass-card rounded-[20px] p-6 space-y-6 shadow-lg border border-[#E8E8E8] w-full text-left">
        <div className="border-b border-[#E8E8E8] pb-4">
          <h3 className="text-lg font-bold text-[#171C38] flex items-center gap-2 font-sans">
            <Zap className="w-5 h-5 text-[#FF6B1A]" />
            <span>Detektor Tren Bisnis Viral</span>
            {/* Label AI hanya tampil jika data benar-benar dari Gemini */}
            {isAiTrends && (
              <span className="text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wide">
                AI
              </span>
            )}
          </h3>
          <p className="text-[10px] text-[#6F7178] font-bold mt-0.5">
            Inspirasi ide usaha mikro yang sedang naik daun di masyarakat Indonesia saat ini.
          </p>
        </div>

        {trendsLoading ? (
          // Loading skeleton — muncul hanya saat pertama kali load (biasanya <1 detik dari cache)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-2xl p-4 h-[210px] animate-pulse">
                <div className="h-3 bg-[#171C38]/10 rounded w-3/4 mb-2" />
                <div className="h-2 bg-[#171C38]/10 rounded w-full mb-1" />
                <div className="h-2 bg-[#171C38]/10 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : trends.length === 0 ? (
          // Fallback UI jika network error total (server down, bukan fallback Gemini)
          <div className="flex items-center justify-center gap-2 text-[#6F7178] text-xs py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Tidak dapat memuat data tren. Coba refresh halaman.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {trends.map((trend, idx) => (
              <div key={idx} className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-2xl p-4 flex flex-col justify-between h-[210px] text-left hover:border-slate-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-[#171C38] font-sans">{trend.name}</h4>
                    <span className="text-[8px] font-extrabold bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                      {trend.viral_score}% Viral
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6F7178] leading-relaxed font-semibold line-clamp-3">{trend.desc}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-[8px] font-bold text-[#6F7178] border-t border-[#E8E8E8] pt-2">
                    <div>
                      <span>Tenor Tren:</span>
                      <span className="block text-[#171C38] mt-0.5">{trend.longevity}</span>
                    </div>
                    <div>
                      <span>Modal:</span>
                      <span className="block text-[#171C38] mt-0.5">{trend.capital_label}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUsePreset(trend.preset)}
                    className="w-full bg-white hover:bg-slate-50 border border-[#E8E8E8] hover:border-slate-300 text-[#FF6B1A] py-1.5 rounded-xl text-[9px] font-bold transition-all press-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gunakan Ide Ini</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
