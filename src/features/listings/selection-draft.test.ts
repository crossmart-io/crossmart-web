import { ProductStatus } from '@/api/schema';
import { SelectionMode } from './listings.constants';
import {
  describeSelection,
  excludeProduct,
  includeProduct,
  toggleProductInRule,
  toSelectionDraft,
  toSelectionRule,
} from './selection-draft';

describe('selection draft', () => {
  it('reads no rule and an empty filter as all products', () => {
    expect(toSelectionDraft(null).mode).toBe(SelectionMode.All);
    expect(
      toSelectionDraft({ filter: {}, includeProductIds: [], excludeProductIds: ['p'] }).mode,
    ).toBe(SelectionMode.All);
  });

  it('round-trips filters, and a null filter as hand-picked products', () => {
    const filtered = {
      filter: { status: ProductStatus.ACTIVE, tags: ['summer'], vendor: 'Acme' },
      includeProductIds: ['a'],
      excludeProductIds: ['b'],
    };
    const picked = { filter: null, includeProductIds: ['a'], excludeProductIds: [] };

    expect(toSelectionRule(toSelectionDraft(filtered))).toEqual(filtered);
    expect(toSelectionDraft(picked).mode).toBe(SelectionMode.Picked);
    expect(toSelectionRule(toSelectionDraft(picked))).toEqual(picked);
  });

  it('moves products between the manual lists', () => {
    const draft = toSelectionDraft({ filter: {}, includeProductIds: ['a'], excludeProductIds: [] });

    const excluded = excludeProduct(draft, 'a');
    const restored = includeProduct(excluded, 'a');

    expect(excluded).toMatchObject({ includeProductIds: [], excludeProductIds: ['a'] });
    expect(restored).toMatchObject({ includeProductIds: ['a'], excludeProductIds: [] });
  });
});

describe('toggleProductInRule', () => {
  it('removes a product from “every product” by hand, keeping the rest', () => {
    expect(toggleProductInRule(null, 'p-1', false)).toMatchObject({
      includeProductIds: [],
      excludeProductIds: ['p-1'],
    });
  });

  it('adds a removed product back', () => {
    const rule = {
      filter: { tags: ['summer'] },
      includeProductIds: [],
      excludeProductIds: ['p-1'],
    };

    expect(toggleProductInRule(rule, 'p-1', true)).toMatchObject({
      filter: { tags: ['summer'] },
      includeProductIds: ['p-1'],
      excludeProductIds: [],
    });
  });
});

describe('describeSelection', () => {
  it.each([
    [null, 'All products'],
    [
      { filter: { tags: ['summer'] }, includeProductIds: ['a'], excludeProductIds: ['b', 'c'] },
      'Products matching filters · 1 product added by hand · 2 products removed by hand',
    ],
    [
      { filter: null, includeProductIds: ['a', 'b'], excludeProductIds: [] },
      'Only products I pick · 2 products',
    ],
  ])('sums up %j', (rule, expected) => {
    expect(describeSelection(rule)).toBe(expected);
  });
});
