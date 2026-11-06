import { PriceSource, PriceStepKind } from '@/api/schema';
import type { ResolvedPrice } from './listings.types';
import { readablePriceExplanation } from './price-explanation';

function price(overrides: Partial<ResolvedPrice>): ResolvedPrice {
  return {
    price: '56.80',
    compareAtPrice: null,
    source: PriceSource.rule,
    steps: [],
    explanation: 'base price = $64.00',
    warnings: [],
    unitCost: null,
    ...overrides,
  };
}

describe('readablePriceExplanation', () => {
  it('rounds a conversion rate to four decimals', () => {
    const converted = price({
      steps: [
        { kind: PriceStepKind.base, label: '$64.00', amount: '64.00' },
        { kind: PriceStepKind.conversion, label: '× 0.887548 (USD → EUR)', amount: '56.80' },
      ],
      explanation: '$64.00 → × 0.887548 (USD → EUR) = €56.80',
    });

    expect(readablePriceExplanation(converted)).toBe('$64.00 → × 0.8875 (USD → EUR) = €56.80');
  });

  it('keeps a short rate as it is', () => {
    const converted = price({
      steps: [{ kind: PriceStepKind.conversion, label: '× 1.1 (USD → EUR)', amount: '70.40' }],
      explanation: '$64.00 → × 1.1 (USD → EUR) = €70.40',
    });

    expect(readablePriceExplanation(converted)).toBe('$64.00 → × 1.1 (USD → EUR) = €70.40');
  });

  it('leaves an explanation without a conversion untouched', () => {
    expect(readablePriceExplanation(price({}))).toBe('base price = $64.00');
  });
});
