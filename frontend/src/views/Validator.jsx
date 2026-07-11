import React, { useState } from 'react';
import { validateBusiness, getFallbackResult } from '../services/validatorApi';
import { useToast } from '../components/Toast';
import ValidatorForm from '../components/ValidatorForm';
import ValidatorResult from '../components/ValidatorResult';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(val);
};

export default function Validator({ validationData, setValidationData }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({
    businessName: validationData?.input?.businessName || '',
    category: validationData?.input?.category || 'Kuliner',
    description: validationData?.input?.description || '',
    targetMarket: validationData?.input?.targetMarket || ['Mahasiswa'],
    channels: validationData?.input?.channels || ['Offline/Warung'],
    capital: validationData?.input?.capital || 5000000,
  });

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
    try {
      const result = await validateBusiness(form);
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
