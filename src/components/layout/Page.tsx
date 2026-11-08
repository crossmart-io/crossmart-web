import { type PropsWithChildren, type ReactNode, useEffect } from 'react';
import { toDocumentTitle } from '@/config/app';
import { type Crumb, PAGE_PARENTS } from '@/config/navigation';
import { useBreadcrumbs } from './useBreadcrumbs';
import { PageHeader } from './PageHeader';

interface PageProps extends PropsWithChildren {
  /** Names the page in the browser tab and the last breadcrumb. */
  name: string;
  /** The heading, when it says more than the name ("Welcome, Dana"). */
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Pages above this one, outermost first. Pass a `PAGE_PARENTS` entry so it stays stable. */
  parents?: readonly Crumb[];
  /** A full-window page shows its content only; the heading stays for screen readers. */
  headerHidden?: boolean;
}

/** Every app page: tab title, breadcrumbs, heading, then its content with even spacing. */
export function Page({
  name,
  title,
  description,
  actions,
  parents = PAGE_PARENTS.topLevel,
  headerHidden = false,
  children,
}: PageProps) {
  const { setCrumbs } = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([...parents, { label: name }]);
  }, [name, parents, setCrumbs]);

  const back = parents.findLast((crumb) => crumb.to);

  if (headerHidden) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <title>{toDocumentTitle(name)}</title>
        <h1 className="sr-only">{title ?? name}</h1>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <title>{toDocumentTitle(name)}</title>
      <PageHeader
        title={title ?? name}
        description={description}
        actions={actions}
        back={back?.to ? { to: back.to, label: back.label } : undefined}
      />
      {children}
    </div>
  );
}
