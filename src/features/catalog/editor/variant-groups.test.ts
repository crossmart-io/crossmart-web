import {
  buildVariantGridView,
  groupVariants,
  matchesVariantFilter,
  priceRangeOf,
  shouldGroupVariants,
  totalStockOf,
  type VariantSummaryFields,
} from './variant-groups';
import { MAX_UNGROUPED_VARIANTS, MIN_FILTERABLE_VARIANTS } from './variants.constants';

function variant(optionValues: string[], price = '10.00', quantity = '1'): VariantSummaryFields {
  return { optionValues, price, quantity };
}

/** Every color in every size, color first. */
function grid(colors: string[], sizes: string[]): VariantSummaryFields[] {
  return colors.flatMap((color) => sizes.map((size) => variant([color, size])));
}

describe('shouldGroupVariants', () => {
  it('groups only many variants of two or more options', () => {
    expect(shouldGroupVariants(2, MAX_UNGROUPED_VARIANTS)).toBe(false);
    expect(shouldGroupVariants(2, MAX_UNGROUPED_VARIANTS + 1)).toBe(true);
    expect(shouldGroupVariants(1, 50)).toBe(false);
  });
});

describe('matchesVariantFilter', () => {
  it('matches every word anywhere in the options, ignoring case', () => {
    expect(matchesVariantFilter(['Red', 'XL'], 'red xl')).toBe(true);
    expect(matchesVariantFilter(['Red', 'XL'], '  xl  ')).toBe(true);
    expect(matchesVariantFilter(['Red', 'XL'], 'blue xl')).toBe(false);
    expect(matchesVariantFilter(['Red', 'XL'], '')).toBe(true);
  });
});

describe('priceRangeOf', () => {
  it('compares prices as numbers and skips the ones not typed yet', () => {
    expect(priceRangeOf(['9.50', '', '12', '100.00', 'abc'])).toEqual({
      min: '9.50',
      max: '100.00',
    });
    expect(priceRangeOf(['', ' '])).toBeNull();
  });
});

describe('totalStockOf', () => {
  it('adds the whole numbers and counts a half-typed one as none', () => {
    expect(totalStockOf(['3', ' 4 ', '', '2.5', '-1'])).toBe(6);
  });
});

describe('groupVariants', () => {
  it('groups by the first option in the order values first appear, with a summary', () => {
    const variants = [
      variant(['Red', 'S'], '10.00', '2'),
      variant(['Blue', 'S'], '8.00', '1'),
      variant(['Red', 'M'], '12.00', '5'),
    ];

    expect(groupVariants(variants, [0, 1, 2])).toEqual([
      { value: 'Red', indices: [0, 2], priceRange: { min: '10.00', max: '12.00' }, totalStock: 7 },
      { value: 'Blue', indices: [1], priceRange: { min: '8.00', max: '8.00' }, totalStock: 1 },
    ]);
  });

  it('summarises only the given variants', () => {
    const variants = [variant(['Red', 'S'], '10.00', '2'), variant(['Red', 'M'], '12.00', '5')];

    expect(groupVariants(variants, [1])).toEqual([
      { value: 'Red', indices: [1], priceRange: { min: '12.00', max: '12.00' }, totalStock: 5 },
    ]);
  });
});

describe('buildVariantGridView', () => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  it('keeps a few variants flat and unfiltered', () => {
    const view = buildVariantGridView(grid(['Red', 'Blue'], sizes), 2, 'red');

    expect(view).toMatchObject({ grouped: false, filterable: false, groups: [] });
    expect(view.visibleIndices).toHaveLength(10);
  });

  it('keeps a single option flat however many values it has', () => {
    const variants = Array.from({ length: MIN_FILTERABLE_VARIANTS }, (_, index) =>
      variant([`Size ${index}`]),
    );
    const view = buildVariantGridView(variants, 1, '');

    expect(view.grouped).toBe(false);
    expect(view.filterable).toBe(true);
  });

  it('groups and filters a big product', () => {
    const variants = grid(['Red', 'Blue', 'Green', 'Black'], sizes);
    const view = buildVariantGridView(variants, 2, 'xl');

    expect(view).toMatchObject({ grouped: true, filterable: true });
    expect(view.visibleIndices).toEqual([4, 9, 14, 19]);
    expect(view.groups.map((group) => [group.value, group.indices])).toEqual([
      ['Red', [4]],
      ['Blue', [9]],
      ['Green', [14]],
      ['Black', [19]],
    ]);
  });

  it('drops groups with no match', () => {
    const view = buildVariantGridView(grid(['Red', 'Blue', 'Green', 'Black'], sizes), 2, 'blue');

    expect(view.groups.map((group) => group.value)).toEqual(['Blue']);
  });
});
