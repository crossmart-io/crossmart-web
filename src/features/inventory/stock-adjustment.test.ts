import { StockAdjustmentMode } from '@/api/schema';
import { MAX_STOCK_QUANTITY } from './inventory.constants';
import { formatDelta, nextOnHand, parseAdjustment, variantLabel } from './stock-adjustment';

describe('parseAdjustment', () => {
  it('accepts whole numbers that keep stock on hand in range', () => {
    expect(parseAdjustment(' 5 ', StockAdjustmentMode.delta, 3)).toBe(5);
    expect(parseAdjustment('-3', StockAdjustmentMode.delta, 3)).toBe(-3);
    expect(parseAdjustment('0', StockAdjustmentMode.set, 3)).toBe(0);
  });

  it('rejects fractions, text, empty deltas and stock below zero or over the limit', () => {
    expect(parseAdjustment('1.5', StockAdjustmentMode.delta, 3)).toBeNull();
    expect(parseAdjustment('ten', StockAdjustmentMode.delta, 3)).toBeNull();
    expect(parseAdjustment('', StockAdjustmentMode.set, 3)).toBeNull();
    expect(parseAdjustment('0', StockAdjustmentMode.delta, 3)).toBeNull();
    expect(parseAdjustment('-4', StockAdjustmentMode.delta, 3)).toBeNull();
    expect(parseAdjustment('-1', StockAdjustmentMode.set, 3)).toBeNull();
    expect(parseAdjustment(String(MAX_STOCK_QUANTITY + 1), StockAdjustmentMode.set, 0)).toBeNull();
  });
});

describe('stock helpers', () => {
  it('previews the stock on hand after an adjustment', () => {
    expect(nextOnHand(10, StockAdjustmentMode.delta, -4)).toBe(6);
    expect(nextOnHand(10, StockAdjustmentMode.set, 4)).toBe(4);
  });

  it('labels variants and signs deltas', () => {
    expect(variantLabel({ optionValues: ['Blue', 'L'] })).toBe('Blue / L');
    expect(variantLabel({ optionValues: [] })).toBeNull();
    expect(formatDelta(12)).toBe('+12');
    expect(formatDelta(-3)).toBe('−3');
  });
});
