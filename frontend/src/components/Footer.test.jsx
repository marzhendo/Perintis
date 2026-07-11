import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders brand name and navigation links', () => {
    render(<Footer setActiveTab={() => {}} />);
    expect(screen.getAllByText(/Perintis/).length).toBeGreaterThan(0);
  });

  it('renders feature links that navigate on click', () => {
    const setActiveTab = vi.fn();
    render(<Footer setActiveTab={setActiveTab} />);
    const link = screen.getByText('Validasi Ide Bisnis AI');
    fireEvent.click(link);
    expect(setActiveTab).toHaveBeenCalledWith('validator');
  });
});
