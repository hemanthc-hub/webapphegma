// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window globals not supported in jsdom
window.scrollTo = jest.fn();

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock tesseract.js worker
jest.mock('tesseract.js', () => ({
  createWorker: jest.fn(async () => ({
    loadLanguage: jest.fn(),
    initialize: jest.fn(),
    recognize: jest.fn(async () => ({
      data: { text: '' },
    })),
    terminate: jest.fn(),
  })),
}));

