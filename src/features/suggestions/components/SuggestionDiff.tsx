import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { SuggestionKind } from '@/api/schema';
import { htmlToText } from '@/lib/html-text';
import { DiffPart, type DiffSegment, diffWords } from '@/lib/word-diff';
import { HTML_SUGGESTION_KINDS } from '../suggestions.constants';

interface SuggestionDiffProps {
  kind: SuggestionKind;
  currentValue: string;
  proposedValue: string;
}

const SEGMENT_STYLES: Record<DiffPart, string> = {
  [DiffPart.Same]: '',
  [DiffPart.Removed]: 'rounded-sm bg-destructive/10 text-destructive line-through',
  [DiffPart.Added]: 'rounded-sm bg-success/12 text-success',
};

/** One side of the diff: the shared words, plus what that side alone has, highlighted. */
function DiffSide({
  label,
  segments,
  hidden,
}: {
  label: string;
  segments: readonly DiffSegment[];
  hidden: DiffPart;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="text-sm leading-relaxed break-words whitespace-pre-line">
        {segments
          .filter((segment) => segment.part !== hidden)
          .map((segment, index) =>
            segment.part === DiffPart.Same ? (
              <span key={index}>{segment.text}</span>
            ) : (
              <mark key={index} className={cn('px-0.5', SEGMENT_STYLES[segment.part])}>
                {segment.text}
              </mark>
            ),
          )}
      </p>
    </div>
  );
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
