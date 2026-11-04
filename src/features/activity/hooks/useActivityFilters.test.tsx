import { act, renderHook } from '@testing-library/react';
import { type PropsWithChildren, useEffect } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { ActivityAction } from '@/api/schema';
import { useActivityFilters } from './useActivityFilters';

function renderFilters(initialUrl: string) {
  const seen = { search: '' };
  function Probe({ children }: PropsWithChildren) {
    const { search } = useLocation();
    useEffect(() => {
      seen.search = search;
    }, [search]);
    return children;
  }
  const result = renderHook(() => useActivityFilters(), {
    wrapper: ({ children }) => (
      <RouterProvider
        router={createMemoryRouter([{ path: '/activity', element: <Probe>{children}</Probe> }], {
          initialEntries: [initialUrl],
        })}
      />
    ),
  });
  return { ...result, search: () => seen.search };
}

describe('useActivityFilters', () => {
  it('reads the filters from the URL and ignores unknown actions', () => {
    const { result } = renderFilters('/activity?action=product_updated&outcome=FAILED');
    expect(result.current.action).toBe(ActivityAction.product_updated);
    expect(result.current.failuresOnly).toBe(true);

    const unknown = renderFilters('/activity?action=dropped_tables');
    expect(unknown.result.current.action).toBeUndefined();
    expect(unknown.result.current.isFiltered).toBe(false);
  });

  it('writes changes to the URL and clears them all', () => {
    const { result, search } = renderFilters('/activity');

    act(() => result.current.setFailuresOnly(true));
    act(() => result.current.setAction(ActivityAction.products_imported));
    expect(search()).toBe('?outcome=FAILED&action=products_imported');

    act(() => result.current.clearAll());
    expect(search()).toBe('');
  });
});
