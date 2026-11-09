import { totalValue } from '../decimalFunction';

describe('decimalFunction - totalValue', () => {
  it('formats whole numbers without decimal digits in Indian numbering format', () => {
    expect(totalValue(100)).toBe('100');
    expect(totalValue(1000)).toBe('1,000');
    expect(totalValue(100000)).toBe('1,00,000');
    expect(totalValue(10000000)).toBe('1,00,00,000');
  });

  it('formats string inputs correctly', () => {
    expect(totalValue('2500')).toBe('2,500');
    expect(totalValue('99999.99')).toBe('1,00,000');
    expect(totalValue('49.50')).toBe('50');
  });

  it('handles zero correctly', () => {
    expect(totalValue(0)).toBe('0');
    expect(totalValue('0')).toBe('0');
  });

  it('rounds floating point numbers to the nearest whole integer', () => {
    expect(totalValue(1234.4)).toBe('1,234');
    expect(totalValue(1234.6)).toBe('1,235');
  });
});

