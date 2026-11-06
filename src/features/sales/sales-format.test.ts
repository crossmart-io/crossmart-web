import { SalesInterval } from '@/api/schema';
import {
  ChangeDirection,
  formatBucket,
  hasSales,
  toLocalDate,
  toPeriodChange,
  toSharePercent,
} from './sales-format';

describe('toPeriodChange', () => {
  it('rounds the change against the previous period', () => {
    expect(toPeriodChange(150, 100)).toEqual({ direction: ChangeDirection.Up, percent: 50 });
    expect(toPeriodChange(66, 100)).toEqual({ direction: ChangeDirection.Down, percent: 34 });
  });

  it('reads tiny changes as flat', () => {
    expect(toPeriodChange(1000.4, 1000).direction).toBe(ChangeDirection.Flat);
  });

  it('calls a period new when the previous one had nothing', () => {
    expect(toPeriodChange(20, 0)).toEqual({ direction: ChangeDirection.New, percent: null });
    expect(toPeriodChange(0, 0).direction).toBe(ChangeDirection.Flat);
  });
});

describe('report days', () => {
  it('reads a report day as that local calendar day', () => {
    const day = toLocalDate('2026-03-29');
    expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([2026, 2, 29]);
  });

  it('names months with their year', () => {
    expect(formatBucket('2026-11-01', SalesInterval.month)).toMatch(/2026/);
  });
});

describe('toSharePercent', () => {
  it('is zero when there is no whole', () => {
    expect(toSharePercent(5, 0)).toBe(0);
    expect(toSharePercent(25, 200)).toBe(13);
  });
});

describe('hasSales', () => {
  const bucket = {
    startsOn: '2026-11-01',
    previousStartsOn: '2026-10-01',
    orders: 0,
    byConnection: [],
  };

  it('is false when neither period sold anything', () => {
    expect(hasSales({ buckets: [] })).toBe(false);
    expect(hasSales({ buckets: [{ ...bucket, sales: '0.00', previousSales: '0.00' }] })).toBe(
      false,
    );
  });

  it('is true when either period sold something', () => {
    expect(hasSales({ buckets: [{ ...bucket, sales: '0.00', previousSales: '12.00' }] })).toBe(
      true,
    );
  });
});
