import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HargaPangan from './HargaPangan';

describe('HargaPangan Component', () => {
  it('renders commodities and lists them', () => {
    render(<HargaPangan />);
    expect(screen.getAllByText('Beras Premium')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cabai Rawit')[0]).toBeInTheDocument();
  });

  it('filters commodity list based on search input', () => {
    render(<HargaPangan />);
    const searchInput = screen.getByPlaceholderText('Cari komoditas...');
    
    // Search for "Cabai"
    fireEvent.change(searchInput, { target: { value: 'Cabai' } });
    
    expect(screen.getAllByText('Cabai Rawit')[0]).toBeInTheDocument();
    expect(screen.queryByText('Beras Premium')).not.toBeInTheDocument();
  });
});
