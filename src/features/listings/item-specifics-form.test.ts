import { CategoryAspectMode, CategoryAspectUsage } from '@/api/schema';
import {
  groupAspects,
  missingRequired,
  sameItemSpecifics,
  toItemSpecificsBody,
  toItemSpecificValues,
} from './item-specifics-form';
import type { CategoryAspect } from './listings.types';

function aspect(name: string, overrides: Partial<CategoryAspect> = {}): CategoryAspect {
  return {
    name,
    required: false,
    usage: CategoryAspectUsage.recommended,
    mode: CategoryAspectMode.free_text,
    multiple: false,
    values: [],
    ...overrides,
  };
}

const BRAND = aspect('Brand', { required: true });
const MATERIAL = aspect('Material', { required: true });
const COLOR = aspect('Color', { multiple: true });

describe('toItemSpecificValues', () => {
  it('prefills Brand from the vendor when none is saved', () => {
    expect(toItemSpecificValues([BRAND, COLOR], [], ' Acme ')).toEqual({ Brand: ['Acme'] });
    expect(toItemSpecificValues([BRAND], [{ name: 'brand', values: ['Potter'] }], 'Acme')).toEqual({
      brand: ['Potter'],
    });
    expect(toItemSpecificValues([COLOR], [], 'Acme')).toEqual({});
    expect(toItemSpecificValues([BRAND], [], null)).toEqual({});
  });
});

describe('toItemSpecificsBody', () => {
  it('sends trimmed values and leaves out specifics without any', () => {
    expect(toItemSpecificsBody({ Color: [' Blue ', ''], Material: [], Size: ['  '] })).toEqual([
      { name: 'Color', values: ['Blue'] },
    ]);
  });
});

describe('groupAspects and missingRequired', () => {
  it('puts required aspects first and names the empty ones', () => {
    const aspects = [COLOR, BRAND, MATERIAL];

    expect(groupAspects(aspects)).toEqual({ required: [BRAND, MATERIAL], more: [COLOR] });
    expect(missingRequired(aspects, { Brand: ['Acme'], Material: [' '] })).toEqual(['Material']);
  });
});

describe('sameItemSpecifics', () => {
  it('ignores blank values when comparing', () => {
    expect(sameItemSpecifics({ Color: ['Blue', ''] }, { Color: ['Blue'], Size: [] })).toBe(true);
    expect(sameItemSpecifics({ Color: ['Blue'] }, { Color: ['Red'] })).toBe(false);
  });
});
