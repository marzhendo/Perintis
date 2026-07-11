import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ForumTerbuka from './ForumTerbuka';

describe('ForumTerbuka Component', () => {
  it('renders threads and elements', () => {
    render(<ForumTerbuka />);
    expect(screen.getByText('Forum Terbuka UMKM')).toBeInTheDocument();
    expect(screen.getByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).toBeInTheDocument();
  });

  it('filters threads based on category click', () => {
    render(<ForumTerbuka />);
    
    // Click category button "Bahan Baku" specifically
    fireEvent.click(screen.getByRole('button', { name: 'Bahan Baku' }));
    
    expect(screen.getByText('Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?')).toBeInTheDocument();
    expect(screen.queryByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).not.toBeInTheDocument();
  });
});
