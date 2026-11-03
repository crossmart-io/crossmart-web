import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ChannelGrid, useConnectRedirectToast } from '@/features/channels';

export function ChannelsPage() {
  useConnectRedirectToast();

  return (
    <Page
      name="Channels"
      description="Connect the marketplaces and stores you sell on. Each one gets listings written for it."
    >
      <WorkspaceGate>{(workspace) => <ChannelGrid workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
