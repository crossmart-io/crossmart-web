import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { useCursorPages } from '@/hooks/useCursorPages';
import {
  IMPORT_JOB_ENDPOINT,
  IMPORT_JOBS_ENDPOINT,
  IMPORT_JOBS_PAGE_SIZE,
} from '../imports.constants';
import type { ImportJob } from '../imports.types';

async function fetchImportJobPage(
  workspaceId: string,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(IMPORT_JOBS_ENDPOINT, {
    params: { path: { workspaceId }, query: { cursor, limit: IMPORT_JOBS_PAGE_SIZE } },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** The import history, newest first, a page at a time (the API pages by cursor). */
export function useImportJobs(workspaceId: string) {
  const query = useCursorPages<ImportJob>({
    endpoint: IMPORT_JOBS_ENDPOINT,
    params: { workspaceId },
    fetchPage: (cursor, signal) => fetchImportJobPage(workspaceId, cursor, signal),
  });
  return { ...query, jobs: query.items };
}

export function useImportJob(workspaceId: string, jobId: string) {
  return api.useQuery('get', IMPORT_JOB_ENDPOINT, { params: { path: { workspaceId, jobId } } });
}
