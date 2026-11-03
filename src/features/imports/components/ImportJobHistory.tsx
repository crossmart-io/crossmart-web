import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useLocalPagination } from '@/hooks/usePagination';
import { useImportJobFilters } from '../hooks/useImportJobFilters';
import { useImportJobs } from '../hooks/useImportJobs';
import { ImportJobFilterBar } from './ImportJobFilterBar';
import { Button } from '@/components/ui/button';
import { ImportJobsEmptyState } from './ImportJobsEmptyState';
import { ImportJobsTable } from './ImportJobsTable';
import { ImportProductsDialog } from './ImportProductsDialog';

/** The workspace's imports, newest first, a numbered page at a time. */
export function ImportJobHistory({ workspaceId }: { workspaceId: string }) {
  const filters = useImportJobFilters();
  const pagination = useLocalPagination(`${workspaceId}|${filters.key}`);
  const history = useImportJobs(
    workspaceId,
    { status: filters.status, format: filters.format, direction: filters.sort.direction },
    pagination,
  );

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
  if (history.jobs.length === 0 && !filters.isFiltered) {
    return <ImportJobsEmptyState action={<ImportProductsDialog workspaceId={workspaceId} />} />;
  }
  return (
    <>
      <ImportJobFilterBar filters={filters} />
      {history.jobs.length === 0 ? (
        <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
          <p>No imports match these filters.</p>
          <Button type="button" variant="outline" size="sm" onClick={filters.clearAll}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ImportJobsTable jobs={history.jobs} />
      )}
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
