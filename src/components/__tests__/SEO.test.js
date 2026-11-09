import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../SEO';

describe('SEO Component', () => {
  it('renders Helmet meta tags with default name', () => {
    const helmetContext = {};

    render(
      <HelmetProvider context={helmetContext}>
        <SEO
          title="Buy Dental Supplies Online | Hegmakart"
          description="Best dental and medical equipment in India"
          keywords="dental, clinic, supplies"
        />
      </HelmetProvider>
    );

    const { helmet } = helmetContext;
    expect(helmet).toBeDefined();
    expect(helmet.title.toString()).toContain('Buy Dental Supplies Online | Hegmakart');
    expect(helmet.meta.toString()).toContain('Best dental and medical equipment in India');
    expect(helmet.meta.toString()).toContain('dental, clinic, supplies');
  });

  it('renders custom brand name when provided', () => {
    const helmetContext = {};

    render(
      <HelmetProvider context={helmetContext}>
        <SEO
          title="Custom Page"
          description="Custom Description"
          keywords="test"
          name="Hegmakart Pro"
        />
      </HelmetProvider>
    );

    const { helmet } = helmetContext;
    expect(helmet.meta.toString()).toContain('Hegmakart Pro');
  });
});

