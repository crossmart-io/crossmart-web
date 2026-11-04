import { act, renderHook } from '@testing-library/react';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  it('toggles single rows', () => {
    const { result } = renderHook(() => useSelection());

    act(() => result.current.toggle('a'));
    act(() => result.current.toggle('b'));
    act(() => result.current.toggle('a'));

    expect([...result.current.ids]).toEqual(['b']);
    expect(result.current.isSelected('b')).toBe(true);
  });

  it('selects all shown rows, then clears them when all are selected', () => {
    const { result } = renderHook(() => useSelection());

    act(() => result.current.toggle('a'));
    act(() => result.current.toggleAll(['a', 'b', 'c']));
    expect(result.current.ids.size).toBe(3);

    act(() => result.current.toggleAll(['a', 'b', 'c']));
    expect(result.current.ids.size).toBe(0);
  });
});
