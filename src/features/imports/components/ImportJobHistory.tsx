import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useLocalPagination } from '@/hooks/usePagination';
import { useImportJobs } from '../hooks/useImportJobs';
import { ImportJobsEmptyState } from './ImportJobsEmptyState';
import { ImportJobsTable } from './ImportJobsTable';
import { ImportProductsDialog } from './ImportProductsDialog';

/** The workspace's imports, newest first, a numbered page at a time. */
export function ImportJobHistory({ workspaceId }: { workspaceId: string }) {
  const pagination = useLocalPagination(workspaceId);
  const history = useImportJobs(workspaceId, pagination);

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
      <TablePagination
        pagination={pagination}
        total={history.total}
        pageCount={history.pageCount}
        noun="import"
        isFetching={history.isPlaceholderData}
      />
    </>
  );
}
