import { api } from '@/api/client';
import { INVENTORY_REPORT_ENDPOINT } from '../inventory-report.constants';

export function useInventoryReport(workspaceId: string) {
  return api.useQuery('get', INVENTORY_REPORT_ENDPOINT, { params: { path: { workspaceId } } });
}
