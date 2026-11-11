import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ChannelGrid, useConnectRedirectToast } from '@/features/channels';
import { StoreSetupDialog, useStoreSetupParam } from '@/features/store-setup';
import { hasPermission } from '@/features/workspaces';

/**
 * The stores the workspace sells on, by channel. The OAuth callback returns here, and an admin
 * who just connected a store gets its one-step setup.
 */
export function StoresPage() {
  useConnectRedirectToast();
  const setup = useStoreSetupParam();

  return (
    <Page name="Stores">
      <WorkspaceGate>
        {(workspace) => (
          <>
            <ChannelGrid workspace={workspace} />
            {setup.request && hasPermission(workspace, WorkspacePermission.channels_manage) && (
              <StoreSetupDialog
                workspaceId={workspace.id}
                request={setup.request}
                onDone={setup.close}
              />
            )}
          </>
        )}
      </WorkspaceGate>
    </Page>
  );
}
