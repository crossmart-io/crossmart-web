import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export type ResolvedTheme = Theme.Light | Theme.Dark;

/** `.dark` on `<html>` turns on the dark tokens in index.css. */
export const DARK_CLASS = 'dark';
/** Also read by the inline script in index.html, which sets the class before the first paint. */
export const THEME_STORAGE_KEY = 'crossmart-theme';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export const THEME_OPTIONS: readonly { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: Theme.Light, label: 'Light', icon: Sun },
  { value: Theme.Dark, label: 'Dark', icon: Moon },
  { value: Theme.System, label: 'System', icon: Monitor },
];
