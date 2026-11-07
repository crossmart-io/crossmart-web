import { api } from '@/api/client';
import { BILLING_ACCESS_ENDPOINT } from '../billing.constants';

/** Whether the workspace can be changed under its organization's subscription (any member). */
export function useBillingAccess(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    BILLING_ACCESS_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: workspaceId !== undefined },
  );
}
