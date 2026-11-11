import { ImagePlus } from 'lucide-react';
import { type DragEvent, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { IMAGE_FILE_ACCEPT } from '../../catalog.constants';

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
    // Everything dropped is passed on, so files that cannot be used are reported, not ignored.
    onFiles([...event.dataTransfer.files]);
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
          'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
          compact ? 'aspect-square' : 'px-6 py-10',
          isDragging && 'border-primary bg-primary/5 text-foreground',
        )}
      >
        <ImagePlus className="size-5" aria-hidden="true" />
        {compact ? (
          <span className="sr-only">Add photos</span>
        ) : (
          <>
            <span className="font-medium text-foreground">Add photos</span>
            <span>or drop them here</span>
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
