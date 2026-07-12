import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForumTerbuka from './ForumTerbuka';

vi.mock('../services/apiClient', () => ({
  fetchApi: vi.fn().mockImplementation((endpoint) => {
    if (endpoint === '/api/forum/threads') {
      return Promise.resolve([
        {
          id: 1,
          title: 'Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?',
          category: 'Kuliner',
          created_at: '2024-10-24T00:00:00Z',
          content: 'Saya ingin membuka usaha kopi susu...',
          likes_count: 5,
          comments_count: 2,
          is_liked_by_me: false,
          author: { name: 'Andi', badge: 'Pemilik Kedai' }
        },
        {
          id: 2,
          title: 'Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?',
          category: 'Bahan Baku',
          created_at: '2024-10-24T00:00:00Z',
          content: 'Harga cabai rawit merah sedang naik...',
          likes_count: 10,
          comments_count: 4,
          is_liked_by_me: false,
          author: { name: 'Siti', badge: 'Petani' }
        }
      ]);
    }
    return Promise.resolve([]);
  })
}));

describe('ForumTerbuka Component', () => {
  it('renders threads and elements', async () => {
    render(<ForumTerbuka />);
    expect(screen.getByText('Forum Terbuka UMKM')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).toBeInTheDocument();
    });
  });

  it('filters threads based on category click', async () => {
    render(<ForumTerbuka />);
    
    // Wait for initial render of threads
    await waitFor(() => {
      expect(screen.getByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).toBeInTheDocument();
    });

    // Click category button "Bahan Baku" specifically
    fireEvent.click(screen.getByRole('button', { name: 'Bahan Baku' }));
    
    await waitFor(() => {
      expect(screen.getByText('Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?')).toBeInTheDocument();
    });
    expect(screen.queryByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).not.toBeInTheDocument();
  });
});

