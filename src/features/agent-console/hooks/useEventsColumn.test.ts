import { act, renderHook } from '@testing-library/react';
import { useEventsColumn } from './useEventsColumn';

describe('useEventsColumn', () => {
  afterEach(() => localStorage.clear());

  it('starts shown, and remembers when the person hides it', () => {
    const { result } = renderHook(() => useEventsColumn());
    expect(result.current.collapsed).toBe(false);

    act(() => result.current.setCollapsed(true));
    expect(result.current.collapsed).toBe(true);
    expect(renderHook(() => useEventsColumn()).result.current.collapsed).toBe(true);
  });

  it('shows the column when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(renderHook(() => useEventsColumn()).result.current.collapsed).toBe(false);
    vi.restoreAllMocks();
  });
});
