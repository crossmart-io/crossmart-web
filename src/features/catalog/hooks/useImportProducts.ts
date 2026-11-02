import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import { CatalogImportFormat } from '@/api/schema';
import { toApiErrorMessage } from '@/api/api-error';
import { IMPORT_FORM_FIELDS, PRODUCT_IMPORTS_ENDPOINT } from '../catalog.constants';
import type { CatalogImportResult } from '../catalog.types';
import { useInvalidateCatalog } from './useInvalidateCatalog';

function toImportForm(file: File): FormData {
  const form = new FormData();
  form.append(IMPORT_FORM_FIELDS.format, CatalogImportFormat.shopify_csv);
  form.append(IMPORT_FORM_FIELDS.file, file);
  return form;
}

/** Uploads a Shopify product export, then refreshes the product list. */
export function useImportProducts(workspaceId: string | undefined) {
  const invalidateCatalog = useInvalidateCatalog();

  return useMutation<CatalogImportResult, Error, File>({
    mutationFn: async (file) => {
      const { data, error } = await fetchClient.POST(PRODUCT_IMPORTS_ENDPOINT, {
        params: { path: { workspaceId: workspaceId ?? '' } },
        // The generated type describes the form; the browser sends it as multipart.
        body: { format: CatalogImportFormat.shopify_csv, file: file.name },
        bodySerializer: () => toImportForm(file),
      });
      if (error) throw new Error(toApiErrorMessage(error));
      return data;
    },
    onSuccess: invalidateCatalog,
  });
}
