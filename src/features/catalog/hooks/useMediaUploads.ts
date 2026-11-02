import { useState } from 'react';
import { useUploadProductImage } from './useUploadProductImage';

/** Uploads images one by one, reporting each URL as it arrives and how many are still pending. */
export function useMediaUploads(workspaceId: string, onUploaded: (url: string) => void) {
  const upload = useUploadProductImage(workspaceId);
  const [pendingCount, setPendingCount] = useState(0);

  async function uploadFiles(files: File[]) {
    setPendingCount((count) => count + files.length);
    for (const file of files) {
      try {
        onUploaded(await upload.mutateAsync(file));
      } catch {
        // Kept in `error` for the card to show.
      } finally {
        setPendingCount((count) => count - 1);
      }
    }
  }

  return { uploadFiles, pendingCount, error: upload.error };
}
