import { type PropsWithChildren, useState } from 'react';
import type { Crumb } from '@/config/navigation';
import { BreadcrumbsContext } from './breadcrumbs-context';

/** Lets each page tell the app header where it sits. */
export function BreadcrumbsProvider({ children }: PropsWithChildren) {
  const [crumbs, setCrumbs] = useState<readonly Crumb[]>([]);
  return <BreadcrumbsContext value={{ crumbs, setCrumbs }}>{children}</BreadcrumbsContext>;
}
