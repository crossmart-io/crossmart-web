import { fetchClient } from '@/api/client';
import type { AgentProposalStatus } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { AGENT_PROPOSALS_ENDPOINT } from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';

interface ProposalFilter {
  workspaceId: string;
  status: AgentProposalStatus;
}

function fetchProposalPage(
  { workspaceId, status }: ProposalFilter,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  return unwrap(
    fetchClient.GET(AGENT_PROPOSALS_ENDPOINT, {
      params: { path: { workspaceId }, query: { status, ...page } },
      signal,
    }),
  );
}

/** One numbered page of outside agents' proposals with a status, newest first. */
export function useAgentProposals(filter: ProposalFilter, pagination: Pagination) {
  const query = usePagedList<AgentProposal>({
    endpoint: AGENT_PROPOSALS_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchProposalPage(filter, page, signal),
    staleTime: 0,
  });
  return { ...query, proposals: query.items };
}
