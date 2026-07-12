import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastProvider } from '../components/Toast';
import Validator from './Validator';
import * as validatorApi from '../services/validatorApi';

vi.mock('../services/validatorApi', () => ({
  validateBusiness: vi.fn(() => Promise.resolve({
    score: 4.5,
    verdict: 'Sangat Layak',
    market: 'Pasar sangat potensial di Jawa Barat.',
    competitor: 'Kompetisi moderat.',
    trend: 'Tren positif.',
    risk: 'Risiko rendah.',
    potential: 'Potensi tinggi.',
  })),
  getFallbackResult: vi.fn(),
}));

vi.mock('../services/areaService', () => ({
  getProvinsi: vi.fn(() => Promise.resolve([
    { id: '31', nama: 'DKI JAKARTA' },
    { id: '32', nama: 'JAWA BARAT' },
  ])),
  getKabupaten: vi.fn((provId) => {
    if (provId === '32') {
      return Promise.resolve([
        { id: '3275', nama: 'KOTA BEKASI' },
      ]);
    }
    return Promise.resolve([]);
  }),
  getKecamatan: vi.fn((kabId) => {
    if (kabId === '3275') {
      return Promise.resolve([
        { id: '3275010', nama: 'JATIASIH' },
      ]);
    }
    return Promise.resolve([]);
  }),
}));

describe('Validator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Validator form and validates business idea with location', async () => {
    render(
      <ToastProvider>
        <Validator
          validationData={null}
          setValidationData={vi.fn()}
          selectedRegion="JAWA BARAT, KOTA BEKASI, JATIASIH"
          setSelectedRegion={vi.fn()}
        />
      </ToastProvider>
    );

    // Verify location is set to JAWA BARAT by default since selectedRegion is JAWA BARAT
    await waitFor(() => {
      const provSelect = screen.getByLabelText(/Provinsi/i);
      expect(provSelect.value).toBe('JAWA BARAT');
    });

    await waitFor(() => {
      const kabSelect = screen.getByLabelText(/Kabupaten\/Kota/i);
      expect(kabSelect.value).toBe('KOTA BEKASI');
    });

    await waitFor(() => {
      const kecSelect = screen.getByLabelText(/Kecamatan/i);
      expect(kecSelect.value).toBe('JATIASIH');
    });

    // Enter business description
    const descInput = screen.getByPlaceholderText(/Jelaskan produk\/layanan/i);
    fireEvent.change(descInput, { target: { value: 'Warung Nasi Bebek Gurih Khas Sunda' } });

    // Click analyze button
    const submitBtn = screen.getByRole('button', { name: /Analisa/i });
    fireEvent.click(submitBtn);

    // Verify validateBusiness was called with form including location
    await waitFor(() => {
      expect(validatorApi.validateBusiness).toHaveBeenCalledWith(expect.objectContaining({
        location: 'JAWA BARAT, KOTA BEKASI, JATIASIH',
        description: 'Warung Nasi Bebek Gurih Khas Sunda',
      }));
    });
  });
});
