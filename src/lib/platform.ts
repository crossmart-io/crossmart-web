/** Apple keyboards use Command where everyone else uses Control. */
export const IS_APPLE_PLATFORM = /Mac|iPhone|iPad/.test(navigator.userAgent);

/** "⌘S" or "Ctrl+S", for hints next to a control. */
export function shortcutLabel(key: string): string {
  return IS_APPLE_PLATFORM ? `⌘${key}` : `Ctrl+${key}`;
}

/** "Meta+S" or "Control+S", the `aria-keyshortcuts` form. */
export function shortcutAria(key: string): string {
  return `${IS_APPLE_PLATFORM ? 'Meta' : 'Control'}+${key}`;
}
