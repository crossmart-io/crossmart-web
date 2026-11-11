import {
  formatAlternatives,
  formatAmount,
  formatList,
  formatMinorUnits,
  formatPriceRange,
  pluralize,
} from './format';

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

describe('formatAlternatives', () => {
  it('joins choices with "or" and no serial comma', () => {
    expect(formatAlternatives(['Shopify', 'eBay', 'Google'])).toBe('Shopify, eBay or Google');
    expect(formatAlternatives(['Shopify'])).toBe('Shopify');
  });
});

describe('formatMinorUnits', () => {
  it('reads minor units with the currency’s own decimals, whatever its case', () => {
    expect(formatMinorUnits(2900, 'usd')).toMatch(/29[.,]00/);
    expect(formatMinorUnits(2300, 'USD')).toMatch(/23[.,]00/);
    expect(formatMinorUnits(500, 'jpy')).toMatch(/500/);
  });
});

describe('formatList', () => {
  it('joins items with "and" and no serial comma', () => {
    expect(formatList(['Shopify', 'eBay', 'Google'])).toBe('Shopify, eBay and Google');
    expect(formatList(['eBay'])).toBe('eBay');
  });
});
