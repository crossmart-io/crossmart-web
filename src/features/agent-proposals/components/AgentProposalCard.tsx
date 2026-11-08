import { AgentProposalStatus } from '@/api/schema';
import { ChangePreview, PreviewDetails, RiskBadges } from '@/features/agent-worker';
import { AGENT_PROPOSALS_TEST_IDS } from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';
import { ProposalDecisionBar } from './ProposalDecisionBar';
import { ProposalHeader } from './ProposalHeader';
import { ProposalOutcome } from './ProposalOutcome';

/** How the person decides a waiting proposal; absent when they may only look. */
export interface ProposalDecisionActions {
  disabled: boolean;
  onApprove: (proposalId: string, confirmHighRisk: boolean) => void;
  onReject: (proposalId: string) => void;
}

interface AgentProposalCardProps {
  proposal: AgentProposal;
  actions?: ProposalDecisionActions;
}

/**
 * One outside agent's proposed change, as Crossmart Agent's approval cards show it: what it
 * does, its risks, the values before and after, and approve or reject while it waits.
 */
export function AgentProposalCard({ proposal, actions }: AgentProposalCardProps) {
  const waiting = proposal.status === AgentProposalStatus.pending;
  return (
    <li
      data-testid={AGENT_PROPOSALS_TEST_IDS.card}
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm"
    >
      <ProposalHeader proposal={proposal} />
      <RiskBadges risks={proposal.risks} />
      <ChangePreview changes={proposal.preview?.changes ?? []} />
      <PreviewDetails details={proposal.preview?.details ?? []} />
      {waiting && actions ? (
        <ProposalDecisionBar
          proposal={proposal}
          disabled={actions.disabled}
          onApprove={(confirm) => actions.onApprove(proposal.id, confirm)}
          onReject={() => actions.onReject(proposal.id)}
        />
      ) : (
        <ProposalOutcome proposal={proposal} />
      )}
    </li>
  );
}
