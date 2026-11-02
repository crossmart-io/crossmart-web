import { type PropsWithChildren, useEffect, useState, useSyncExternalStore } from 'react';
import { ThemeContext } from './theme-context';
import { DARK_CLASS, DARK_SCHEME_QUERY, type ResolvedTheme, Theme } from './theme.constants';
import { readStoredTheme, storeTheme } from './theme-storage';

function subscribeToSystemScheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_SCHEME_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_SCHEME_QUERY).matches;
}

/** Follows the system until the user picks a theme, then remembers it in this browser. */
export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const prefersDark = useSyncExternalStore(subscribeToSystemScheme, systemPrefersDark);
  const resolvedTheme: ResolvedTheme =
    theme === Theme.Dark || (theme === Theme.System && prefersDark) ? Theme.Dark : Theme.Light;

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, resolvedTheme === Theme.Dark);
  }, [resolvedTheme]);

  function setTheme(next: Theme) {
    storeTheme(next);
    setThemeState(next);
  }

  return <ThemeContext value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext>;
}
