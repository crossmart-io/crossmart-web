import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ChannelGrid, useConnectRedirectToast } from '@/features/channels';

/** The stores the workspace sells on, by channel. The OAuth callback returns here. */
export function StoresPage() {
  useConnectRedirectToast();

  return (
    <Page name="Stores">
      <WorkspaceGate>{(workspace) => <ChannelGrid workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
