import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseEnum } from '@/lib/enum';
import { pluralize } from '@/lib/format';
import { useSelectionEditor } from '../hooks/useSelectionEditor';
import { SELECTION_COPY, SELECTION_MODE_LABELS, SelectionMode } from '../listings.constants';
import type { ProductSelectionRule, SelectionPreview } from '../listings.types';
import type { SelectionDraft } from '../selection-draft';
import { CardSaveFooter } from '@/components/forms/CardSaveFooter';
import { useSaveGroupMember } from '@/components/forms/save-group';
import { FormError } from '@/components/feedback/FormError';
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
      onValueChange={(next) => {
        const mode = parseEnum(SelectionMode, next);
        if (mode) onChange({ ...draft, mode });
      }}
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

/** What saving the rule does now: the products it publishes and removes. */
function describeImpact(preview: SelectionPreview | undefined): string | undefined {
  if (!preview) return undefined;
  const { toPublish, toRemove } = preview;
  if (toPublish === 0 && toRemove === 0) return 'Saving changes no listing.';
  const parts = [
    toPublish > 0 ? `publishes ${pluralize(toPublish, 'product')}` : '',
    toRemove > 0 ? `removes ${pluralize(toRemove, 'product')}` : '',
  ].filter(Boolean);
  return `Saving ${parts.join(' and ')} now.`;
}

/** In a save group, what saving will do and why the last save failed, in place of a footer. */
function GroupSaveNote({ impact, error }: { impact?: string; error: Error | null }) {
  if (error) return <FormError error={error} />;
  return impact ? <p className="text-sm text-muted-foreground">{impact}</p> : null;
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
  const inGroup = useSaveGroupMember({
    dirty: canManage && editor.isDirty,
    pending: false,
    save: editor.submit,
    discard: editor.discard,
  });
  const impact = editor.isDirty ? describeImpact(editor.preview) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{SELECTION_COPY.title}</h2>
        </CardTitle>
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
        {inGroup && <GroupSaveNote impact={impact} error={editor.save.error} />}
      </CardContent>
      {canManage && !inGroup && (
        <CardSaveFooter
          label={SELECTION_COPY.save}
          note={impact}
          error={editor.save.error}
          isSaving={editor.save.isPending}
          disabled={!editor.isDirty}
          onSave={() => void editor.submit()}
        />
      )}
    </Card>
  );
}
