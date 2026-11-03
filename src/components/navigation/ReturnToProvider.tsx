import { type PropsWithChildren, useMemo } from 'react';
import { useLocation } from 'react-router';
import type { Crumb } from '@/config/navigation';
import { ReturnToContext, type ReturnToState } from './return-to';

/**
 * Links inside it (through `useReturnToState`) open pages that lead back here: their
 * breadcrumbs and back link become `parents` followed by this page, at its current URL.
 */
export function ReturnToProvider({
  parents,
  label,
  children,
}: PropsWithChildren<{ parents: readonly Crumb[]; label: string }>) {
  const { pathname, search } = useLocation();
  const state = useMemo<ReturnToState>(
    () => ({ returnTo: [...parents, { label, to: `${pathname}${search}` }] }),
    [parents, label, pathname, search],
  );
  return <ReturnToContext value={state}>{children}</ReturnToContext>;
}
