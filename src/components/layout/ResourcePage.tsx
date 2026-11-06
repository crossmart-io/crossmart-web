import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import type { Crumb } from '@/config/navigation';
import { Page } from './Page';

/** What a page about one record says when that record cannot be shown. */
export interface ResourcePageCopy {
  /** The page's name while the record is unavailable ("Order"). */
  name: string;
  /** Its name when the record does not exist ("Order not found"). */
  notFoundName: string;
  /** Why, in a sentence ("This order does not exist in this workspace."). */
  notFound: string;
  /** The heading of a failed load ("This order could not be loaded"). */
  loadFailed: string;
}

interface ResourcePageProps<Resource> {
  query: UseQueryResult<Resource, unknown>;
  copy: ResourcePageCopy;
  /** Pages above this one; the not-found page links back to the nearest. */
  parents: readonly Crumb[];
  /** The page, once the record has loaded. */
  children: (resource: Resource) => ReactNode;
}

function NotFound({ copy, parents }: Pick<ResourcePageProps<unknown>, 'copy' | 'parents'>) {
  const back = parents.findLast((crumb) => crumb.to);
  return (
    <Page name={copy.notFoundName} parents={parents}>
      <p className="text-muted-foreground">{copy.notFound}</p>
      {back?.to && (
        <div>
          <Button asChild variant="outline">
            <Link to={back.to}>Back to {back.label}</Link>
          </Button>
        </div>
      )}
    </Page>
  );
}

/** A page about one record: not found, a failed load with a retry, a loader, then the record. */
export function ResourcePage<Resource>({
  query,
  copy,
  parents,
  children,
}: ResourcePageProps<Resource>) {
  if (isNotFoundError(query.error)) return <NotFound copy={copy} parents={parents} />;
  if (query.isError) {
    return (
      <Page name={copy.name} parents={parents}>
        <ErrorState title={copy.loadFailed} error={query.error} onRetry={query.refetch} />
      </Page>
    );
  }
  if (query.isPending) return <ContentLoader />;
  return children(query.data);
}
