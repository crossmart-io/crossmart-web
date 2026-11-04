import { fireEvent, renderHook } from '@testing-library/react';
import { useSaveShortcut } from './useSaveShortcut';

describe('useSaveShortcut', () => {
  it('saves on Cmd+S and Ctrl+S instead of saving the page', () => {
    const onSave = vi.fn<() => void>();
    renderHook(() => useSaveShortcut(onSave));

    const event = new KeyboardEvent('keydown', { key: 's', metaKey: true, cancelable: true });
    window.dispatchEvent(event);
    fireEvent.keyDown(window, { key: 'S', ctrlKey: true });

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores plain keys and does nothing while disabled', () => {
    const onSave = vi.fn<() => void>();
    const { rerender } = renderHook(({ enabled }) => useSaveShortcut(onSave, enabled), {
      initialProps: { enabled: true },
    });

    fireEvent.keyDown(window, { key: 's' });
    rerender({ enabled: false });
    fireEvent.keyDown(window, { key: 's', metaKey: true });

    expect(onSave).not.toHaveBeenCalled();
  });
});
