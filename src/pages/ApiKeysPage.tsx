import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ApiKeysTable, CreateApiKeyDialog } from '@/features/api-keys';
import { useCurrentWorkspace } from '@/features/workspaces';

export function ApiKeysPage() {
  const { workspace } = useCurrentWorkspace();

  return (
    <Page
      name="API keys"
      parents={PAGE_PARENTS.settings}
      description="Let Claude, ChatGPT, your own agent or scripts work with this workspace through the API and MCP server."
      actions={workspace && <CreateApiKeyDialog workspaceId={workspace.id} />}
    >
      <WorkspaceGate>{(current) => <ApiKeysTable workspaceId={current.id} />}</WorkspaceGate>
    </Page>
  );
}
