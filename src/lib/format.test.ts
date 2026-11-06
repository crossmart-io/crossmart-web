import { formatAmount, formatPriceRange, pluralize } from './format';

describe('formatPriceRange', () => {
  it('shows one price when min and max match', () => {
    expect(formatPriceRange({ min: '89.00', max: '89.00' }, 'USD')).not.toContain('–');
  });

  it('shows both ends of a range', () => {
    const formatted = formatPriceRange({ min: '22.00', max: '89.00' }, 'USD');
    expect(formatted).toContain('22');
    expect(formatted).toContain('89');
  });
});

describe('pluralize', () => {
  it('picks the singular for one', () => {
    expect(pluralize(1, 'variant')).toBe('1 variant');
    expect(pluralize(5, 'variant')).toBe('5 variants');
  });
});

describe('formatAmount', () => {
  it('drops the currency symbol and keeps its decimals', () => {
    expect(formatAmount('47.93', 'EUR')).not.toContain('€');
    expect(formatAmount('47.93', 'EUR')).toMatch(/47[.,]93/);
    expect(formatAmount('1200', 'JPY')).toMatch(/^1[,.\s]?200$/);
  });
});
