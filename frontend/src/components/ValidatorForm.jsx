import React from 'react';
import { Check, Brain } from 'lucide-react';

const CATEGORIES = ['Kuliner', 'Jasa', 'Retail/Toko', 'Digital'];
const MARKETS = ['Mahasiswa', 'Pekerja Kantor', 'Kelompok Keluarga', 'Umum'];
const CHANNELS = ['Offline/Warung', 'E-commerce', 'Delivery Online'];

function ChipGroup({ options, value, onChange, multi }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = multi ? value.includes(opt) : value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => multi ? onChange(opt) : onChange(opt)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 press ${
              selected
                ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/20 text-[#FF6B1A] font-bold'
                : 'border-[#E8E8E8] text-[#6F7178] hover:bg-[#F8ECD2]/50'
            }`}
          >
            {multi && selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ChannelButton({ value, selected }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all press ${
      selected
        ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/20 text-[#FF6B1A] font-bold shadow-sm'
        : 'border-[#E8E8E8] text-[#6F7178] hover:bg-[#F8ECD2]/50'
    }`}>
      <span>{value}</span>
      {selected && <Check className="w-4 h-4 text-[#FF6B1A]" />}
    </div>
  );
}

export default function ValidatorForm({ 
  form, 
  setForm, 
  loading, 
  onAnalyze, 
  formatRupiah, 
  handleCheckboxChange, 
  provinsiList = [], 
  kabupatenList = [], 
  kecamatanList = [], 
  onProvinsiChange, 
  onKabupatenChange, 
  onKecamatanChange 
}) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-bold text-[#171C38] mb-2">Nama & Kategori Usaha</label>
        <input
          type="text"
          placeholder="Masukkan nama usaha (opsional)"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-sm font-medium placeholder:text-[#6F7178] mb-3 focus-ring"
        />
        <ChipGroup options={CATEGORIES} value={form.category} onChange={(cat) => setForm({ ...form, category: cat })} />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold text-[#171C38]">Lokasi Usaha</label>
        
        {/* Dropdown Provinsi */}
        <div>
          <label htmlFor="location-provinsi" className="block text-[11px] font-semibold text-[#6F7178] mb-1">Provinsi</label>
          <select
            id="location-provinsi"
            value={form.locationProvince}
            onChange={(e) => onProvinsiChange(e.target.value)}
            className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-medium focus-ring"
          >
            <option value="Seluruh Indonesia">Seluruh Indonesia (Semua Wilayah)</option>
            {provinsiList.map((p) => (
              <option key={p.id} value={p.nama}>
                {p.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Kabupaten/Kota */}
        {form.locationProvince && form.locationProvince !== 'Seluruh Indonesia' && (
          <div className="animate-fade-in">
            <label htmlFor="location-kabupaten" className="block text-[11px] font-semibold text-[#6F7178] mb-1">Kabupaten/Kota</label>
            <select
              id="location-kabupaten"
              value={form.locationKabupaten}
              onChange={(e) => onKabupatenChange(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-medium focus-ring"
            >
              <option value="">-- Pilih Kabupaten/Kota --</option>
              {kabupatenList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dropdown Kecamatan */}
        {form.locationProvince && form.locationProvince !== 'Seluruh Indonesia' && form.locationKabupaten && (
          <div className="animate-fade-in">
            <label htmlFor="location-kecamatan" className="block text-[11px] font-semibold text-[#6F7178] mb-1">Kecamatan</label>
            <select
              id="location-kecamatan"
              value={form.locationKecamatan}
              onChange={(e) => onKecamatanChange(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-medium focus-ring"
            >
              <option value="">-- Pilih Kecamatan --</option>
              {kecamatanList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-[10px] text-[#6F7178] font-semibold mt-1">
          * Lokasi berjenjang membantu AI mengevaluasi potensi pasar daerah, tingkat kompetisi lokal, dan ketersediaan rantai pasok wilayah setempat secara sangat spesifik.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-[#171C38]">Deskripsi Ide Bisnis</label>
          <span className="text-[10px] text-[#6F7178] font-bold">{form.description.length}/300</span>
        </div>
        <textarea
          maxLength="300"
          rows="4"
          placeholder="Jelaskan produk/layanan, masalah yang diselesaikan, dan keunikan bisnismu..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-4 text-sm font-medium placeholder:text-[#6F7178] resize-none focus-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#171C38] mb-2">Target Pasar</label>
        <ChipGroup multi options={MARKETS} value={form.targetMarket} onChange={(v) => handleCheckboxChange('targetMarket', v)} />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#171C38] mb-2">Kanal Penjualan Utama</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CHANNELS.map((channel) => (
            <button key={channel} type="button" onClick={() => handleCheckboxChange('channels', channel)}>
              <ChannelButton value={channel} selected={form.channels.includes(channel)} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-[#171C38]">Estimasi Modal Awal</label>
          <span className="font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-3 py-1 rounded-full text-xs">
            {formatRupiah(form.capital)}
          </span>
        </div>
        <input
          type="range"
          min="1000000"
          max="100000000"
          step="1000000"
          value={form.capital}
          onChange={(e) => setForm({ ...form, capital: parseInt(e.target.value) })}
          className="w-full h-2 bg-[#E8E8E8] rounded-lg appearance-none cursor-pointer accent-[#FF6B1A] focus-ring"
        />
        <div className="flex justify-between text-[10px] text-[#6F7178] font-bold mt-1">
          <span>Rp 1 Juta</span>
          <span>Rp 50 Juta</span>
          <span>Rp 100 Juta+</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading || !form.description}
        className="w-full btn-primary text-sm py-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menganalisa Ide...</span>
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            <span>Analisa Mendalam dengan AI</span>
          </>
        )}
      </button>
    </form>
  );
}
