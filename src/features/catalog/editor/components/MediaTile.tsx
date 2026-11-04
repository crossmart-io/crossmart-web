import { type DraggableAttributes, type DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Trash2 } from 'lucide-react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { AltTextPopover } from './AltTextPopover';

interface MediaTileProps {
  url: string;
  altText: string;
  /** 1-based; the first image is the one channels show first. */
  position: number;
  onAltTextChange: (altText: string) => void;
  /** Absent on the main image. */
  onMakeMain?: () => void;
  onRemove: () => void;
}

/** One image. Drag it, or move it with the keyboard from its handle. */
export function MediaTile({ url, altText, position, ...actions }: MediaTileProps) {
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({
    id: url,
  });
  const isMain = position === 1;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-muted',
        isMain ? 'col-span-2 row-span-2' : 'aspect-square',
        isDragging && 'z-10 opacity-80 shadow-lg',
      )}
    >
      <img src={url} alt={altText} className="size-full object-cover" />
      {isMain && (
        <span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
          Main image
        </span>
      )}
      <TileActions
        name={altText || `image ${position}`}
        altText={altText}
        dragHandle={{ attributes, listeners }}
        {...actions}
      />
    </div>
  );
}

interface TileActionsProps extends Pick<
  MediaTileProps,
  'onAltTextChange' | 'onMakeMain' | 'onRemove'
> {
  /** How the image is named in button labels. */
  name: string;
  altText: string;
  dragHandle: { attributes: DraggableAttributes; listeners: DraggableSyntheticListeners };
}

/** Shown on hover and focus, and always on touch screens, where there is no hover. */
function TileActions({
  name,
  altText,
  dragHandle,
  onAltTextChange,
  onMakeMain,
  onRemove,
}: TileActionsProps) {
  return (
    <div className="absolute inset-x-2 top-2 flex justify-between gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        className="cursor-grab touch-none active:cursor-grabbing"
        aria-label={`Reorder ${name}`}
        {...dragHandle.attributes}
        {...dragHandle.listeners}
      >
        <GripVertical />
      </Button>
      <div className="flex gap-1">
        {onMakeMain && (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            onClick={onMakeMain}
            aria-label={`Make ${name} the main image`}
          >
            <Star />
          </Button>
        )}
        <AltTextPopover altText={altText} imageName={name} onChange={onAltTextChange} />
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
