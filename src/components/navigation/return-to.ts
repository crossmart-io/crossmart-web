import { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router';
import type { Crumb } from '@/config/navigation';

/** What a link puts in the router state so the page it opens knows where it was opened from. */
export interface ReturnToState {
  returnTo: readonly Crumb[];
}

export const ReturnToContext = createContext<ReturnToState | undefined>(undefined);

/** The router state for a link that should lead back to the page it is on, if any. */
export function useReturnToState(): ReturnToState | undefined {
  return useContext(ReturnToContext);
}

function isCrumb(value: unknown): value is Crumb {
  return typeof value === 'object' && value !== null && 'label' in value;
}

function readReturnTo(state: unknown): readonly Crumb[] | undefined {
  if (typeof state !== 'object' || state === null || !('returnTo' in state)) return undefined;
  const { returnTo } = state;
  return Array.isArray(returnTo) && returnTo.every(isCrumb) ? returnTo : undefined;
}

/** The pages above this one: where the merchant came from when a link said so, else `fallback`. */
export function useParentsOrReturnTo(fallback: readonly Crumb[]): readonly Crumb[] {
  // The router keeps one state object per visit, so the breadcrumbs stay stable across renders.
  const { state } = useLocation() as { state: unknown };
  return useMemo(() => readReturnTo(state) ?? fallback, [state, fallback]);
}
