import { type AgentProposalStatus, WorkspacePermission } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useUrlPagination } from '@/hooks/usePagination';
import { AGENT_PROPOSALS_COPY } from '../agent-proposals.constants';
import { useAgentProposals } from '../hooks/useAgentProposals';
import { useProposalDecision } from '../hooks/useProposalDecision';
import { AgentProposalCard, type ProposalDecisionActions } from './AgentProposalCard';
import { AgentProposalsEmptyState } from './AgentProposalsEmptyState';

interface AgentProposalListProps {
  workspace: Workspace;
  status: AgentProposalStatus;
}

/** Decisions for people who may approve; everyone else only reads. */
function useDecisionActions(workspace: Workspace): ProposalDecisionActions | undefined {
  const decision = useProposalDecision(workspace.id);
  if (!hasPermission(workspace, WorkspacePermission.suggestions_approve)) return undefined;
  return {
    disabled: decision.isPending,
    onApprove: (proposalId, confirmHighRisk) =>
      decision.approve.mutate({ proposalId, confirmHighRisk }),
    onReject: (proposalId) => decision.reject.mutate(proposalId),
  };
}

/** One page of proposals with a status, each as an approval card. */
export function AgentProposalList({ workspace, status }: AgentProposalListProps) {
  const pagination = useUrlPagination();
  const list = useAgentProposals({ workspaceId: workspace.id, status }, pagination);
  const actions = useDecisionActions(workspace);
  if (list.isError) {
    const { loadError } = AGENT_PROPOSALS_COPY;
    return <ErrorState title={loadError} error={list.error} onRetry={list.refetch} />;
  }
  if (list.isPending) return <ListSkeleton label={AGENT_PROPOSALS_COPY.loading} />;
  if (list.proposals.length === 0) return <AgentProposalsEmptyState status={status} />;
  return (
    <>
      <ul className="flex flex-col gap-3">
        {list.proposals.map((proposal) => (
          <AgentProposalCard key={proposal.id} proposal={proposal} actions={actions} />
        ))}
      </ul>
      <TablePagination
        pagination={pagination}
        total={list.total}
        pageCount={list.pageCount}
        noun={AGENT_PROPOSALS_COPY.noun}
        isFetching={list.isPlaceholderData}
      />
    </>
  );
}
