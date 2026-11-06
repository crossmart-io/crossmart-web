import { moneyAmount, optionalCount, optionalMoneyAmount, signedAmount } from './form-schemas';

describe('form schemas', () => {
  it('accepts money amounts with up to two decimals', () => {
    expect(moneyAmount.safeParse(' 19.90 ')).toMatchObject({ success: true, data: '19.90' });
    expect(moneyAmount.safeParse('19.999').success).toBe(false);
    expect(moneyAmount.safeParse('').success).toBe(false);
    expect(moneyAmount.safeParse('-1').success).toBe(false);
  });

  it('lets optional amounts and counts stay empty', () => {
    expect(optionalMoneyAmount.safeParse('').success).toBe(true);
    expect(optionalMoneyAmount.safeParse('abc').success).toBe(false);
    expect(optionalCount.safeParse('').success).toBe(true);
    expect(optionalCount.safeParse('12').success).toBe(true);
    expect(optionalCount.safeParse('1.5').success).toBe(false);
    expect(optionalCount.safeParse('12345678').success).toBe(false);
  });

  it('accepts negative amounts where an adjustment can lower a price', () => {
    expect(signedAmount.safeParse('-2.50').success).toBe(true);
    expect(signedAmount.safeParse('2.505').success).toBe(false);
  });
});
