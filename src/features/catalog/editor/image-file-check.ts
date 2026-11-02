import { IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_MEGABYTES } from '../catalog.constants';

function isAcceptedType(type: string): boolean {
  return IMAGE_CONTENT_TYPES.some((accepted) => accepted === type);
}

/** Why the API would refuse this file, or null when it can be uploaded. */
export function imageFileProblem(file: File): string | null {
  if (!isAcceptedType(file.type)) {
    return `${file.name} is not a JPEG, PNG, WebP or GIF image.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name} is larger than ${MAX_IMAGE_MEGABYTES} MB.`;
  }
  return null;
}
