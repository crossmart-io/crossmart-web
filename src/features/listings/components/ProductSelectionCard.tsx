import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { pluralize } from '@/lib/format';
import { useSelectionEditor } from '../hooks/useSelectionEditor';
import { SELECTION_MODE_LABELS, SelectionMode } from '../listings.constants';
import type { ProductSelectionRule } from '../listings.types';
import type { SelectionDraft } from '../selection-draft';
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
      aria-label="What the store adds automatically"
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

/** The store's automatic rule: off, all products or filters, with a live preview of the store. */
export function ProductSelectionCard({
  workspaceId,
  connectionId,
  rule,
  canManage,
}: ProductSelectionCardProps) {
  const editor = useSelectionEditor({ workspaceId, connectionId }, rule);
  const { draft, setDraft } = editor;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Add products automatically</h2>
        </CardTitle>
        <CardDescription>
          Besides the products you add by hand, the store can get all products or those matching
          filters. Products you remove by hand stay out. Sync now applies a change.
        </CardDescription>
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
