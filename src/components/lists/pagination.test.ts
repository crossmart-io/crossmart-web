import {
  DEFAULT_PAGE_SIZE,
  PAGE_GAP,
  pageCountOf,
  pageLinksOf,
  rowRangeOf,
  toPageNumber,
  toPageSize,
} from './pagination';

describe('pagination', () => {
  it('links every page of a short list', () => {
    expect(pageLinksOf(1, 1)).toEqual([1]);
    expect(pageLinksOf(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('skips pages far from the current one, but never just one', () => {
    expect(pageLinksOf(1, 20)).toEqual([1, 2, PAGE_GAP, 20]);
    expect(pageLinksOf(10, 20)).toEqual([1, PAGE_GAP, 9, 10, 11, PAGE_GAP, 20]);
    expect(pageLinksOf(4, 20)).toEqual([1, 2, 3, 4, 5, PAGE_GAP, 20]);
  });

  it('counts pages and the rows a page shows', () => {
    expect(pageCountOf(0, 25)).toBe(1);
    expect(pageCountOf(51, 25)).toBe(3);
    expect(rowRangeOf(2, 25, 40)).toEqual({ first: 26, last: 40 });
    expect(rowRangeOf(1, 25, 0)).toEqual({ first: 0, last: 0 });
  });

  it('reads the page and page size from the URL, falling back to the defaults', () => {
    expect(toPageNumber('3')).toBe(3);
    expect(toPageNumber('0')).toBe(1);
    expect(toPageNumber('abc')).toBe(1);
    expect(toPageSize('50')).toBe(50);
    expect(toPageSize('7')).toBe(DEFAULT_PAGE_SIZE);
  });
});
