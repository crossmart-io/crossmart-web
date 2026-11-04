import { createContext } from 'react';
import type { ResolvedTheme, Theme } from './theme.constants';

export interface ThemeState {
  theme: Theme;
  /** What is on screen: the system's choice when `theme` is System. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeState | null>(null);
