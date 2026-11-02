import { api } from '@/api/client';
import { PRODUCT_ENDPOINT } from '../catalog.constants';

export function useProduct(workspaceId: string | undefined, productId: string) {
  return api.useQuery(
    'get',
    PRODUCT_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '', productId } } },
    { enabled: Boolean(workspaceId) },
  );
}
