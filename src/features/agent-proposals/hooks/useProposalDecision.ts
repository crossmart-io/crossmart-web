import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchClient } from '@/api/client';
import { AgentProposalStatus } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { useInvalidateCatalog } from '@/features/catalog';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  AGENT_PROPOSALS_COPY,
  AGENT_PROPOSALS_ENDPOINT,
  AGENT_PROPOSALS_SUMMARY_ENDPOINT,
  APPROVE_PROPOSAL_ENDPOINT,
  REJECT_PROPOSAL_ENDPOINT,
} from '../agent-proposals.constants';
import type { AgentProposal } from '../agent-proposals.types';

const PROPOSAL_ENDPOINTS = [AGENT_PROPOSALS_ENDPOINT, AGENT_PROPOSALS_SUMMARY_ENDPOINT] as const;

interface Approval {
  proposalId: string;
  confirmHighRisk: boolean;
}

/** Approving says whether the change was made, or what Crossmart refused. */
function announceApproval(proposal: AgentProposal): void {
  if (proposal.status === AgentProposalStatus.failed) {
    toast.error(AGENT_PROPOSALS_COPY.approvedButFailed, { description: proposal.result ?? '' });
  } else {
    toast.success(AGENT_PROPOSALS_COPY.approved);
  }
}

/** Approves or rejects one proposal of the workspace; an approved change shows in the catalog. */
export function useProposalDecision(workspaceId: string) {
  const refresh = useInvalidateEndpoints(PROPOSAL_ENDPOINTS);
  const refreshCatalog = useInvalidateCatalog();
  const approve = useMutation<AgentProposal, Error, Approval>({
    mutationFn: ({ proposalId, confirmHighRisk }) =>
      unwrap(
        fetchClient.POST(APPROVE_PROPOSAL_ENDPOINT, {
          params: { path: { workspaceId, proposalId } },
          body: { confirmHighRisk },
        }),
      ),
    onSuccess: async (proposal) => {
      announceApproval(proposal);
      await Promise.all([refresh(), refreshCatalog()]);
    },
  });
  const reject = useMutation<AgentProposal, Error, string>({
    meta: { successMessage: AGENT_PROPOSALS_COPY.rejected },
    mutationFn: (proposalId) =>
      unwrap(
        fetchClient.POST(REJECT_PROPOSAL_ENDPOINT, {
          params: { path: { workspaceId, proposalId } },
        }),
      ),
    onSuccess: refresh,
  });
  return { approve, reject, isPending: approve.isPending || reject.isPending };
}
