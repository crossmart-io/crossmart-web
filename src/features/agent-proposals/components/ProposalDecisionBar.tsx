import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { RiskConfirmation } from '@/features/agent-worker';
import { AGENT_PROPOSALS_COPY, AGENT_PROPOSALS_TEST_IDS } from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';

interface ProposalDecisionBarProps {
  proposal: AgentProposal;
  disabled: boolean;
  onApprove: (confirmHighRisk: boolean) => void;
  onReject: () => void;
}

/**
 * Approve or reject a waiting proposal. A risky one (deletes, changes prices, many items) needs
 * the person to confirm they understand what it does before Approve works.
 */
export function ProposalDecisionBar({
  proposal,
  disabled,
  onApprove,
  onReject,
}: ProposalDecisionBarProps) {
  const [confirmed, setConfirmed] = useState(false);
  const risky = proposal.risks.length > 0;
  return (
    <div className="flex flex-col gap-3">
      <RiskConfirmation
        risks={proposal.risks}
        confirmed={confirmed}
        disabled={disabled}
        onConfirmedChange={setConfirmed}
      />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="mr-auto text-xs text-muted-foreground">
          {AGENT_PROPOSALS_COPY.expires} <RelativeTime value={proposal.expiresAt} />
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          data-testid={AGENT_PROPOSALS_TEST_IDS.reject}
          onClick={onReject}
        >
          <X data-icon="inline-start" />
          {AGENT_PROPOSALS_COPY.reject}
        </Button>
        <Button
          size="sm"
          disabled={disabled || (risky && !confirmed)}
          data-testid={AGENT_PROPOSALS_TEST_IDS.approve}
          onClick={() => onApprove(risky)}
        >
          <Check data-icon="inline-start" />
          {AGENT_PROPOSALS_COPY.approve}
        </Button>
      </div>
    </div>
  );
}
