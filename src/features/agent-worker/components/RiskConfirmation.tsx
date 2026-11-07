import { useId } from 'react';
import type { AgentWorkerActionRisk } from '@/api/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import { riskConsequences } from '../conversation-view';

interface RiskConfirmationProps {
  risks: readonly AgentWorkerActionRisk[];
  confirmed: boolean;
  disabled: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
}

/** "I understand this deletes and changes prices": required before risky changes go ahead. */
export function RiskConfirmation({
  risks,
  confirmed,
  disabled,
  onConfirmedChange,
}: RiskConfirmationProps) {
  const checkboxId = useId();
  if (!risks.length) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-2.5">
      <Checkbox
        id={checkboxId}
        checked={confirmed}
        disabled={disabled}
        onCheckedChange={(checked) => onConfirmedChange(checked === true)}
        className="mt-0.5"
      />
      <label htmlFor={checkboxId} className="text-sm leading-snug">
        {AGENT_WORKER_COPY.confirmRisk(riskConsequences(risks))}
      </label>
    </div>
  );
}
