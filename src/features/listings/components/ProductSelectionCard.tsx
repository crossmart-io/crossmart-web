import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { pluralize } from '@/lib/format';
import { useSelectionEditor } from '../hooks/useSelectionEditor';
import { SELECTION_MODE_LABELS, SelectionMode } from '../listings.constants';
import type { ProductSelectionRule } from '../listings.types';
import type { SelectionDraft } from '../selection-draft';
import { AddProductsPopover } from './AddProductsPopover';
import { CardSaveFooter } from './CardSaveFooter';
import { SelectionFilters } from './SelectionFilters';
import { SelectionPreviewList } from './SelectionPreviewList';

interface ProductSelectionCardProps {
  workspaceId: string;
  connectionId: string;
  rule: ProductSelectionRule | null;
  canManage: boolean;
}

interface DraftProps {
  draft: SelectionDraft;
  onChange: (draft: SelectionDraft) => void;
  disabled: boolean;
}

function ModePicker({ draft, onChange, disabled }: DraftProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={draft.mode}
      disabled={disabled}
      onValueChange={(mode) => mode && onChange({ ...draft, mode: mode as SelectionMode })}
      aria-label="Which products to list"
      className="flex-wrap"
    >
      {Object.values(SelectionMode).map((mode) => (
        <ToggleGroupItem key={mode} value={mode} className="px-3">
          {SELECTION_MODE_LABELS[mode]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function RemovedNote({ count, onRestore }: { count: number; onRestore: () => void }) {
  return (
    <p className="text-sm text-muted-foreground">
      {pluralize(count, 'product')} removed by hand.{' '}
      <Button type="button" variant="link" className="h-auto p-0" onClick={onRestore}>
        Restore all
      </Button>
    </p>
  );
}

/** Which products this channel lists: filters, hand-picked products, and a live preview. */
export function ProductSelectionCard({
  workspaceId,
  connectionId,
  rule,
  canManage,
}: ProductSelectionCardProps) {
  const editor = useSelectionEditor({ workspaceId, connectionId }, rule);
  const { draft, setDraft } = editor;
  const listedIds = new Set([
    ...(editor.preview?.items.map((item) => item.id) ?? []),
    ...draft.includeProductIds,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Products</h2>
        </CardTitle>
        <CardDescription>
          Choose which products this channel lists. “Sync now” applies it.
        </CardDescription>
        {canManage && (
          <CardAction>
            <AddProductsPopover
              workspaceId={workspaceId}
              selectedIds={listedIds}
              onAdd={editor.include}
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ModePicker draft={draft} onChange={setDraft} disabled={!canManage} />
        {draft.mode === SelectionMode.Filtered && (
          <SelectionFilters draft={draft} onChange={setDraft} disabled={!canManage} />
        )}
        <SelectionPreviewList
          preview={editor.preview}
          canEdit={canManage}
          onRemove={editor.exclude}
        />
        {canManage && draft.excludeProductIds.length > 0 && (
          <RemovedNote count={draft.excludeProductIds.length} onRestore={editor.restoreExcluded} />
        )}
      </CardContent>
      {canManage && (
        <CardSaveFooter
          label="Save selection"
          error={editor.save.error}
          isSaving={editor.save.isPending}
          disabled={!editor.isDirty}
          onSave={() => void editor.submit()}
        />
      )}
    </Card>
  );
}
