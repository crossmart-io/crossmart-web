import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMediaUploads } from '../../hooks/useMediaUploads';
import type { ProductFormValues } from '../product-form.schema';
import { EditorCard } from './EditorCard';
import { ImageDropzone } from './ImageDropzone';
import { MediaTile } from './MediaTile';

/** A small drag distance keeps clicks on the tile buttons from starting a drag. */
const DRAG_ACTIVATION_DISTANCE_PX = 6;

export function MediaCard({ workspaceId }: { workspaceId: string }) {
  const { control } = useFormContext<ProductFormValues>();
  const media = useFieldArray({ control, name: 'media', keyName: 'rowKey' });
  const uploads = useMediaUploads(workspaceId, (url) => media.append({ url, altText: '' }));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE_PX } }),
  );
  const addFiles = (files: File[]) => void uploads.uploadFiles(files);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const urls = media.fields.map((item) => item.url);
    media.move(urls.indexOf(String(active.id)), urls.indexOf(String(over.id)));
  }

  if (media.fields.length === 0 && uploads.pendingCount === 0) {
    return (
      <EditorCard title="Media">
        <UploadError error={uploads.error} />
        <ImageDropzone onFiles={addFiles} />
      </EditorCard>
    );
  }

  return (
    <EditorCard title="Media">
      <UploadError error={uploads.error} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={media.fields.map((item) => item.url)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {media.fields.map((item, index) => (
              <MediaTile
                key={item.rowKey}
                url={item.url}
                altText={item.altText}
                isFeatured={index === 0}
                onAltTextChange={(altText) => media.update(index, { url: item.url, altText })}
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
      {media.fields.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Drag to reorder. The first image is the main image on every channel.
        </p>
      )}
    </EditorCard>
  );
}

function UploadingTile() {
  return (
    <div className="grid aspect-square place-items-center rounded-lg border bg-muted">
      <LoaderCircle className="size-5 animate-spin text-muted-foreground" aria-label="Uploading" />
    </div>
  );
}

function UploadError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
