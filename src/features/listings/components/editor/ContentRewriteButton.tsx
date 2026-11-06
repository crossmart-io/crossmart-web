import type { ContentField } from '@/api/schema';
import { AiRewriteButton } from '@/features/ai-writer';
import { useOverrideAiWriter } from '../../hooks/useOverrideAiWriter';
import { useListingEditorContext } from './listing-editor-context';

/** Rewrites one of this store's content fields with AI, into the form and unsaved. */
export function ContentRewriteButton({ field }: { field: ContentField }) {
  const { listingRef, readOnly } = useListingEditorContext();
  const writer = useOverrideAiWriter();
  if (readOnly) return null;
  return <AiRewriteButton target={listingRef} fields={[field]} {...writer} />;
}
