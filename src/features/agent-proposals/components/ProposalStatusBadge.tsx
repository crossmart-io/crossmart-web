import { AgentProposalStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { PROPOSAL_STATUS_LABELS } from '../agent-proposals.constants';

type ProposalBadgeVariant = 'success' | 'warning' | 'outline' | 'secondary' | 'destructive';

const BADGE_VARIANTS = {
  [AgentProposalStatus.pending]: 'warning',
  [AgentProposalStatus.applying]: 'secondary',
  [AgentProposalStatus.applied]: 'success',
  [AgentProposalStatus.failed]: 'destructive',
  [AgentProposalStatus.rejected]: 'outline',
  [AgentProposalStatus.expired]: 'outline',
} as const satisfies Record<AgentProposalStatus, ProposalBadgeVariant>;

export function ProposalStatusBadge({ status }: { status: AgentProposalStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {PROPOSAL_STATUS_LABELS[status]}
    </Badge>
  );
}
