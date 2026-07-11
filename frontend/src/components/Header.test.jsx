import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders brand name and menu links', () => {
    render(<Header activeTab="home" setActiveTab={() => {}} />);
    expect(screen.getByText('Perintis')).toBeInTheDocument();
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Pantau Harga')).toBeInTheDocument();
  });

  it('triggers setActiveTab when navigation links are clicked', () => {
    const setActiveTab = vi.fn();
    render(<Header activeTab="home" setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Pantau Harga'));
    expect(setActiveTab).toHaveBeenCalledWith('harga');
  });

  it('displays user initials when logged in', () => {
    const user = { name: 'Fatir Gibran', email: 'fatir@gmail.com' };
    render(<Header activeTab="home" setActiveTab={() => {}} user={user} />);
    expect(screen.getByText('FG')).toBeInTheDocument();
  });
});
