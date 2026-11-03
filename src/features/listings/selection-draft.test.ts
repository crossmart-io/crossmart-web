import { ProductStatus } from '@/api/schema';
import { SelectionMode } from './listings.constants';
import {
  excludeProduct,
  includeProduct,
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
