import { useState } from 'react';

export default function useAppData() {
  const [validationData, setValidationData] = useState(null);
  const [calculationData, setCalculationData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  return { validationData, setValidationData, calculationData, setCalculationData, selectedRegion, setSelectedRegion };
}
