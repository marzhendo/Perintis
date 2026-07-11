import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BottomNav from './BottomNav';

describe('BottomNav Component', () => {
  it('renders navigation items', () => {
    render(<BottomNav activeTab="home" setActiveTab={() => {}} />);
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Kalkulator')).toBeInTheDocument();
  });

  it('triggers setActiveTab when a nav item is clicked', () => {
    const setActiveTab = vi.fn();
    render(<BottomNav activeTab="home" setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Kalkulator'));
    expect(setActiveTab).toHaveBeenCalledWith('calculator');
  });
});
