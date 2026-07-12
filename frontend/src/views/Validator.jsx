import React, { useState, useEffect } from 'react';
import { validateBusiness, getFallbackResult } from '../services/validatorApi';
import { useToast } from '../components/Toast';
import ValidatorForm from '../components/ValidatorForm';
import ValidatorResult from '../components/ValidatorResult';
import { getProvinsi, getKabupaten, getKecamatan } from '../services/areaService';
import { Sparkles, Zap } from 'lucide-react';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(val);
};

const VIRAL_TRENDS = [
  {
    name: 'Es Teh Manis Solo',
    desc: 'Minuman es teh manis ukuran jumbo dengan wangi melati khas Jawa Tengah seharga Rp 3.000.',
    viralScore: 95,
    longevity: 'Sedang-Panjang',
    capitalLabel: 'Kecil (< Rp 5jt)',
    preset: {
      businessName: 'Es Teh Manis Solo Maknyus',
      category: 'Kuliner',
      description: 'Menyediakan minuman es teh manis ukuran jumbo dengan wangi melati khas racikan lokal dengan harga Rp 3.000 per cup.',
      targetMarket: ['Mahasiswa', 'Umum'],
      channels: ['Offline/Warung'],
      capital: 3000000
    }
  },
  {
    name: 'Croissant Geprek (Croger)',
    desc: 'Perpaduan pastry croissant mentega yang renyah dengan isi ayam geprek sambal bawang super pedas.',
    viralScore: 88,
    longevity: 'Jangka Pendek',
    capitalLabel: 'Menengah (Rp 5-15jt)',
    preset: {
      businessName: 'Croger - Croissant Geprek Pedas',
      category: 'Kuliner',
      description: 'Perpaduan pastry renyah croissant mentega dengan isian ayam geprek sambal bawang super pedas.',
      targetMarket: ['Mahasiswa'],
      channels: ['Online/Sosmed', 'Delivery App'],
      capital: 8000000
    }
  },
  {
    name: 'Toko Kelontong Pojok Madura',
    desc: 'Toko kelontong modern yang buka 24 jam dengan display rapi, menjual sembako dengan harga kompetitif.',
    viralScore: 90,
    longevity: 'Sangat Panjang',
    capitalLabel: 'Besar (> Rp 15jt)',
    preset: {
      businessName: 'Toko Kelontong Berkah 24 Jam',
      category: 'Ritel',
      description: 'Toko kelontong yang buka 24 jam dengan penataan barang rapi, pelayanan ramah, dan menjual kebutuhan sembako pokok.',
      targetMarket: ['Ibu Rumah Tangga', 'Umum'],
      channels: ['Offline/Warung'],
      capital: 25000000
    }
  },
  {
    name: 'Jasa Cuci Sepatu (Shoes Clean)',
    desc: 'Layanan cuci sepatu premium dengan sabun khusus ramah lingkungan dan sistem jemput-antar.',
    viralScore: 80,
    longevity: 'Jangka Panjang',
    capitalLabel: 'Kecil (< Rp 5jt)',
    preset: {
      businessName: 'ShoesClean Premium Laundry',
      category: 'Jasa',
      description: 'Jasa pembersihan sepatu premium dengan sabun khusus ramah lingkungan, pembersihan noda membandel, dan gratis jemput-antar.',
      targetMarket: ['Mahasiswa', 'Pekerja Kantoran'],
      channels: ['Online/Sosmed'],
      capital: 4000000
    }
  }
];

export default function Validator({ validationData, setValidationData, selectedRegion, setSelectedRegion }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);

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

  const handleUsePreset = (preset) => {
    setForm({
      ...form,
      ...preset
    });
    toast.success(`Ide "${preset.businessName}" berhasil dimuat! Silakan klik Analisa Bisnis.`);
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
            <span>Detektor Tren Bisnis Viral (AI)</span>
          </h3>
          <p className="text-[10px] text-[#6F7178] font-bold mt-0.5">Inspirasi ide usaha mikro yang sedang naik daun di masyarakat Indonesia saat ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {VIRAL_TRENDS.map((trend, idx) => (
            <div key={idx} className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-2xl p-4 flex flex-col justify-between h-[210px] text-left hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-[#171C38] font-sans">{trend.name}</h4>
                  <span className="text-[8px] font-extrabold bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                    {trend.viralScore}% Viral
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
                    <span className="block text-[#171C38] mt-0.5">{trend.capitalLabel}</span>
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
      </section>
    </div>
  );
}
