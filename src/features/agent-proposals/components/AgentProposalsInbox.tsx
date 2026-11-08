import { FilterTabs } from '@/components/lists/FilterTabs';
import type { Workspace } from '@/features/workspaces';
import { AGENT_PROPOSALS_COPY, PROPOSAL_STATUS_TABS } from '../agent-proposals.constants';
import { useProposalStatusParam } from '../hooks/useProposalStatusParam';
import { AgentProposalList } from './AgentProposalList';

/** Outside agents' proposals: tabs by status, then each proposal's approval card. */
export function AgentProposalsInbox({ workspace }: { workspace: Workspace }) {
  const [status, setStatus] = useProposalStatusParam();
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <FilterTabs
        tabs={PROPOSAL_STATUS_TABS}
        value={status}
        onChange={setStatus}
        label={AGENT_PROPOSALS_COPY.tabsLabel}
      />
      {/* Keyed so a tab starts on its first page. */}
      <AgentProposalList key={status} workspace={workspace} status={status} />
    </div>
  );
}
