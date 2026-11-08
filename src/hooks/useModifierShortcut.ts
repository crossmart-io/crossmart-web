import { useEffect, useRef } from 'react';

/**
 * Calls `onShortcut` on Cmd+`key` on macOS and Ctrl+`key` elsewhere, anywhere in the window,
 * instead of what the browser would do with it.
 */
export function useModifierShortcut(key: string, onShortcut: () => void, enabled = true): void {
  const latestOnShortcut = useRef(onShortcut);

  useEffect(() => {
    latestOnShortcut.current = onShortcut;
  }, [onShortcut]);

  useEffect(() => {
    if (!enabled) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      latestOnShortcut.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, enabled]);
}
