import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { PageSection } from '@/config/routes';
import { AgentConnectionsTable, ConnectAgentCard } from '@/features/agents';
import { ApiKeysTable, CreateApiKeyDialog } from '@/features/api-keys';
import { SETTINGS_COPY, SettingsSection } from '@/features/settings';
import { CreateWebhookEndpointButton, WebhookEndpoints } from '@/features/webhooks';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useScrollToSection } from '@/hooks/useScrollToSection';

function WebhooksSection({ workspace }: { workspace: Workspace }) {
  if (!hasPermission(workspace, WorkspacePermission.webhooks_manage)) return null;
  return (
    <SettingsSection
      id={PageSection.Webhooks}
      title={SETTINGS_COPY.webhooks}
      actions={<CreateWebhookEndpointButton workspaceId={workspace.id} />}
    >
      <WebhookEndpoints workspaceId={workspace.id} />
    </SettingsSection>
  );
}

function DeveloperSections({ workspace }: { workspace: Workspace }) {
  useScrollToSection();
  return (
    <div className="flex flex-col gap-10">
      <SettingsSection
        id={PageSection.ApiKeys}
        title={SETTINGS_COPY.apiKeys}
        actions={<CreateApiKeyDialog workspace={workspace} />}
      >
        <ApiKeysTable workspaceId={workspace.id} />
      </SettingsSection>
      <WebhooksSection workspace={workspace} />
      <SettingsSection id={PageSection.ConnectedAgents} title={SETTINGS_COPY.connectedAgents}>
        <ConnectAgentCard />
        <AgentConnectionsTable workspaceId={workspace.id} />
      </SettingsSection>
    </div>
  );
}

/** Settings › Developers: API keys, webhooks and the AI agents connected over MCP. */
export function DevelopersPage() {
  return (
    <WorkspaceGate>{(workspace) => <DeveloperSections workspace={workspace} />}</WorkspaceGate>
  );
}
