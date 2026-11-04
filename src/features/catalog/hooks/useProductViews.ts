import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
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

function useRefreshViews() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: endpointQueryKey(PRODUCT_VIEWS_ENDPOINT) });
}

export function useCreateProductView(workspaceId: string) {
  const refresh = useRefreshViews();
  return useMutation<ProductView, Error, NewProductView>({
    meta: { successMessage: VIEW_FEEDBACK.saved, inlineError: true },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(PRODUCT_VIEWS_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

export function useDeleteProductView(workspaceId: string) {
  const refresh = useRefreshViews();
  return useMutation<void, Error, string>({
    meta: { successMessage: VIEW_FEEDBACK.deleted },
    mutationFn: async (viewId) => {
      const { error } = await fetchClient.DELETE(PRODUCT_VIEW_ENDPOINT, {
        params: { path: { workspaceId, viewId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}
