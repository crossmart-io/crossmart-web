import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AccountChannelMap } from '@/features/channel-map';

const CHANNEL_MAP_PAGE_COPY = {
  name: 'Channel map',
  description:
    'Your catalog and every store it feeds. Select a store or a count to see those products.',
} as const;

export function ChannelMapPage() {
  return (
    <Page name={CHANNEL_MAP_PAGE_COPY.name} description={CHANNEL_MAP_PAGE_COPY.description}>
      <WorkspaceGate>
        {(workspace) => <AccountChannelMap workspaceId={workspace.id} />}
      </WorkspaceGate>
    </Page>
  );
}
