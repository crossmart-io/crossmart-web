import { toInstantRange } from './day-range';

describe('toInstantRange', () => {
  it('spans the first day’s start to the last day’s end, in local time', () => {
    const range = toInstantRange({ from: '2026-11-01', to: '2026-11-07' });
    expect(range.from).toBe(new Date(2026, 10, 1).toISOString());
    expect(range.to).toBe(new Date(2026, 10, 7, 23, 59, 59, 999).toISOString());
  });

  it('leaves an open or invalid end out', () => {
    expect(toInstantRange({ to: 'not a day' })).toEqual({ from: undefined, to: undefined });
  });
});
