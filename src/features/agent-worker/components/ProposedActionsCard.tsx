import { Check, X } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import {
  AGENT_WORKER_COPY,
  AGENT_WORKER_ELEMENT_IDS,
  AGENT_WORKER_TEST_IDS,
} from '../agent-worker.constants';
import type { AgentWorkerAction, AgentWorkerDecision } from '../agent-worker.types';
import { useProposedSelection } from '../hooks/useProposedSelection';
import { ProposedActionItem } from './ProposedActionItem';
import { RiskConfirmation } from './RiskConfirmation';

/** Approving none of the changes rejects them all. */
const REJECT_ALL: AgentWorkerDecision = { approvedActionIds: [], confirmHighRisk: false };

interface ProposedActionsCardProps {
  actions: readonly AgentWorkerAction[];
  disabled: boolean;
  onDecide: (decision: AgentWorkerDecision) => void;
}

/**
 * Every change Crossmart Agent waits to make, in one card: each can be left out, risky ones need
 * an explicit confirmation, and one decision approves the selected and rejects the rest.
 */
export function ProposedActionsCard({ actions, disabled, onDecide }: ProposedActionsCardProps) {
  const selection = useProposedSelection(actions);
  const titleId = useId();
  return (
    <section
      id={AGENT_WORKER_ELEMENT_IDS.proposedCard}
      tabIndex={-1}
      aria-labelledby={titleId}
      data-testid={AGENT_WORKER_TEST_IDS.proposedCard}
      className="flex scroll-mt-3 flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <header className="flex flex-col gap-0.5">
        <h3 id={titleId} className="text-sm font-semibold">
          {AGENT_WORKER_COPY.proposedTitle}
        </h3>
        <p className="text-xs text-muted-foreground">{AGENT_WORKER_COPY.proposedDescription}</p>
      </header>
      <ul className="flex flex-col gap-2">
        {actions.map((action) => (
          <ProposedActionItem
            key={action.id}
            action={action}
            checked={selection.isSelected(action.id)}
            disabled={disabled}
            onToggle={() => selection.toggle(action.id)}
          />
        ))}
      </ul>
      <RiskConfirmation
        risks={selection.risks}
        confirmed={selection.confirmed}
        disabled={disabled}
        onConfirmedChange={selection.setConfirmed}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          data-testid={AGENT_WORKER_TEST_IDS.rejectAll}
          onClick={() => onDecide(REJECT_ALL)}
        >
          <X data-icon="inline-start" />
          {AGENT_WORKER_COPY.rejectAll}
        </Button>
        <Button
          size="sm"
          disabled={disabled || !selection.canApprove}
          data-testid={AGENT_WORKER_TEST_IDS.approve}
          onClick={() => onDecide(selection.approval())}
        >
          <Check data-icon="inline-start" />
          {AGENT_WORKER_COPY.approveSelected}
        </Button>
      </div>
    </section>
  );
}
