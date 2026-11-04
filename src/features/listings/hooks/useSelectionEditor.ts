import { useState } from 'react';
import type { ProductSelectionRule } from '../listings.types';
import {
  excludeProduct,
  includeProduct,
  type SelectionDraft,
  toSelectionDraft,
  toSelectionRule,
} from '../selection-draft';
import { useUpdateSelection } from './useConnectionRules';
import { useSelectionPreview } from './usePreviews';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/** The selection being edited, its live preview, and saving it. */
export function useSelectionEditor(ref: ConnectionRef, rule: ProductSelectionRule | null) {
  const [saved, setSaved] = useState(() => toSelectionDraft(rule));
  const [draft, setDraft] = useState(saved);
  const preview = useSelectionPreview(ref, toSelectionRule(draft));
  const save = useUpdateSelection(ref);

  async function submit(): Promise<void> {
    const connection = await save.mutateAsync(toSelectionRule(draft));
    // Keep the mode the merchant chose: "all" and "filtered" can store the same rule.
    const next: SelectionDraft = {
      ...toSelectionDraft(connection.productSelection),
      mode: draft.mode,
    };
    setSaved(next);
    setDraft(next);
  }

  return {
    draft,
    setDraft,
    preview: preview.data,
    save,
    submit,
    isDirty: JSON.stringify(draft) !== JSON.stringify(saved),
    include: (productId: string) => setDraft(includeProduct(draft, productId)),
    exclude: (productId: string) => setDraft(excludeProduct(draft, productId)),
    restoreExcluded: () => setDraft({ ...draft, excludeProductIds: [] }),
  };
}
