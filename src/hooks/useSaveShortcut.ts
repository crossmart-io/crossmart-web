import { useModifierShortcut } from './useModifierShortcut';

const SAVE_KEY = 's';

/** Cmd+S on macOS, Ctrl+S elsewhere, instead of the browser's "save page". */
export function useSaveShortcut(onSave: () => void, enabled = true): void {
  useModifierShortcut(SAVE_KEY, onSave, enabled);
}
