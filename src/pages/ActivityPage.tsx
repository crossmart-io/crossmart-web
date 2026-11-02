import { ActivityOutcome } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import {
  ActivityEmptyState,
  ActivityFilterBar,
  type ActivityFilters,
  ActivityTimeline,
  ActivityTimelineSkeleton,
  useActivity,
  useActivityFilters,
} from '@/features/activity';
import type { Workspace } from '@/features/workspaces';

export function ActivityPage() {
  const filters = useActivityFilters();

  return (
    <Page name="Activity" description="Who changed what in your workspace, and what went wrong.">
      <ActivityFilterBar filters={filters} />
      <WorkspaceGate>
        {(workspace) => <ActivityResults workspace={workspace} filters={filters} />}
      </WorkspaceGate>
    </Page>
  );
}

interface ActivityResultsProps {
  workspace: Workspace;
  filters: ActivityFilters;
}

function ActivityResults({ workspace, filters }: ActivityResultsProps) {
  const activity = useActivity({
    workspaceId: workspace.id,
    action: filters.action,
    outcome: filters.failuresOnly ? ActivityOutcome.FAILED : undefined,
  });

  if (activity.isError) {
    return (
      <ErrorState
        title="Activity could not be loaded"
        error={activity.error}
        onRetry={activity.refetch}
      />
    );
  }
  if (activity.isPending) return <ActivityTimelineSkeleton />;
  if (activity.events.length === 0) {
    return <ActivityEmptyState isFiltered={filters.isFiltered} onClearFilters={filters.clearAll} />;
  }
  return (
    <>
      <ActivityTimeline events={activity.events} />
      {activity.hasNextPage && (
        <LoadMoreButton
          isLoading={activity.isFetchingNextPage}
          onLoadMore={() => void activity.fetchNextPage()}
        />
      )}
    </>
  );
}
