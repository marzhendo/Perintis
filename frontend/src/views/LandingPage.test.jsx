import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage Component', () => {
  it('renders hero heading with editorial style', () => {
    render(<LandingPage setActiveTab={() => {}} />);
    expect(screen.getAllByText(/Perintis/).length).toBeGreaterThan(0);
  });

  it('renders CTA buttons that navigate to features', () => {
    const setActiveTab = vi.fn();
    render(<LandingPage setActiveTab={setActiveTab} />);
    const ctaButton = screen.getByText('Mulai Sekarang');
    fireEvent.click(ctaButton);
    expect(setActiveTab).toHaveBeenCalledWith('validator');
  });

  it('renders features section with benefit cards', () => {
    render(<LandingPage setActiveTab={() => {}} />);
    expect(screen.getByText('Validasi Ide Bisnis AI')).toBeInTheDocument();
    expect(screen.getByText('Simulasi Finansial Presisi')).toBeInTheDocument();
    expect(screen.getByText('Forum Diskusi Terbuka')).toBeInTheDocument();
  });
});
