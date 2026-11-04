import { api } from '@/api/client';
import type { SalesRange } from '@/api/schema';
import { SALES_REPORT_ENDPOINT } from '../sales.constants';

/** The viewer's own zone, so "today" and each day's sales match their calendar. */
const VIEWER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function useSalesReport(workspaceId: string, range: SalesRange) {
  return api.useQuery('get', SALES_REPORT_ENDPOINT, {
    params: { path: { workspaceId }, query: { range, timeZone: VIEWER_TIME_ZONE } },
  });
}
