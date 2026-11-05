import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { PRODUCT_VIEW_ENDPOINT, PRODUCT_VIEWS_ENDPOINT, VIEW_FEEDBACK } from '../catalog.constants';
import type { ProductView } from '../catalog.types';

type NewProductView = components['schemas']['CreateProductViewDto'];

export function useProductViews(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    PRODUCT_VIEWS_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: Boolean(workspaceId) },
  );
}

const VIEW_LIST_ENDPOINTS = [PRODUCT_VIEWS_ENDPOINT];

export function useCreateProductView(workspaceId: string) {
  const refresh = useInvalidateEndpoints(VIEW_LIST_ENDPOINTS);
  return useMutation<ProductView, Error, NewProductView>({
    meta: { successMessage: VIEW_FEEDBACK.saved, inlineError: true },
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(PRODUCT_VIEWS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

export function useDeleteProductView(workspaceId: string) {
  const refresh = useInvalidateEndpoints(VIEW_LIST_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { successMessage: VIEW_FEEDBACK.deleted },
    mutationFn: async (viewId) => {
      await unwrap(
        fetchClient.DELETE(PRODUCT_VIEW_ENDPOINT, {
          params: { path: { workspaceId, viewId } },
        }),
      );
    },
    onSuccess: refresh,
  });
}
