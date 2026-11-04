import { SalesInterval } from '@/api/schema';
import {
  ChangeDirection,
  formatBucket,
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
