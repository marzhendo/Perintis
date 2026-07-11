import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToastProvider } from '../components/Toast';
import Calculator from './Calculator';

describe('Calculator Component', () => {
  it('calculates daily net profit correctly', () => {
    render(
      <ToastProvider>
        <Calculator calculationData={null} setCalculationData={() => {}} />
      </ToastProvider>
    );
    
    // Check initial inputs
    const revenueInput = screen.getByLabelText('Perkiraan Penjualan Harian (Rupiah)');
    const materialsInput = screen.getByLabelText('Modal Bahan Baku Jualan Harian');
    const operationalInput = screen.getByLabelText('Biaya Operasional (Listrik, Gas, Air harian)');
    const salaryInput = screen.getByLabelText('Gaji Karyawan Harian');
    
    // Change input values
    fireEvent.change(revenueInput, { target: { value: '600000' } });
    fireEvent.change(materialsInput, { target: { value: '250000' } });
    fireEvent.change(operationalInput, { target: { value: '50000' } });
    fireEvent.change(salaryInput, { target: { value: '100000' } });
    
    // Click button
    fireEvent.click(screen.getByText('Hitung Sekarang'));
    
    // 600,000 - (250,000 + 50,000 + 100,000) = 200,000
    // Check formatted outcome (200.000)
    expect(screen.getByText('200.000')).toBeInTheDocument();
    expect(screen.getByText('Untung')).toBeInTheDocument();
  });
});
