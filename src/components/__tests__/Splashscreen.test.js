import React from 'react';
import { render, screen } from '@testing-library/react';
import SplashScreen from '../Home/Splashscreen';

describe('SplashScreen Component', () => {
  it('renders splash screen container with accessible role and label', () => {
    render(<SplashScreen />);

    const container = screen.getByRole('status', { name: /loading hegmakart/i });
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('hegma-splash');
  });

  it('renders the Hegmakart logo with correct alt and source', () => {
    render(<SplashScreen />);

    const logo = screen.getByAltText('Hegmakart');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/images/logo3.png');
    expect(logo).toHaveClass('hegma-splash-logo');
  });

  it('renders animated loader spinner element', () => {
    const { container } = render(<SplashScreen />);
    const loader = container.querySelector('.hegma-splash-loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-hidden', 'true');
  });
});

