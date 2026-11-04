export const FIRST_PAGE = 1;
/** Rows per page a table offers. */
export enum PageSize {
  Small = 10,
  Medium = 25,
  Large = 50,
  Largest = 100,
}
export const PAGE_SIZE_OPTIONS: readonly PageSize[] = [
  PageSize.Small,
  PageSize.Medium,
  PageSize.Large,
  PageSize.Largest,
];
export const DEFAULT_PAGE_SIZE = PageSize.Medium;
/** Page links shown on each side of the current page, before the gap to the first or last. */
const SIBLING_PAGES = 1;

/** Pages this far apart have exactly one page between them, which is shown, not skipped. */
const ONE_PAGE_APART = 2;

/** Where the page links skip pages ("1 … 4 5 6 … 20"). */
export const PAGE_GAP = 'gap';
export type PageLink = number | typeof PAGE_GAP;

export function toPageSize(value: string | null): PageSize {
  return PAGE_SIZE_OPTIONS.find((size) => String(size) === value) ?? DEFAULT_PAGE_SIZE;
}

export function toPageNumber(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
}

/** At least one page, so an empty list still reads "page 1 of 1". */
export function pageCountOf(total: number, pageSize: number): number {
  return Math.max(FIRST_PAGE, Math.ceil(total / pageSize));
}

/** The 1-based positions of the first and last rows on the page ("26–50 of 312"). */
export function rowRangeOf(page: number, pageSize: number, total: number) {
  if (total === 0) return { first: 0, last: 0 };
  return { first: (page - 1) * pageSize + 1, last: Math.min(page * pageSize, total) };
}

/**
 * The first and last pages, the current one and its neighbours, with a gap wherever pages are
 * skipped. A gap would hide a single page, so that page is shown instead.
 */
export function pageLinksOf(current: number, pageCount: number): PageLink[] {
  const shown = new Set([FIRST_PAGE, pageCount]);
  for (let page = current - SIBLING_PAGES; page <= current + SIBLING_PAGES; page += 1) {
    if (page >= FIRST_PAGE && page <= pageCount) shown.add(page);
  }
  const links: PageLink[] = [];
  let previous = 0;
  for (const page of [...shown].sort((left, right) => left - right)) {
    if (page - previous === ONE_PAGE_APART) links.push(previous + 1);
    else if (page - previous > ONE_PAGE_APART) links.push(PAGE_GAP);
    links.push(page);
    previous = page;
  }
  return links;
}
