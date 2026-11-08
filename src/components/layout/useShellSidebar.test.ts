import { act, renderHook } from '@testing-library/react';
import { PageLayout } from './page-layout';
import { useShellSidebar } from './useShellSidebar';

describe('useShellSidebar', () => {
  afterEach(() => localStorage.clear());

  it('collapses on full-window pages, remembers the choice there, and restores reading pages', () => {
    const { result, rerender } = renderHook(({ layout }) => useShellSidebar(layout), {
      initialProps: { layout: PageLayout.Column },
    });
    expect(result.current.open).toBe(true);

    rerender({ layout: PageLayout.Full });
    expect(result.current.open).toBe(false);
    act(() => result.current.onOpenChange(true));
    expect(result.current.open).toBe(true);

    rerender({ layout: PageLayout.Column });
    act(() => result.current.onOpenChange(false));
    rerender({ layout: PageLayout.Full });
    expect(result.current.open).toBe(true);

    const reloaded = renderHook(() => useShellSidebar(PageLayout.Full));
    expect(reloaded.result.current.open).toBe(true);
  });
});
