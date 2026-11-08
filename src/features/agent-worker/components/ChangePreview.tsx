import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { DiffSide } from '@/components/diff/DiffSide';
import { htmlToText } from '@/lib/html-text';
import { DiffPart, diffWords } from '@/lib/word-diff';
import { AGENT_WORKER_COPY, INLINE_CHANGE_MAX_LENGTH } from '../agent-worker.constants';
import type { AgentWorkerChange } from '../agent-worker.types';

const LINE_BREAK = '\n';

/** A value as text: HTML is compared without rendering it, and nothing reads as "(empty)". */
function asText(value: string | null): string {
  const text = value === null ? '' : htmlToText(value);
  return text || AGENT_WORKER_COPY.empty;
}

/** Short one-line values (prices, counts, names) read best side by side. */
function isShort(value: string): boolean {
  return value.length <= INLINE_CHANGE_MAX_LENGTH && !value.includes(LINE_BREAK);
}

function ChangeLabel({ label }: { label: string }) {
  return <span className="text-xs font-semibold">{label}</span>;
}

/** A value the change sets, when what it replaces is not known: no diff to show. */
function ChangeValue({ change }: { change: AgentWorkerChange }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 text-sm">
      <ChangeLabel label={change.label} />
      <span className="break-words">{asText(change.after)}</span>
    </li>
  );
}

/** "Price (M)  $24.00 → $19.00". */
function InlineChange({
  change,
  before,
  after,
}: {
  change: AgentWorkerChange;
  before: string;
  after: string;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-2 text-sm">
      <ChangeLabel label={change.label} />
      <span className="text-muted-foreground line-through">{before}</span>
      <ArrowRight
        className="size-3.5 text-muted-foreground"
        aria-label={AGENT_WORKER_COPY.changesTo}
      />
      <span className="font-medium">{after}</span>
    </li>
  );
}

/** Longer text before and after, with the removed words struck and the added ones marked. */
function ChangeDiff({
  change,
  before,
  after,
}: {
  change: AgentWorkerChange;
  before: string;
  after: string;
}) {
  const segments = useMemo(() => diffWords(before, after), [before, after]);
  return (
    <li className="flex flex-col gap-1.5">
      <ChangeLabel label={change.label} />
      <div className="grid gap-2 rounded-md border bg-muted/30 p-2">
        <DiffSide label={AGENT_WORKER_COPY.before} segments={segments} hidden={DiffPart.Added} />
        <DiffSide label={AGENT_WORKER_COPY.after} segments={segments} hidden={DiffPart.Removed} />
      </div>
    </li>
  );
}

function ChangeRow({ change }: { change: AgentWorkerChange }) {
  if (change.before === null) return <ChangeValue change={change} />;
  const [before, after] = [asText(change.before), asText(change.after)];
  return isShort(before) && isShort(after) ? (
    <InlineChange change={change} before={before} after={after} />
  ) : (
    <ChangeDiff change={change} before={before} after={after} />
  );
}

/** What a proposed change would do, value by value. */
export function ChangePreview({ changes }: { changes: readonly AgentWorkerChange[] }) {
  if (!changes.length) return null;
  return (
    <ul className="flex flex-col gap-2">
      {changes.map((change) => (
        <ChangeRow key={change.label} change={change} />
      ))}
    </ul>
  );
}
