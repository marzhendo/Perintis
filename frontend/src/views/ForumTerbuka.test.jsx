import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForumTerbuka from './ForumTerbuka';

vi.mock('../services/apiClient', () => ({
  fetchApi: vi.fn((endpoint) => {
    if (endpoint === '/api/forum/threads') {
      return Promise.resolve([
        {
          id: 1,
          title: 'Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?',
          author: { name: 'Budi', badge: 'Ahli' },
          category: 'Kuliner',
          created_at: '2026-07-11T12:00:00Z',
          content: 'Snippet...',
          likes_count: 18,
          comments_count: 2,
          is_liked_by_me: false
        },
        {
          id: 2,
          title: 'Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?',
          author: { name: 'Siti', badge: 'Aktif' },
          category: 'Bahan Baku',
          created_at: '2026-07-11T12:00:00Z',
          content: 'Snippet...',
          likes_count: 12,
          comments_count: 1,
          is_liked_by_me: false
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
    
    await waitFor(() => {
      expect(screen.getByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).toBeInTheDocument();
    });

    // Click category button "Bahan Baku" specifically
    fireEvent.click(screen.getByRole('button', { name: 'Bahan Baku' }));
    
    await waitFor(() => {
      expect(screen.getByText('Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?')).toBeInTheDocument();
      expect(screen.queryByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).not.toBeInTheDocument();
    });
  });
});
