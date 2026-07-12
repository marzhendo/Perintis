import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToastProvider } from '../components/Toast';
import HargaPangan from './HargaPangan';

function WrapHargaPangan() {
  return (
    <ToastProvider>
      <HargaPangan />
    </ToastProvider>
  );
}

describe('HargaPangan Component', () => {
  it('renders commodities and lists them', async () => {
    render(<WrapHargaPangan />);
    await waitFor(() => {
      expect(screen.getAllByText('Beras Kualitas Bawah I')[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText('Cabai Rawit Merah')[0]).toBeInTheDocument();
  });

  it('filters commodity list based on search input', async () => {
    render(<WrapHargaPangan />);
    await waitFor(() => {
      expect(screen.getAllByText('Beras Kualitas Bawah I')[0]).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Cari komoditas...');
    fireEvent.change(searchInput, { target: { value: 'Cabai' } });
    
    expect(screen.getAllByText('Cabai Rawit Merah')[0]).toBeInTheDocument();
    expect(screen.queryByText('Beras Kualitas Bawah I')).not.toBeInTheDocument();
  });
});
