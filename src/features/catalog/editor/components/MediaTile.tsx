import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { AltTextPopover } from './AltTextPopover';

interface MediaTileProps {
  url: string;
  altText: string;
  isFeatured: boolean;
  onAltTextChange: (altText: string) => void;
  onRemove: () => void;
}

/** One draggable image. The first image is the one channels show first. */
export function MediaTile({ url, altText, isFeatured, onAltTextChange, onRemove }: MediaTileProps) {
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({
    id: url,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-muted',
        isFeatured ? 'col-span-2 row-span-2' : 'aspect-square',
        isDragging && 'z-10 opacity-80 shadow-lg',
      )}
    >
      <img
        src={url}
        alt={altText}
        className="size-full cursor-grab object-cover active:cursor-grabbing"
        {...attributes}
        {...listeners}
      />
      {isFeatured && (
        <span className="absolute top-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
          Main image
        </span>
      )}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <AltTextPopover altText={altText} onChange={onAltTextChange} />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-7"
          onClick={onRemove}
          aria-label="Remove image"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
