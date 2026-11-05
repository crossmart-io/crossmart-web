import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { useInvalidateActivity } from '@/features/activity';
import { useInvalidateCatalog } from '@/features/catalog';
import { useInvalidateStock } from '@/features/inventory';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  IMPORT_FORM_FIELDS,
  FILE_IMPORT_MODE_COPY,
  type FileImportMode,
  IMPORT_JOBS_ENDPOINT,
  PRODUCT_IMPORTS_ENDPOINT,
} from '../imports.constants';
import type { CatalogImportResult } from '../imports.types';

const IMPORT_HISTORY_ENDPOINTS = [IMPORT_JOBS_ENDPOINT];

interface ImportFile {
  mode: FileImportMode;
  file: File;
}

function toImportForm({ mode, file }: ImportFile): FormData {
  const form = new FormData();
  form.append(IMPORT_FORM_FIELDS.mode, mode);
  form.append(IMPORT_FORM_FIELDS.format, FILE_IMPORT_MODE_COPY[mode].format);
  form.append(IMPORT_FORM_FIELDS.file, file);
  return form;
}

/** Uploads a file in the chosen mode, then refreshes the catalog, stock, history and the log. */
export function useImportProducts(workspaceId: string) {
  const invalidateHistory = useInvalidateEndpoints(IMPORT_HISTORY_ENDPOINTS);
  const invalidateActivity = useInvalidateActivity();
  const invalidateCatalog = useInvalidateCatalog();
  const invalidateStock = useInvalidateStock();

  return useMutation<CatalogImportResult, Error, ImportFile>({
    meta: { inlineError: true },
    mutationFn: async (upload) => {
      const data = await unwrap(
        fetchClient.POST(PRODUCT_IMPORTS_ENDPOINT, {
          params: { path: { workspaceId } },
          // The generated type describes the form; the browser sends it as multipart.
          body: {
            mode: upload.mode,
            format: FILE_IMPORT_MODE_COPY[upload.mode].format,
            file: upload.file.name,
          },
          bodySerializer: () => toImportForm(upload),
        }),
      );
      return data;
    },
    // A rejected file is in the history and the log too, so refresh them either way.
    onSettled: () => Promise.all([invalidateHistory(), invalidateActivity()]),
    onSuccess: () => Promise.all([invalidateCatalog(), invalidateStock()]),
  });
}
