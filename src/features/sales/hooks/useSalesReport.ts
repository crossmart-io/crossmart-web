import { api } from '@/api/client';
import type { SalesRange } from '@/api/schema';
import { SALES_REPORT_ENDPOINT } from '../sales.constants';

export function useSalesReport(workspaceId: string, range: SalesRange) {
  return api.useQuery('get', SALES_REPORT_ENDPOINT, {
    // No time zone: the API follows the workspace's, so everyone sees the same days.
    params: { path: { workspaceId }, query: { range } },
  });
}
