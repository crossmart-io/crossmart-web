import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApiKeysTable, CreateApiKeyDialog } from '@/features/api-keys';

export function ApiKeysPage() {
  return (
    <WorkspaceGate>
      {(workspace) => (
        <>
          <PageHeader
            title="API keys"
            description="Let Claude, ChatGPT, your own agent or scripts work with this workspace through the API and MCP server."
            actions={<CreateApiKeyDialog workspaceId={workspace.id} />}
          />
          <ApiKeysTable workspaceId={workspace.id} />
        </>
      )}
    </WorkspaceGate>
  );
}
