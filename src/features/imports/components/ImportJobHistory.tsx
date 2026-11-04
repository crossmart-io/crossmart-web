import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import { useImportJobs } from '../hooks/useImportJobs';
import { ImportJobsEmptyState } from './ImportJobsEmptyState';
import { ImportJobsTable } from './ImportJobsTable';
import { ImportProductsDialog } from './ImportProductsDialog';

/** The workspace's imports, newest first, with more loaded on request. */
export function ImportJobHistory({ workspaceId }: { workspaceId: string }) {
  const history = useImportJobs(workspaceId);

  if (history.isError) {
    return (
      <ErrorState
        title="The import history could not be loaded"
        error={history.error}
        onRetry={history.refetch}
      />
    );
  }
  if (history.isPending) return <ListSkeleton label="Loading the import history" />;
  if (history.jobs.length === 0) {
    return <ImportJobsEmptyState action={<ImportProductsDialog workspaceId={workspaceId} />} />;
  }
  return (
    <>
      <ImportJobsTable jobs={history.jobs} />
      {history.hasNextPage && (
        <LoadMoreButton
          isLoading={history.isFetchingNextPage}
          onLoadMore={() => void history.fetchNextPage()}
        />
      )}
    </>
  );
}
