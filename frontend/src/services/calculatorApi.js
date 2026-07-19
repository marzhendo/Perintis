const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perintis-backend.koyeb.app';

export async function calculateBep(input) {
  const response = await fetch(`${BASE_URL}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modal_awal: input.capital,
      biaya_operasional_bulanan: input.monthlyOp,
      harga_jual_per_unit: input.sellingPrice,
      bahan_baku_per_unit: input.materialCost,
    }),
  });

  if (!response.ok) throw new Error('API Error');

  const data = await response.json();
  
  const margin = input.sellingPrice - input.materialCost;
  const bepUnits = margin > 0 ? Math.ceil(input.monthlyOp / margin) : 0;
  const targetSales = bepUnits * 1.5;
  const monthlyProfit = margin > 0 ? (targetSales * margin) - input.monthlyOp : 0;
  const fallbackRoi = monthlyProfit > 0 ? parseFloat((input.capital / monthlyProfit).toFixed(1)) : 0;

  return {
    hpp: data.hpp_per_unit ?? input.materialCost,
    margin: data.margin_per_unit ?? margin,
    bepUnits: data.bep_unit_per_bulan ?? bepUnits,
    roiMonths: data.estimasi_balik_modal_bulan ?? (fallbackRoi || 6.7),
  };
}

export function getFallbackResult(input) {
  const margin = input.sellingPrice - input.materialCost;
  const bepUnits = margin > 0 ? Math.ceil(input.monthlyOp / margin) : 0;
  const targetSales = bepUnits * 1.5;
  const monthlyProfit = margin > 0 ? (targetSales * margin) - input.monthlyOp : 0;
  const roiMonths = monthlyProfit > 0 ? parseFloat((input.capital / monthlyProfit).toFixed(1)) : 0;

  return {
    hpp: input.materialCost,
    margin,
    bepUnits,
    roiMonths: roiMonths || 6.7,
  };
}
