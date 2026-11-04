import { formatDayHeading, formatRelativeTime, toLocalDayKey } from './relative-time';

const NOW = new Date(2026, 10, 2, 15, 0, 0);

describe('formatRelativeTime', () => {
  it('picks the largest unit the time fills', () => {
    expect(formatRelativeTime(new Date(2026, 10, 2, 14, 55), NOW)).toBe('5 minutes ago');
    expect(formatRelativeTime(new Date(2026, 10, 2, 12, 0), NOW)).toBe('3 hours ago');
    expect(formatRelativeTime(new Date(2026, 10, 1, 15, 0), NOW)).toBe('yesterday');
  });

  it('says now for this very moment', () => {
    expect(formatRelativeTime(NOW, NOW)).toBe('now');
  });
});

describe('formatDayHeading', () => {
  it('names today and yesterday, and dates older days', () => {
    expect(formatDayHeading(new Date(2026, 10, 2, 9), NOW)).toBe('Today');
    expect(formatDayHeading(new Date(2026, 10, 1, 23), NOW)).toBe('Yesterday');
    expect(formatDayHeading(new Date(2026, 9, 28), NOW)).toContain('October 28');
    expect(formatDayHeading(new Date(2025, 9, 28), NOW)).toContain('2025');
  });
});

describe('toLocalDayKey', () => {
  it('uses the local calendar day', () => {
    expect(toLocalDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
