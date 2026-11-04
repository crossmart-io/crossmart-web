import { api } from '@/api/client';
import { CATALOG_STATS_ENDPOINT } from '../catalog.constants';

export function useCatalogStats(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    CATALOG_STATS_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: Boolean(workspaceId) },
  );
}
