import { useContext } from 'react';
import { type BreadcrumbsState, BreadcrumbsContext } from './breadcrumbs-context';

export function useBreadcrumbs(): BreadcrumbsState {
  const state = useContext(BreadcrumbsContext);
  if (!state) throw new Error('useBreadcrumbs must be used inside BreadcrumbsProvider');
  return state;
}
