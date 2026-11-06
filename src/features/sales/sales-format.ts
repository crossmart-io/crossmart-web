import type { SalesInterval } from '@/api/schema';
import type { SalesReport } from './sales.types';
import { BUCKET_LABEL_FORMATS, FLAT_CHANGE_PERCENT, PERCENT } from './sales.constants';

export enum ChangeDirection {
  Up = 'up',
  Down = 'down',
  Flat = 'flat',
  /** Nothing to compare with: the previous period had none. */
  New = 'new',
}

export interface PeriodChange {
  direction: ChangeDirection;
  /** Rounded percent, unsigned; null for `New`. */
  percent: number | null;
}

/** How a value moved against the previous period's. */
export function toPeriodChange(current: number, previous: number): PeriodChange {
  if (previous === 0) {
    return current === 0
      ? { direction: ChangeDirection.Flat, percent: 0 }
      : { direction: ChangeDirection.New, percent: null };
  }
  const change = ((current - previous) / previous) * PERCENT;
  if (Math.abs(change) < FLAT_CHANGE_PERCENT)
    return { direction: ChangeDirection.Flat, percent: 0 };
  return {
    direction: change > 0 ? ChangeDirection.Up : ChangeDirection.Down,
    percent: Math.round(Math.abs(change)),
  };
}

/** A report day (`YYYY-MM-DD`, already in the viewer's zone) as a local date. */
export function toLocalDate(day: string): Date {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

const bucketFormats = new Map<SalesInterval, Intl.DateTimeFormat>();

export function formatBucket(day: string, interval: SalesInterval): string {
  let format = bucketFormats.get(interval);
  if (!format) {
    format = new Intl.DateTimeFormat(undefined, BUCKET_LABEL_FORMATS[interval]);
    bucketFormats.set(interval, format);
  }
  return format.format(toLocalDate(day));
}

const compactMoneyFormats = new Map<string, Intl.NumberFormat>();

/** Short amounts for an axis, such as `$1.2K`. */
export function formatCompactMoney(amount: number, currency: string): string {
  let format = compactMoneyFormats.get(currency);
  if (!format) {
    format = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      notation: 'compact',
    });
    compactMoneyFormats.set(currency, format);
  }
  return format.format(amount);
}

/** A part's share of a whole, in whole percent; 0 when the whole is 0. */
export function toSharePercent(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * PERCENT) : 0;
}

/** Whether either period sold anything; with nothing to point at, the chart shows no tooltip. */
export function hasSales(report: Pick<SalesReport, 'buckets'>): boolean {
  return report.buckets.some(
    (bucket) => Number(bucket.sales) > 0 || Number(bucket.previousSales) > 0,
  );
}
