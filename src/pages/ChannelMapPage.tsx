import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AgentWorkerContextView } from '@/api/schema';
import { AGENT_WORKER_TEST_IDS, AskAgentWorkerButton } from '@/features/agent-worker';
import { AccountChannelMap } from '@/features/channel-map';

const CHANNEL_MAP_CONTEXT = { view: AgentWorkerContextView.channel_map } as const;

const CHANNEL_MAP_PAGE_COPY = {
  name: 'Channel map',
  description:
    'Your catalog and every store it feeds. Select a store or a count to see those products.',
} as const;

export function ChannelMapPage() {
  return (
    <Page
      name={CHANNEL_MAP_PAGE_COPY.name}
      description={CHANNEL_MAP_PAGE_COPY.description}
      actions={
        <AskAgentWorkerButton
          context={CHANNEL_MAP_CONTEXT}
          variant="default"
          testId={AGENT_WORKER_TEST_IDS.channelMapButton}
        />
      }
    >
      <WorkspaceGate>
        {(workspace) => <AccountChannelMap workspaceId={workspace.id} />}
      </WorkspaceGate>
    </Page>
  );
}
