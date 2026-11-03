import { ActivityOutcome } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { TablePagination } from '@/components/lists/TablePagination';
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
import { useUrlPagination } from '@/hooks/usePagination';

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
  const pagination = useUrlPagination();
  const activity = useActivity(
    {
      workspaceId: workspace.id,
      action: filters.action,
      outcome: filters.failuresOnly ? ActivityOutcome.FAILED : undefined,
      direction: filters.sort.direction,
    },
    pagination,
  );

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
      <TablePagination
        pagination={pagination}
        total={activity.total}
        pageCount={activity.pageCount}
        noun="event"
        isFetching={activity.isPlaceholderData}
      />
    </>
  );
}
