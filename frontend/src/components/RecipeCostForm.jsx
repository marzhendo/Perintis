import React, { useState } from 'react';
import { Plus, Trash, Calculator, Info, CheckCircle2 } from 'lucide-react';

const COMMON_COMMODITIES = [
  { name: 'Daging Ayam', price: 36000, unit: 'kg' },
  { name: 'Cabai Rawit', price: 45000, unit: 'kg' },
  { name: 'Bawang Merah', price: 35000, unit: 'kg' },
  { name: 'Beras Premium', price: 14500, unit: 'kg' },
  { name: 'Minyak Goreng', price: 18000, unit: 'kg' }
];

export default function RecipeCostForm() {
  const [portions, setPortions] = useState('10');
  const [targetPrice, setTargetPrice] = useState('20000');
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Daging Ayam', qty: 1.5, unit: 'kg', costPerUnit: 36000 },
    { id: 2, name: 'Cabai Rawit', qty: 0.2, unit: 'kg', costPerUnit: 45000 },
    { id: 3, name: 'Bawang Merah', qty: 0.1, unit: 'kg', costPerUnit: 35000 }
  ]);
  const [showResults, setShowResults] = useState(false);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now(), name: 'Bahan Baru', qty: 1, unit: 'kg', costPerUnit: 10000 }
    ]);
    setShowResults(false);
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    setShowResults(false);
  };

  const handleUpdateIngredient = (id, key, val) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        let updatedVal = val;
        if (key === 'qty' || key === 'costPerUnit') {
          // Limit length to 12
          const valStr = String(val);
          if (valStr.length > 12) {
            updatedVal = parseFloat(valStr.slice(0, 12)) || 0;
          } else {
            updatedVal = parseFloat(val) || 0;
          }
        }
        setShowResults(false);
        return { ...ing, [key]: updatedVal };
      }
      return ing;
    }));
  };

  const handleSelectPredefined = (id, name) => {
    const selected = COMMON_COMMODITIES.find(c => c.name === name);
    if (selected) {
      setIngredients(ingredients.map(ing => {
        if (ing.id === id) {
          setShowResults(false);
          return { ...ing, name: selected.name, costPerUnit: selected.price, unit: selected.unit };
        }
        return ing;
      }));
    }
  };

  const handlePortionsChange = (val) => {
    if (val.length > 12) val = val.slice(0, 12);
    setPortions(val);
    setShowResults(false);
  };

  const handleTargetPriceChange = (val) => {
    if (val.length > 12) val = val.slice(0, 12);
    setTargetPrice(val);
    setShowResults(false);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const totalPortions = Math.max(1, parseInt(portions) || 1);
  const pricePerPortion = parseFloat(targetPrice) || 0;

  const totalRecipeCost = ingredients.reduce((sum, ing) => sum + (ing.qty * ing.costPerUnit), 0);
  const hppPerPortion = totalRecipeCost / totalPortions;
  const revenue = pricePerPortion * totalPortions;
  const netProfit = revenue - totalRecipeCost;
  const profitMargin = pricePerPortion > 0 ? Math.round(((pricePerPortion - hppPerPortion) / pricePerPortion) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* Left Side: Recipe Editor Grid */}
        <div className="lg:col-span-8 space-y-6 w-full">
          <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8] w-full">
            <div className="flex justify-between items-center border-b border-[#E8E8E8] pb-3">
              <h3 className="font-bold text-sm text-[#171C38] uppercase tracking-wider font-sans">Daftar Bahan Baku Resep</h3>
              <button
                onClick={handleAddIngredient}
                className="text-xs text-[#FF6B1A] font-bold border border-[#FF6B1A]/20 px-3.5 py-1.5 rounded-xl hover:bg-[#FF6B1A]/10 transition-all press-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" />Tambah Bahan
              </button>
            </div>

            {/* List Rows */}
            <div className="space-y-3.5">
              {ingredients.map((ing) => (
                <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#171C38]/5 p-3 rounded-xl border border-[#E8E8E8]">
                  {/* Select Commodity or Input Custom Name */}
                  <div className="sm:col-span-4 space-y-1">
                    <select
                      value={COMMON_COMMODITIES.some(c => c.name === ing.name) ? ing.name : 'custom'}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          handleUpdateIngredient(ing.id, 'name', 'Bahan Lain');
                        } else {
                          handleSelectPredefined(ing.id, e.target.value);
                        }
                      }}
                      className="w-full bg-white border border-[#E8E8E8] rounded-lg py-1 px-1.5 text-[11px] font-bold text-[#6F7178]"
                      style={{ colorScheme: 'light' }}
                    >
                      <option value="custom">✏️ Custom Bahan...</option>
                      {COMMON_COMMODITIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    {(!COMMON_COMMODITIES.some(c => c.name === ing.name)) && (
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                        className="w-full bg-white border border-[#E8E8E8] rounded-lg py-1 px-2 text-[10px] font-semibold text-[#171C38] mt-1"
                        placeholder="Nama Bahan"
                      />
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2 flex gap-1 items-center">
                    <input
                      type="number"
                      value={ing.qty}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'qty', e.target.value)}
                      className="w-full bg-white border border-[#E8E8E8] rounded-lg py-1 px-2 text-[10px] font-semibold text-[#171C38] text-center"
                      placeholder="Qty"
                      step="any"
                    />
                    <span className="text-[10px] font-bold text-[#6F7178]">{ing.unit}</span>
                  </div>

                  {/* Price per unit */}
                  <div className="sm:col-span-3 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#6F7178]">Rp</span>
                    <input
                      type="number"
                      value={ing.costPerUnit}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'costPerUnit', e.target.value)}
                      className="w-full bg-white border border-[#E8E8E8] rounded-lg py-1 pl-7 pr-1 text-[10px] font-semibold text-[#171C38]"
                      placeholder="Harga/Unit"
                    />
                  </div>

                  {/* Total Cost of Ingredient */}
                  <div className="sm:col-span-2 text-right">
                    <span className="text-[10px] font-bold text-[#171C38]">{formatRupiah(ing.qty * ing.costPerUnit)}</span>
                  </div>

                  {/* Delete button */}
                  <div className="sm:col-span-1 text-center">
                    <button
                      onClick={() => handleRemoveIngredient(ing.id)}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-100 transition-all press-sm cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Portions & Target Price Form */}
            <div className="border-t border-[#E8E8E8] pt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Jumlah Porsi Per Resep</label>
                <input
                  type="number"
                  value={portions}
                  onChange={(e) => handlePortionsChange(e.target.value)}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 px-3 text-xs font-semibold text-[#171C38]"
                  placeholder="Contoh: 10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171C38]">Harga Jual Target Per Porsi</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F7178]">Rp</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => handleTargetPriceChange(e.target.value)}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-[#171C38]"
                    placeholder="Contoh: 20000"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={() => setShowResults(true)}
              className="w-full bg-[#FF6B1A] hover:bg-[#FF8A3D] text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 press shadow-md hover:shadow-lg mt-4"
            >
              <Calculator className="w-4 h-4" />
              <span>Hitung HPP Resep & Keuntungan</span>
            </button>

          </div>
        </div>

        {/* Right Side: Analysis Output */}
        <div className="lg:col-span-4 space-y-6 w-full">
          {!showResults ? (
            <div className="glass-card rounded-[20px] p-8 text-center border border-[#E8E8E8] flex flex-col items-center justify-center min-h-[300px] text-[#6F7178] space-y-3">
              <Calculator className="w-12 h-12 stroke-[1.5] text-[#FF6B1A] drop-shadow-[0_0_8px_rgba(255,107,26,0.1)]" />
              <h4 className="font-bold text-sm text-[#171C38]">Analisis Biaya Porsi</h4>
              <p className="text-xs text-[#6F7178] font-semibold max-w-xs leading-relaxed">
                Silakan isi bahan baku dan porsi resep Anda pada editor di sebelah kiri dan klik tombol <b>Hitung HPP Resep & Keuntungan</b> untuk memproses hasil kalkulasi.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-[20px] p-6 space-y-5 shadow-lg border border-[#E8E8E8] w-full text-left animate-slide-in">
              <h4 className="font-bold text-xs text-[#171C38] uppercase tracking-wider border-b border-[#E8E8E8] pb-3 flex items-center gap-1.5">
                <Calculator className="w-4.5 h-4.5 text-[#FF6B1A]" />
                <span>Analisis Biaya Porsi</span>
              </h4>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#6F7178]">Total Modal Resep</span>
                  <span className="text-[#171C38]">{formatRupiah(totalRecipeCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold border-t border-[#E8E8E8] pt-2.5">
                  <span className="text-[#6F7178]">HPP Per Portion</span>
                  <span className="text-xl font-extrabold text-[#FF6B1A] text-glow-orange">{formatRupiah(hppPerPortion)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold border-t border-[#E8E8E8] pt-2.5">
                  <span className="text-[#6F7178]">Harga Jual Target</span>
                  <span className="text-[#171C38]">{formatRupiah(pricePerPortion)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold border-t border-[#E8E8E8] pt-2.5">
                  <span className="text-[#6F7178]">Margin Keuntungan</span>
                  <span className={`font-bold ${profitMargin >= 30 ? 'text-emerald-600' : profitMargin >= 10 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {profitMargin}%
                  </span>
                </div>
              </div>

              <div className="bg-[#171C38]/5 border border-[#E8E8E8] rounded-xl p-3 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#6F7178] font-bold leading-relaxed">
                  {profitMargin >= 30 
                    ? `Sangat menguntungkan! Anda mendapatkan laba bersih sebesar ${formatRupiah(netProfit)} dari total resep ini.`
                    : profitMargin >= 10
                      ? `Margin laba wajar. Usahakan mencari pemasok bahan mentah yang lebih terjangkau untuk meningkatkan profit.`
                      : `Saran AI: Margin di bawah 10% terlalu riskan untuk bisnis kuliner. Naikkan harga jual target atau kurangi takaran bahan baku.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>div>

      </div>
    </div>
  );
}
