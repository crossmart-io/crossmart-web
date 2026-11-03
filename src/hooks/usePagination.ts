import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  type PageSize,
  toPageNumber,
  toPageSize,
} from '@/components/lists/pagination';
import { PAGINATION_QUERY } from '@/config/routes';
import { setOrDeleteParam } from '@/lib/search-params';

/** Which page of a table is shown, and how many rows a page has. */
export interface Pagination {
  page: number;
  pageSize: PageSize;
  setPage: (page: number) => void;
  setPageSize: (pageSize: PageSize) => void;
}

/**
 * A page's table pagination, kept in the URL so the back button and shared links return to the
 * same page. Filter changes drop the page (see `useSearchParamsUpdater`), so they start over.
 */
export function useUrlPagination(): Pagination {
  const [searchParams, setSearchParams] = useSearchParams();
  const update = useCallback(
    (page: number, pageSize: string | null) =>
      setSearchParams(
        (params) => {
          setOrDeleteParam(params, PAGINATION_QUERY.page, page === FIRST_PAGE ? '' : String(page));
          if (pageSize !== null) setOrDeleteParam(params, PAGINATION_QUERY.pageSize, pageSize);
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );
  return {
    page: toPageNumber(searchParams.get(PAGINATION_QUERY.page)),
    pageSize: toPageSize(searchParams.get(PAGINATION_QUERY.pageSize)),
    setPage: (page) => update(page, null),
    setPageSize: (pageSize) =>
      update(FIRST_PAGE, pageSize === DEFAULT_PAGE_SIZE ? '' : String(pageSize)),
  };
}

/**
 * Pagination of a table inside a panel, such as a sheet, that the URL does not describe.
 * It starts over at the first page whenever `resetKey` changes (another item is opened).
 */
export function useLocalPagination(resetKey = ''): Pagination {
  const [state, setState] = useState({ page: FIRST_PAGE, key: resetKey });
  const [pageSize, setPageSizeState] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  return {
    page: state.key === resetKey ? state.page : FIRST_PAGE,
    pageSize,
    setPage: (page) => setState({ page, key: resetKey }),
    setPageSize: (size) => {
      setPageSizeState(size);
      setState({ page: FIRST_PAGE, key: resetKey });
    },
  };
}
