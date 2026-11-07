import { useMemo } from 'react';
import { DiffSide } from '@/components/diff/DiffSide';
import { htmlToText } from '@/lib/html-text';
import { DiffPart, diffWords } from '@/lib/word-diff';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerChange } from '../agent-worker.types';

/** A value as text: HTML is compared without rendering it, and nothing reads as "(empty)". */
function asText(value: string | null): string {
  const text = value === null ? '' : htmlToText(value);
  return text || AGENT_WORKER_COPY.empty;
}

/** A value the change sets, when what it replaces is not known: no diff to show. */
function ChangeValue({ change }: { change: AgentWorkerChange }) {
  return (
    <li className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold">{change.field}</span>
      <div className="rounded-md border bg-muted/30 p-2 text-sm">
        <span className="text-xs text-muted-foreground">{AGENT_WORKER_COPY.sets} </span>
        <span className="break-words">{asText(change.after)}</span>
      </div>
    </li>
  );
}

/** One field before and after, with the removed words struck and the added ones marked. */
function ChangeDiff({ change }: { change: AgentWorkerChange }) {
  const segments = useMemo(
    () => diffWords(asText(change.before), asText(change.after)),
    [change.before, change.after],
  );
  return (
    <li className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold">{change.field}</span>
      <div className="grid gap-2 rounded-md border bg-muted/30 p-2">
        <DiffSide label={AGENT_WORKER_COPY.before} segments={segments} hidden={DiffPart.Added} />
        <DiffSide label={AGENT_WORKER_COPY.after} segments={segments} hidden={DiffPart.Removed} />
      </div>
    </li>
  );
}

/** What a proposed change would do, field by field. */
export function ChangePreview({ changes }: { changes: readonly AgentWorkerChange[] }) {
  if (!changes.length) return null;
  return (
    <ul className="flex flex-col gap-2">
      {changes.map((change) =>
        change.before === null ? (
          <ChangeValue key={change.field} change={change} />
        ) : (
          <ChangeDiff key={change.field} change={change} />
        ),
      )}
    </ul>
  );
}
