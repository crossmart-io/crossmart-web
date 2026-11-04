import { THEME_STORAGE_KEY, Theme } from './theme.constants';

/** Storage can throw in private windows or when site data is blocked; the theme then follows the system. */
export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return Object.values(Theme).find((theme) => theme === stored) ?? Theme.System;
  } catch {
    return Theme.System;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not remembered in this browser; the choice still applies until reload.
  }
}
