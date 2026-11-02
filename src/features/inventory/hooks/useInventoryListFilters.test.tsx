import { act, renderHook } from '@testing-library/react';
import { type PropsWithChildren, useEffect } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { StockLevel } from '@/api/schema';
import { ALL_STOCK_LEVELS } from '../stock-level';
import { useInventoryListFilters } from './useInventoryListFilters';

function renderFilters(initialUrl: string) {
  const seen = { search: '' };
  function Probe({ children }: PropsWithChildren) {
    const { search } = useLocation();
    useEffect(() => {
      seen.search = search;
    }, [search]);
    return children;
  }
  const result = renderHook(() => useInventoryListFilters(), {
    wrapper: ({ children }) => {
      const router = createMemoryRouter(
        [{ path: '/inventory', element: <Probe>{children}</Probe> }],
        { initialEntries: [initialUrl] },
      );
      return <RouterProvider router={router} />;
    },
  });
  return { ...result, search: () => seen.search };
}

describe('useInventoryListFilters', () => {
  it('reads the stock level and search from the URL, ignoring unknown levels', () => {
    const { result } = renderFilters('/inventory?q=mug&stock=low_stock');

    expect(result.current.search).toBe('mug');
    expect(result.current.stockLevel).toBe(StockLevel.low_stock);
    expect(result.current.isFiltered).toBe(true);

    const unknown = renderFilters('/inventory?stock=plenty');
    expect(unknown.result.current.stockLevel).toBe(ALL_STOCK_LEVELS);
    expect(unknown.result.current.isFiltered).toBe(false);
  });

  it('writes the stock level to the URL and clears every filter at once', () => {
    const { result, search } = renderFilters('/inventory?q=mug');

    act(() => result.current.setStockLevel(StockLevel.out_of_stock));
    expect(search()).toContain('stock=out_of_stock');

    act(() => result.current.setStockLevel(ALL_STOCK_LEVELS));
    expect(search()).not.toContain('stock=');

    act(() => result.current.clearAll());
    expect(search()).toBe('');
    expect(result.current.search).toBe('');
  });
});
