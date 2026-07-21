import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForumTerbuka from './ForumTerbuka';
import { fetchApi } from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
  fetchApi: vi.fn().mockImplementation((endpoint, options) => {
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
          author: { id: 1, name: 'Andi', badge: 'Pemilik Kedai' }
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
          author: { id: 2, name: 'Siti', badge: 'Petani' }
        }
      ]);
    }
    if (endpoint.startsWith('/api/forum/threads/') && options?.method === 'DELETE') {
      return Promise.resolve({ status: 'success', message: 'Thread berhasil dihapus' });
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

  it('shows delete button when user is the author and handles delete', async () => {
    const mockUser = { id: 1, name: 'Andi', role: 'user' };
    render(<ForumTerbuka user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).toBeInTheDocument();
    });

    // Andi (id: 1) should see the delete button for their post
    const deleteButtons = screen.getAllByTitle('Hapus Diskusi');
    expect(deleteButtons.length).toBeGreaterThan(0);

    // Mock confirm dialog to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    // Click the delete button
    fireEvent.click(deleteButtons[0]);

    // Check if the thread is removed from DOM after deletion
    await waitFor(() => {
      expect(screen.queryByText('Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?')).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
