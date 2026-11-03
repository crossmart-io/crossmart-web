import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { ImportJobStatus } from '@/api/schema';
import {
  IMPORT_JOB_ENDPOINT,
  IMPORT_JOB_POLL_INTERVAL_MS,
  IMPORT_JOBS_ENDPOINT,
} from '../imports.constants';
import type { ImportJob } from '../imports.types';

async function fetchImportJobPage(
  workspaceId: string,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(IMPORT_JOBS_ENDPOINT, {
    params: { path: { workspaceId }, query: page },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** One numbered page of the import history, newest first. */
export function useImportJobs(workspaceId: string, pagination: Pagination) {
  const query = usePagedList<ImportJob>({
    endpoint: IMPORT_JOBS_ENDPOINT,
    params: { workspaceId },
    pagination,
    fetchPage: (page, signal) => fetchImportJobPage(workspaceId, page, signal),
  });
  return { ...query, jobs: query.items };
}

/** One import. While it runs (channel imports run in the background), it is polled. */
export function useImportJob(workspaceId: string, jobId: string | undefined) {
  return api.useQuery(
    'get',
    IMPORT_JOB_ENDPOINT,
    { params: { path: { workspaceId, jobId: jobId ?? '' } } },
    {
      enabled: Boolean(jobId),
      refetchInterval: (query) =>
        query.state.data?.status === ImportJobStatus.PROCESSING && IMPORT_JOB_POLL_INTERVAL_MS,
    },
  );
}
