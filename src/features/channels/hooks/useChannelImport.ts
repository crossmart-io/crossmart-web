import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { ImportJobStatus } from '@/api/schema';
import { useInvalidateCatalog } from '@/features/catalog';
import { type ImportJobDetail, IMPORT_JOBS_ENDPOINT, useImportJob } from '@/features/imports';
import { useInvalidateStock } from '@/features/inventory';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { CHANNEL_CONNECTIONS_ENDPOINT, CHANNEL_IMPORTS_ENDPOINT } from '../channels.constants';

/** What a finished import changes: the catalog, stock, the history and the connection's sync time. */
const IMPORT_RESULT_ENDPOINTS = [IMPORT_JOBS_ENDPOINT, CHANNEL_CONNECTIONS_ENDPOINT] as const;

/** Refreshes what an import changed, once, when it stops running. */
function useRefreshWhenFinished(job: ImportJobDetail | undefined): void {
  const refreshImports = useInvalidateEndpoints(IMPORT_RESULT_ENDPOINTS);
  const refreshCatalog = useInvalidateCatalog();
  const refreshStock = useInvalidateStock();
  const finishedJobId = job && job.status !== ImportJobStatus.PROCESSING ? job.id : undefined;

  useEffect(() => {
    if (!finishedJobId) return;
    void Promise.all([refreshImports(), refreshCatalog(), refreshStock()]);
  }, [finishedJobId, refreshImports, refreshCatalog, refreshStock]);
}

/**
 * Starts importing a connection's catalog and follows the import while it runs in the
 * background. Starting while one runs returns that import, so the button is safe to press twice.
 */
export function useChannelImport(workspaceId: string, connectionId: string) {
  const [jobId, setJobId] = useState<string>();
  const start = useMutation<ImportJobDetail, Error, void>({
    meta: { inlineError: true },
    mutationFn: () =>
      unwrap(
        fetchClient.POST(CHANNEL_IMPORTS_ENDPOINT, {
          params: { path: { workspaceId, connectionId } },
        }),
      ),
    onSuccess: (job) => setJobId(job.id),
  });
  const { data: polled } = useImportJob(workspaceId, jobId);
  const job = polled ?? start.data;
  useRefreshWhenFinished(job);

  return {
    job,
    start: () => start.mutate(),
    isStarting: start.isPending,
    isRunning: job?.status === ImportJobStatus.PROCESSING,
    error: start.error,
  };
}
