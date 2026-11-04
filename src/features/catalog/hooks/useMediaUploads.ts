import { useState } from 'react';
import { toApiErrorMessage } from '@/api/api-error';
import { imageFileProblem } from '../editor/image-file-check';
import { useUploadProductImage } from './useUploadProductImage';

/**
 * Uploads images one by one, reporting each URL as it arrives and how many are still pending.
 * Files the API would refuse are reported by name and never sent.
 */
export function useMediaUploads(workspaceId: string, onUploaded: (url: string) => void) {
  const upload = useUploadProductImage(workspaceId);
  const [pendingCount, setPendingCount] = useState(0);
  const [problems, setProblems] = useState<string[]>([]);

  async function uploadFiles(files: File[]) {
    const refused = files.flatMap((file) => imageFileProblem(file) ?? []);
    const accepted = files.filter((file) => imageFileProblem(file) === null);
    setProblems(refused);
    setPendingCount((count) => count + accepted.length);
    for (const file of accepted) {
      try {
        onUploaded(await upload.mutateAsync(file));
      } catch (error) {
        setProblems((current) => [...current, `${file.name}: ${toApiErrorMessage(error)}`]);
      } finally {
        setPendingCount((count) => count - 1);
      }
    }
  }

  return { uploadFiles, pendingCount, problems, dismissProblems: () => setProblems([]) };
}
