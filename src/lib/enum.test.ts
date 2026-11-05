import { findOptionValue, isEnumValue, parseEnum, toEnumOptions } from './enum';

enum Fruit {
  Apple = 'apple',
  Pear = 'pear',
}

describe('enum helpers', () => {
  it('recognises only the enum’s values', () => {
    expect(isEnumValue(Fruit, 'pear')).toBe(true);
    expect(isEnumValue(Fruit, 'Pear')).toBe(false);
    expect(isEnumValue(Fruit, null)).toBe(false);
    expect(isEnumValue(Fruit, 1)).toBe(false);
  });

  it('parses a known value and drops anything else', () => {
    expect(parseEnum(Fruit, 'apple')).toBe(Fruit.Apple);
    expect(parseEnum(Fruit, 'plum')).toBeUndefined();
    expect(parseEnum(Fruit, undefined)).toBeUndefined();
  });

  it('builds options from labels and finds an option by its value', () => {
    const options = toEnumOptions({ [Fruit.Apple]: 'Apple', [Fruit.Pear]: 'Pear' });

    expect(options).toEqual([
      { value: Fruit.Apple, label: 'Apple' },
      { value: Fruit.Pear, label: 'Pear' },
    ]);
    expect(findOptionValue(options, 'pear')).toBe(Fruit.Pear);
    expect(findOptionValue(options, 'plum')).toBeUndefined();
  });
});
