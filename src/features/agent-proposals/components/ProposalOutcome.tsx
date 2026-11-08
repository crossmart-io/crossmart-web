import { AgentProposalStatus } from '@/api/schema';
import { AGENT_PROPOSALS_COPY } from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';

/** "Approved by Lee" or "Rejected by Lee"; nothing when nobody decided (it expired). */
function decisionOf({ status, decidedByName }: AgentProposal): string | null {
  if (!decidedByName) return null;
  return status === AgentProposalStatus.rejected
    ? AGENT_PROPOSALS_COPY.rejectedBy(decidedByName)
    : AGENT_PROPOSALS_COPY.approvedBy(decidedByName);
}

/** How a decided proposal ended: who decided, and what Crossmart refused when it failed. */
export function ProposalOutcome({ proposal }: { proposal: AgentProposal }) {
  const decision = decisionOf(proposal);
  const failed = proposal.status === AgentProposalStatus.failed;
  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      {decision && <p>{decision}</p>}
      {failed && proposal.result && (
        <p className="rounded-md bg-destructive/5 px-2 py-1.5 break-words text-destructive">
          {proposal.result}
        </p>
      )}
    </div>
  );
}
