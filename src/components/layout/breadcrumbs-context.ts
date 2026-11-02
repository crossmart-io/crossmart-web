import { createContext } from 'react';
import type { Crumb } from '@/config/navigation';

export interface BreadcrumbsState {
  crumbs: readonly Crumb[];
  setCrumbs: (crumbs: readonly Crumb[]) => void;
}

export const BreadcrumbsContext = createContext<BreadcrumbsState | null>(null);
