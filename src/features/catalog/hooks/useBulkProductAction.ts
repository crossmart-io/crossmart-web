import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { BULK_ACTION_DONE } from '../bulk-actions';
import { PRODUCT_BULK_ACTIONS_ENDPOINT } from '../catalog.constants';
import type { BulkProductActionBody } from '../catalog.types';
import { useInvalidateCatalog } from './useInvalidateCatalog';

/** One change for the selected products, then a refresh of every catalog view. */
export function useBulkProductAction(workspaceId: string) {
  const invalidateCatalog = useInvalidateCatalog();

  return useMutation<number, Error, BulkProductActionBody>({
    mutationFn: async (body) => {
      const data = await unwrap(
        fetchClient.POST(PRODUCT_BULK_ACTIONS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      );
      return data.affected;
    },
    onSuccess: async (affected, body) => {
      toast.success(BULK_ACTION_DONE[body.action](affected));
      await invalidateCatalog();
    },
  });
}
