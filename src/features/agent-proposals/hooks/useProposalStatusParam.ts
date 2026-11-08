import { AgentProposalStatus } from '@/api/schema';
import { useStatusParam } from '@/hooks/useStatusParam';

/** The proposals tab, kept in the URL so it can be linked to; waiting when absent. */
export function useProposalStatusParam(): [
  AgentProposalStatus,
  (status: AgentProposalStatus) => void,
] {
  return useStatusParam(AgentProposalStatus, AgentProposalStatus.pending);
}
