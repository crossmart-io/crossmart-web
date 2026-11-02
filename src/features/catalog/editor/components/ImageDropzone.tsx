import { ImagePlus } from 'lucide-react';
import { type DragEvent, useRef, useState } from 'react';
import { cn } from 'cn';
import { IMAGE_FILE_ACCEPT } from '../../catalog.constants';

const IMAGE_MIME_PREFIX = 'image/';

interface ImageDropzoneProps {
  onFiles: (files: File[]) => void;
  /** The empty state fills the card; next to images it is one grid tile. */
  compact?: boolean;
}

/** Drop images on it, or click it to choose them. */
export function ImageDropzone({ onFiles, compact = false }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    onFiles(
      [...event.dataTransfer.files].filter((file) => file.type.startsWith(IMAGE_MIME_PREFIX)),
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/50',
          compact ? 'aspect-square' : 'px-6 py-10',
          isDragging && 'border-primary bg-muted',
        )}
      >
        <ImagePlus className="size-5" aria-hidden="true" />
        {compact ? (
          <span className="sr-only">Add images</span>
        ) : (
          <>
            <span className="font-medium text-foreground">Add images</span>
            <span>Drop JPEG, PNG, WebP or GIF files, up to 20 MB each</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        multiple
        hidden
        onChange={(event) => {
          onFiles([...(event.target.files ?? [])]);
          event.target.value = '';
        }}
      />
    </>
  );
}
