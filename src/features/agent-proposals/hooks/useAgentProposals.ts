import { api, fetchClient } from '@/api/client';
import type { AgentProposalStatus } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import {
  AGENT_PROPOSALS_ENDPOINT,
  AGENT_PROPOSALS_SUMMARY_ENDPOINT,
  PENDING_PROPOSALS_REFRESH_MS,
} from '../agent-proposals.constants';
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

/** How many proposals wait for a decision, for the sidebar and the bell. Polled. */
export function usePendingProposalCount(workspaceId: string | undefined, enabled = true): number {
  const query = api.useQuery(
    'get',
    AGENT_PROPOSALS_SUMMARY_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: enabled && Boolean(workspaceId), refetchInterval: PENDING_PROPOSALS_REFRESH_MS },
  );
  return query.data?.pendingCount ?? 0;
}
