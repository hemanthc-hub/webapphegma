import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders splash screen initially and then transitions to main app', () => {
    render(<App />);
    expect(screen.getByRole('status', { name: /loading hegmakart/i })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2100);
    });

    expect(screen.queryByRole('status', { name: /loading hegmakart/i })).not.toBeInTheDocument();
  });
});
