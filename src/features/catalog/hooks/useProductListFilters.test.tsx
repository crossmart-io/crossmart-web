import { act, renderHook } from '@testing-library/react';
import { type PropsWithChildren, useEffect } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { CatalogGap, ProductStatus } from '@/api/schema';
import { ALL_STATUSES } from '../product-status';
import { useProductListFilters } from './useProductListFilters';

function renderFilters(initialUrl: string) {
  const seen = { search: '' };
  function Probe({ children }: PropsWithChildren) {
    const { search } = useLocation();
    useEffect(() => {
      seen.search = search;
    }, [search]);
    return children;
  }
  const result = renderHook(() => useProductListFilters(), {
    wrapper: ({ children }) => {
      const router = createMemoryRouter(
        [{ path: '/products', element: <Probe>{children}</Probe> }],
        {
          initialEntries: [initialUrl],
        },
      );
      return <RouterProvider router={router} />;
    },
  });
  return { ...result, search: () => seen.search };
}

describe('useProductListFilters', () => {
  it('reads the filters from the URL, ignoring values it does not know', () => {
    const { result } = renderFilters('/products?q=mug&status=DRAFT&gap=images');

    expect(result.current.search).toBe('mug');
    expect(result.current.status).toBe(ProductStatus.DRAFT);
    expect(result.current.gap).toBe(CatalogGap.images);
    expect(result.current.isFiltered).toBe(true);

    const unknown = renderFilters('/products?status=everything&gap=nope');
    expect(unknown.result.current.status).toBe(ALL_STATUSES);
    expect(unknown.result.current.gap).toBeUndefined();
  });

  it('writes a status to the URL and clears everything at once', () => {
    const { result, search } = renderFilters('/products?gap=images');

    act(() => result.current.setStatus(ProductStatus.ACTIVE));
    expect(search()).toContain('status=ACTIVE');
    expect(search()).toContain('gap=images');

    act(() => result.current.clearAll());
    expect(search()).toBe('');
    expect(result.current.isFiltered).toBe(false);
  });
});
