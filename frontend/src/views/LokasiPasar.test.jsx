import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LokasiPasar from './LokasiPasar';
import * as areaService from '../services/areaService';

// Mock Leaflet and React-Leaflet to avoid JSDOM errors
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, position }) => <div data-testid="marker" data-position={JSON.stringify(position)}>{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
  }),
  useMapEvents: vi.fn(),
}));

vi.mock('leaflet', () => {
  return {
    default: {
      Icon: {
        Default: {
          prototype: {},
          mergeOptions: vi.fn(),
        },
      },
      divIcon: vi.fn(() => ({})),
    },
  };
});

// Mock areaService functions
vi.mock('../services/areaService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getProvinsi: vi.fn(() => Promise.resolve([
      { id: '31', nama: 'DKI JAKARTA' },
      { id: '32', nama: 'JAWA BARAT' },
    ])),
    getKabupaten: vi.fn((provId) => {
      if (provId === '32') {
        return Promise.resolve([
          { id: '3275', nama: 'KOTA BEKASI' },
          { id: '3216', nama: 'KABUPATEN BEKASI' },
        ]);
      }
      return Promise.resolve([]);
    }),
    getKecamatan: vi.fn(() => Promise.resolve([
      { id: '3275010', nama: 'JATIASIH' },
    ])),
    getKelurahan: vi.fn(() => Promise.resolve([
      { id: '3275010001', nama: 'JAKA SETIA' },
    ])),
    getAddressFromLatLng: vi.fn((lat, lng) => {
      if (lat === -6.23 && lng === 106.99) {
        return Promise.resolve({
          state: 'Jawa Barat',
          city: 'Kota Bekasi',
          suburb: 'Jatiasih',
          village: 'Jaka Setia',
        });
      }
      return Promise.resolve(null);
    }),
  };
});

describe('LokasiPasar Component Geolocation and Accuracy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tests cleanName utility function', () => {
    expect(areaService.cleanName('Daerah Khusus Ibukota Jakarta')).toBe('dki jakarta');
    expect(areaService.cleanName('Kota Bekasi')).toBe('bekasi');
    expect(areaService.cleanName('Kabupaten Bogor')).toBe('bogor');
    expect(areaService.cleanName('Kecamatan Jatiasih')).toBe('jatiasih');
    expect(areaService.cleanName('Kelurahan Jaka Setia')).toBe('jaka setia');
    expect(areaService.cleanName('Kepulauan Riau')).toBe('kep riau');
  });

  it('tests findBestMatch utility function with city vs county', () => {
    const kabs = [
      { id: '3216', nama: 'KABUPATEN BEKASI' },
      { id: '3275', nama: 'KOTA BEKASI' },
    ];
    // Kota Bekasi should match KOTA BEKASI
    const matchKota = areaService.findBestMatch(kabs, 'Kota Bekasi');
    expect(matchKota.id).toBe('3275');

    // Kabupaten Bekasi should match KABUPATEN BEKASI
    const matchKab = areaService.findBestMatch(kabs, 'Kabupaten Bekasi');
    expect(matchKab.id).toBe('3216');
  });

  it('detects user location and auto-selects administrative levels on mount', async () => {
    // Mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            latitude: -6.23,
            longitude: 106.99,
          },
        });
      }),
    };
    global.navigator.geolocation = mockGeolocation;

    const setSelectedRegion = vi.fn();
    
    await act(async () => {
      render(<LokasiPasar setSelectedRegion={setSelectedRegion} onNavigate={vi.fn()} />);
    });

    // Check if the province was matched and the callback was called
    await waitFor(() => {
      expect(setSelectedRegion).toHaveBeenCalledWith('JAWA BARAT, KOTA BEKASI, JATIASIH');
    });

    // Check if the UI breadcrumb displays the resolved hierarchy
    await waitFor(() => {
      expect(screen.getByText(/JAWA BARAT › KOTA BEKASI › JATIASIH/i)).toBeInTheDocument();
    });

    // Check if the village list shows "JAKA SETIA"
    await waitFor(() => {
      expect(screen.getByText('JAKA SETIA')).toBeInTheDocument();
    });
  });

  it('allows manual location selection using dropdowns', async () => {
    // Disable auto geolocation for this test to focus on manual select
    global.navigator.geolocation = null;

    const setSelectedRegion = vi.fn();
    
    await act(async () => {
      render(<LokasiPasar setSelectedRegion={setSelectedRegion} onNavigate={vi.fn()} />);
    });

    // Switch to manual mode
    const manualTabBtn = screen.getByRole('button', { name: /Pilih Manual/i });
    fireEvent.click(manualTabBtn);

    // Verify manual title
    expect(screen.getByText('Pilih Wilayah Manual')).toBeInTheDocument();

    // Select province
    const provSelect = screen.getByLabelText('Provinsi');
    fireEvent.change(provSelect, { target: { value: 'JAWA BARAT' } });

    // Verify selectedRegion updated to province
    await waitFor(() => {
      expect(setSelectedRegion).toHaveBeenCalledWith('JAWA BARAT');
    });

    // Select kabupaten
    const kabSelect = await screen.findByLabelText('Kabupaten/Kota');
    fireEvent.change(kabSelect, { target: { value: 'KOTA BEKASI' } });

    await waitFor(() => {
      expect(setSelectedRegion).toHaveBeenCalledWith('JAWA BARAT, KOTA BEKASI');
    });
  });
});
