import { useMemo } from 'react';
import type { SuggestionKind } from '@/api/schema';
import { htmlToText } from '@/lib/html-text';
import { DiffSide } from '@/components/diff/DiffSide';
import { DiffPart, diffWords } from '@/lib/word-diff';
import { HTML_SUGGESTION_KINDS } from '../suggestions.constants';

interface SuggestionDiffProps {
  kind: SuggestionKind;
  currentValue: string;
  proposedValue: string;
}

/**
 * What the store shows now next to what is proposed, with the changed words marked. HTML is
 * compared as text, so a description is never rendered from an agent's markup.
 */
export function SuggestionDiff({ kind, currentValue, proposedValue }: SuggestionDiffProps) {
  const segments = useMemo(() => {
    const asText = HTML_SUGGESTION_KINDS.has(kind) ? htmlToText : (value: string) => value;
    return diffWords(asText(currentValue), asText(proposedValue));
  }, [kind, currentValue, proposedValue]);
  return (
    <div className="grid gap-4 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
      <DiffSide label="Now" segments={segments} hidden={DiffPart.Added} />
      <DiffSide label="Suggested" segments={segments} hidden={DiffPart.Removed} />
    </div>
  );
}
