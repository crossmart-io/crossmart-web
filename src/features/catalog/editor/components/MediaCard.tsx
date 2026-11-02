import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CircleAlert, X } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useMediaUploads } from '../../hooks/useMediaUploads';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { ImageDropzone } from './ImageDropzone';
import { MediaTile } from './MediaTile';

/** A small drag distance keeps clicks on the tile buttons from starting a drag. */
const DRAG_ACTIVATION_DISTANCE_PX = 6;

interface MediaCardProps {
  workspaceId: string;
  /** Tells the editor how many uploads are still running, so it can hold Save. */
  onPendingChange: (count: number) => void;
}

export function MediaCard({ workspaceId, onPendingChange }: MediaCardProps) {
  const { control } = useFormContext<ProductFormValues>();
  const media = useFieldArray({ control, name: 'media', keyName: 'rowKey' });
  const uploads = useMediaUploads(workspaceId, (url) => media.append({ url, altText: '' }));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE_PX } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const addFiles = (files: File[]) => void uploads.uploadFiles(files);

  useEffect(() => onPendingChange(uploads.pendingCount), [uploads.pendingCount, onPendingChange]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const urls = media.fields.map((item) => item.url);
    media.move(urls.indexOf(String(active.id)), urls.indexOf(String(over.id)));
  }

  const problems = (
    <UploadProblems problems={uploads.problems} onDismiss={uploads.dismissProblems} />
  );

  if (media.fields.length === 0 && uploads.pendingCount === 0) {
    return (
      <EditorCard title="Media">
        {problems}
        <ImageDropzone onFiles={addFiles} />
      </EditorCard>
    );
  }

  return (
    <EditorCard title="Media">
      {problems}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={media.fields.map((item) => item.url)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {media.fields.map((item, index) => (
              <MediaTile
                key={item.rowKey}
                url={item.url}
                altText={item.altText}
                position={index + 1}
                onAltTextChange={(altText) => media.update(index, { url: item.url, altText })}
                onMakeMain={index > 0 ? () => media.move(index, 0) : undefined}
                onRemove={() => media.remove(index)}
              />
            ))}
            {Array.from({ length: uploads.pendingCount }, (_, index) => (
              <UploadingTile key={index} />
            ))}
            <ImageDropzone compact onFiles={addFiles} />
          </div>
        </SortableContext>
      </DndContext>
      {media.fields.length > 1 && <ReorderHint />}
    </EditorCard>
  );
}

function ReorderHint() {
  return (
    <p className="text-xs text-muted-foreground">
      Drag to reorder, or focus the handle and use the arrow keys. The first image is the main image
      on every channel.
    </p>
  );
}

function UploadingTile() {
  return (
    <div className="grid aspect-square place-items-center rounded-lg border bg-muted text-muted-foreground">
      <Spinner className="size-5" aria-label="Uploading image" />
    </div>
  );
}

function UploadProblems({ problems, onDismiss }: { problems: string[]; onDismiss: () => void }) {
  if (problems.length === 0) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>
        <ul className="flex flex-col gap-1">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </AlertDescription>
      <AlertAction>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X />
        </Button>
      </AlertAction>
    </Alert>
  );
}
