import { CircleCheck, CircleMinus, CircleX, type LucideIcon } from 'lucide-react';
import { AgentWorkerToolKind } from '@/api/schema';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { ActionTone, AGENT_WORKER_ACTION_STATUS_COPY } from '../agent-worker.constants';
import type { AgentWorkerAction } from '../agent-worker.types';

const TONE_ICONS: Record<Exclude<ActionTone, ActionTone.Busy>, LucideIcon> = {
  [ActionTone.Neutral]: CircleMinus,
  [ActionTone.Success]: CircleCheck,
  [ActionTone.Failure]: CircleX,
};

const TONE_CLASSES: Record<ActionTone, string> = {
  [ActionTone.Neutral]: 'text-muted-foreground',
  [ActionTone.Busy]: 'text-muted-foreground',
  [ActionTone.Success]: 'text-success',
  [ActionTone.Failure]: 'text-destructive',
};

function ToneIcon({ tone }: { tone: ActionTone }) {
  if (tone === ActionTone.Busy) return <Spinner className="size-3.5 shrink-0" />;
  const Icon = TONE_ICONS[tone];
  return <Icon className={cn('size-3.5 shrink-0', TONE_CLASSES[tone])} aria-hidden="true" />;
}

/**
 * One tool call, in a line: what was read ("List a store’s products by state · 12 found"), or a
 * change with how it ended ("Applied", "Failed · the store refused the price").
 */
export function ActionRow({ action }: { action: AgentWorkerAction }) {
  const { label, tone } = AGENT_WORKER_ACTION_STATUS_COPY[action.status];
  const isWrite = action.kind === AgentWorkerToolKind.write;
  const isFailure = tone === ActionTone.Failure || action.isError;
  return (
    <li
      className={cn(
        'flex items-start gap-2 rounded-md px-2 py-1 text-xs',
        isFailure ? 'bg-destructive/5 text-destructive' : 'text-muted-foreground',
      )}
    >
      <span className="mt-px">
        <ToneIcon tone={isFailure ? ActionTone.Failure : tone} />
      </span>
      <span className="min-w-0 break-words">
        <span className={cn(isWrite && 'font-medium text-foreground')}>
          {isWrite ? action.summary : action.toolTitle}
        </span>
        {isWrite && <span> · {label}</span>}
        {action.outcome && <span> · {action.outcome}</span>}
      </span>
    </li>
  );
}

/** The tool calls of a message, as compact lines under it. */
export function ActionList({ actions }: { actions: readonly AgentWorkerAction[] }) {
  if (!actions.length) return null;
  return (
    <ul className="flex flex-col gap-0.5">
      {actions.map((action) => (
        <ActionRow key={action.id} action={action} />
      ))}
    </ul>
  );
}
