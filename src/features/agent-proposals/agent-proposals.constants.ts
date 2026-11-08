import { AgentProposalStatus, OutsideAgentChanges } from '@/api/schema';
import type { FilterTab } from '@/components/lists/FilterTabs';

export const AGENT_PROPOSALS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/agent-proposals';
export const AGENT_PROPOSALS_SUMMARY_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-proposals/summary';
export const APPROVE_PROPOSAL_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-proposals/{proposalId}/approve';
export const REJECT_PROPOSAL_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-proposals/{proposalId}/reject';

/** The waiting count (sidebar, bell) is refreshed this often, as agents add to it. */
export const PENDING_PROPOSALS_REFRESH_MS = 30_000;

export const PROPOSAL_STATUS_LABELS: Record<AgentProposalStatus, string> = {
  [AgentProposalStatus.pending]: 'Waiting for you',
  [AgentProposalStatus.applying]: 'Applying',
  [AgentProposalStatus.applied]: 'Applied',
  [AgentProposalStatus.failed]: 'Failed',
  [AgentProposalStatus.rejected]: 'Rejected',
  [AgentProposalStatus.expired]: 'Expired',
};

/** The tabs of the proposals page; waiting first, as that is the work to do. */
export const PROPOSAL_STATUS_TABS: readonly FilterTab<AgentProposalStatus>[] = [
  { value: AgentProposalStatus.pending, label: 'Waiting' },
  { value: AgentProposalStatus.applied, label: 'Applied' },
  { value: AgentProposalStatus.rejected, label: 'Rejected' },
  { value: AgentProposalStatus.failed, label: 'Failed' },
  { value: AgentProposalStatus.expired, label: 'Expired' },
];

export const AGENT_PROPOSALS_COPY = {
  pageName: 'Agent proposals',
  pageDescription:
    'Changes your connected AI agents want to make. Nothing changes until you approve it.',
  tabsLabel: 'Proposal status',
  loading: 'Loading proposals',
  loadError: 'Proposals could not be loaded',
  noun: 'proposal',
  emptyTitle: 'Nothing waiting for you',
  emptyDescription:
    'When an agent connected over MCP, such as Claude or ChatGPT, wants to change something, the change waits here with what it would do.',
  emptyStatus: (label: string) => `No ${label.toLowerCase()} proposals`,
  connectAgent: 'Connect an agent',
  byAgent: (agent: string, person: string | null) => (person ? `${agent} for ${person}` : agent),
  viaKey: 'MCP session with an API key',
  expires: 'Expires',
  approvedBy: (person: string) => `Approved by ${person}`,
  rejectedBy: (person: string) => `Rejected by ${person}`,
  approve: 'Approve',
  reject: 'Reject',
  approved: 'Approved and applied',
  approvedButFailed: 'Approved, but Crossmart refused the change',
  rejected: 'Proposal rejected',
  pendingLabel: (count: number) =>
    count === 1 ? 'proposal waiting for you' : 'proposals waiting for you',
} as const;

export const OUTSIDE_AGENT_CHANGES_COPY = {
  title: "Outside agents' changes",
  description:
    'What happens when an AI agent you connected (Claude, ChatGPT or any MCP client) changes your catalog, stock or listings. Crossmart Agent always asks first, and scripts that use an API key are not affected.',
  saved: 'Saved',
  save: 'Save',
  options: {
    [OutsideAgentChanges.require_approval]: {
      label: 'Wait for my approval',
      description: 'Each change waits under Agent proposals with what it would do. Recommended.',
    },
    [OutsideAgentChanges.apply_directly]: {
      label: 'Apply directly',
      description: "Changes are made at once, within the agent's access, and logged in Activity.",
    },
  },
} as const;

export const AGENT_PROPOSALS_TEST_IDS = {
  card: 'agent-proposal-card',
  approve: 'agent-proposal-approve',
  reject: 'agent-proposal-reject',
} as const;
