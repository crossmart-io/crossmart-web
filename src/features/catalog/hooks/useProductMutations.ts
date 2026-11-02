import { useMutation } from '@tanstack/react-query';
import { toApiErrorMessage } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { PRODUCT_ENDPOINT, PRODUCTS_ENDPOINT } from '../catalog.constants';
import type { Product } from '../catalog.types';
import type { ProductPayload } from '../editor/product-form.mappers';
import { useInvalidateCatalog } from './useInvalidateCatalog';

/** A new product gets its handle from its title, and its variants get ids from the API. */
function toCreateBody({ handle, variants, ...rest }: ProductPayload) {
  return {
    ...rest,
    handle: handle || undefined,
    variants: variants.map(({ id: _id, ...variant }) => variant),
  };
}

export function useCreateProduct(workspaceId: string) {
  const invalidateCatalog = useInvalidateCatalog();
  return useMutation<Product, Error, ProductPayload>({
    mutationFn: async (payload) => {
      const { data, error } = await fetchClient.POST(PRODUCTS_ENDPOINT, {
        params: { path: { workspaceId } },
        body: toCreateBody(payload),
      });
      if (error) throw new Error(toApiErrorMessage(error));
      return data;
    },
    onSuccess: invalidateCatalog,
  });
}

export function useUpdateProduct(workspaceId: string, productId: string) {
  const invalidateCatalog = useInvalidateCatalog();
  return useMutation<Product, Error, ProductPayload>({
    mutationFn: async (payload) => {
      const { data, error } = await fetchClient.PUT(PRODUCT_ENDPOINT, {
        params: { path: { workspaceId, productId } },
        body: payload,
      });
      if (error) throw new Error(toApiErrorMessage(error));
      return data;
    },
    onSuccess: invalidateCatalog,
  });
}

export function useDeleteProduct(workspaceId: string, productId: string) {
  const invalidateCatalog = useInvalidateCatalog();
  return useMutation<void, Error>({
    mutationFn: async () => {
      const { error } = await fetchClient.DELETE(PRODUCT_ENDPOINT, {
        params: { path: { workspaceId, productId } },
      });
      if (error) throw new Error(toApiErrorMessage(error));
    },
    onSuccess: invalidateCatalog,
  });
}
