import { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerAction } from '../agent-worker.types';
import { ChangePreview } from './ChangePreview';
import { RiskBadges } from './RiskBadges';
import { UntrustedWarning } from './UntrustedWarning';

interface ProposedActionItemProps {
  action: AgentWorkerAction;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

/** One waiting change: a checkbox to include it, what it does, its risks and its preview. */
export function ProposedActionItem({
  action,
  checked,
  disabled,
  onToggle,
}: ProposedActionItemProps) {
  const checkboxId = useId();
  const target = action.preview?.target;
  return (
    <li className="flex gap-2.5 rounded-lg border bg-background p-3">
      <Checkbox
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor={checkboxId} className="text-sm leading-snug font-medium">
          {action.summary}
        </label>
        {target && (
          <p className="text-xs text-muted-foreground">
            {AGENT_WORKER_COPY.changeTarget} {target}
          </p>
        )}
        <RiskBadges risks={action.risks} />
        {action.untrustedWarning && <UntrustedWarning />}
        <ChangePreview changes={action.preview?.changes ?? []} />
      </div>
    </li>
  );
}
