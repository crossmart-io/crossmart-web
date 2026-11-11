import { useState } from 'react';
import { type ChannelType, WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ChannelGrid, useConnectRedirectToast } from '@/features/channels';
import { StoreSetupDialog } from '@/features/store-setup';
import { hasPermission } from '@/features/workspaces';

/**
 * The stores the workspace sells on, by channel. The OAuth callback returns here, and an admin
 * who just connected a store gets its one-step setup.
 */
export function StoresPage() {
  const [connected, setConnected] = useState<ChannelType | null>(null);
  useConnectRedirectToast(setConnected);

  return (
    <Page name="Stores">
      <WorkspaceGate>
        {(workspace) => (
          <>
            <ChannelGrid workspace={workspace} />
            {connected && hasPermission(workspace, WorkspacePermission.channels_manage) && (
              <StoreSetupDialog
                workspaceId={workspace.id}
                channel={connected}
                onDone={() => setConnected(null)}
              />
            )}
          </>
        )}
      </WorkspaceGate>
    </Page>
  );
}
