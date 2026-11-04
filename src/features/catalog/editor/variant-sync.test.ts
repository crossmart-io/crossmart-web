import { combinations, emptyVariant, syncVariants } from './variant-sync';
import type { VariantFormValues } from './product-form.schema';

function variant(id: string, optionValues: string[], price = '10.00'): VariantFormValues {
  return { ...emptyVariant(), id, optionValues, price, sku: `SKU-${id}` };
}

describe('combinations', () => {
  it('multiplies option values in order', () => {
    expect(
      combinations([
        { name: 'Size', values: ['S', 'M'] },
        { name: 'Color', values: ['Oat', 'Moss'] },
      ]),
    ).toEqual([
      ['S', 'Oat'],
      ['S', 'Moss'],
      ['M', 'Oat'],
      ['M', 'Moss'],
    ]);
  });

  it('is one empty combination without options', () => {
    expect(combinations([])).toEqual([[]]);
  });
});

describe('syncVariants', () => {
  it('turns a single variant into the first variant of a new option', () => {
    const rows = syncVariants([{ name: 'Size', values: ['S', 'M'] }], [variant('1', [], '25.00')]);

    expect(rows.map((row) => [row.id, row.optionValues])).toEqual([
      ['1', ['S']],
      [undefined, ['M']],
    ]);
    expect(rows[1]?.price).toBe('25.00');
    expect(rows[1]?.sku).toBe('');
  });

  it('keeps existing variants when a value is added', () => {
    const current = [variant('s', ['S']), variant('m', ['M'])];

    const rows = syncVariants([{ name: 'Size', values: ['S', 'M', 'L'] }], current);

    expect(rows.map((row) => row.id)).toEqual(['s', 'm', undefined]);
  });

  it('drops the variants of a removed value', () => {
    const current = [variant('s', ['S']), variant('m', ['M'])];

    const rows = syncVariants([{ name: 'Size', values: ['M'] }], current);

    expect(rows.map((row) => row.id)).toEqual(['m']);
  });

  it('keeps variants when a second option is added, and again when it is removed', () => {
    const current = [variant('s', ['S']), variant('m', ['M'])];
    const options = [
      { name: 'Size', values: ['S', 'M'] },
      { name: 'Color', values: ['Oat'] },
    ];

    const withColor = syncVariants(options, current);
    expect(withColor.map((row) => [row.id, row.optionValues])).toEqual([
      ['s', ['S', 'Oat']],
      ['m', ['M', 'Oat']],
    ]);

    const withoutColor = syncVariants([{ name: 'Size', values: ['S', 'M'] }], withColor);
    expect(withoutColor.map((row) => row.id)).toEqual(['s', 'm']);
  });
});
