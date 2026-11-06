import { WorkspacePermission } from '@/api/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useListingHealth } from '../hooks/useListingHealth';
import { LISTING_HEALTH_COPY } from '../listing-health.constants';
import { RecentFailuresCard } from './RecentFailuresCard';
import { StoresHealthCard } from './StoresHealthCard';

/** The overview's listings section: each store's products by state, and what failed, as of now. */
export function ListingHealthOverview({ workspace }: { workspace: Workspace }) {
  const { data: report, isError } = useListingHealth(workspace.id);
  return (
    <section aria-labelledby="listing-health-heading" className="flex flex-col gap-4">
      <h2 id="listing-health-heading" className="font-heading text-lg font-semibold">
        {LISTING_HEALTH_COPY.heading}
      </h2>
      {isError && <p className="text-sm text-destructive">{LISTING_HEALTH_COPY.loadError}</p>}
      {!report && !isError && <Skeleton className="h-64 w-full rounded-xl" aria-busy="true" />}
      {report && (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <StoresHealthCard stores={report.stores} />
          <RecentFailuresCard
            report={report}
            workspaceId={workspace.id}
            canEdit={hasPermission(workspace, WorkspacePermission.listings_edit)}
          />
        </div>
      )}
    </section>
  );
}
