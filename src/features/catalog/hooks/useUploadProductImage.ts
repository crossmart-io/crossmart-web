import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { PRODUCT_IMAGES_ENDPOINT, UPLOAD_FILE_FIELD } from '../catalog.constants';

function toUploadForm(file: File): FormData {
  const form = new FormData();
  form.append(UPLOAD_FILE_FIELD, file);
  return form;
}

/** Uploads one image and resolves to its public URL. */
export function useUploadProductImage(workspaceId: string) {
  return useMutation<string, Error, File>({
    meta: { inlineError: true },
    mutationFn: async (file) => {
      const data = await unwrap(
        fetchClient.POST(PRODUCT_IMAGES_ENDPOINT, {
          params: { path: { workspaceId } },
          // The generated type describes the form; the browser sends it as multipart.
          body: { file: file.name },
          bodySerializer: () => toUploadForm(file),
        }),
      );
      return data.url;
    },
  });
}
