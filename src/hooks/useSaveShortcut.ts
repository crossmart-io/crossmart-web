import { useEffect, useRef } from 'react';

const SAVE_KEY = 's';

/** Cmd+S on macOS, Ctrl+S elsewhere, instead of the browser's "save page". */
export function useSaveShortcut(onSave: () => void, enabled = true): void {
  const latestOnSave = useRef(onSave);

  useEffect(() => {
    latestOnSave.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== SAVE_KEY || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      latestOnSave.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
