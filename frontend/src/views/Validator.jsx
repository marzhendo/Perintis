import React, { useState, useEffect } from 'react';
import { validateBusiness, getFallbackResult } from '../services/validatorApi';
import { useToast } from '../components/Toast';
import ValidatorForm from '../components/ValidatorForm';
import ValidatorResult from '../components/ValidatorResult';
import { getProvinsi, getKabupaten, getKecamatan } from '../services/areaService';

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
    </div>
  );
}
