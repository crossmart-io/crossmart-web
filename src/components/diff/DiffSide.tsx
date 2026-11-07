import { cn } from '@/lib/utils';
import { DiffPart, type DiffSegment } from '@/lib/word-diff';

const SEGMENT_STYLES: Record<DiffPart, string> = {
  [DiffPart.Same]: '',
  [DiffPart.Removed]: 'rounded-sm bg-destructive/10 text-destructive line-through',
  [DiffPart.Added]: 'rounded-sm bg-success/12 text-success',
};

interface DiffSideProps {
  label: string;
  segments: readonly DiffSegment[];
  /** The part the other side shows: removed words on the new side, added ones on the old. */
  hidden: DiffPart;
}

/** One side of a word diff: the shared words, plus what that side alone has, highlighted. */
export function DiffSide({ label, segments, hidden }: DiffSideProps) {
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
