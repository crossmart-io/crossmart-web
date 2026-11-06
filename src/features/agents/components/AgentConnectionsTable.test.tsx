import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { AgentClientRegistration, AgentScope } from '@/api/schema';
import type * as ConnectionHooks from '../hooks/useAgentConnections';
import { type AgentConnection, useAgentConnections } from '../hooks/useAgentConnections';
import { AgentConnectionsTable } from './AgentConnectionsTable';

vi.mock('../hooks/useAgentConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ConnectionHooks>()),
  useAgentConnections: vi.fn<typeof useAgentConnections>(),
}));

function connection(
  id: string,
  clientName: string,
  clientRegistration: AgentClientRegistration,
): AgentConnection {
  return {
    id,
    clientId: id,
    clientName,
    clientRegistration,
    clientVerifiedHost: null,
    clientUri: null,
    clientIcon: null,
    userId: 'user-1',
    userName: 'Dana',
    userEmail: 'dana@example.com',
    scopes: [AgentScope.catalog_read],
    connectedAt: '2026-11-05T10:00:00Z',
  };
}

describe('AgentConnectionsTable', () => {
  it('marks only the names agents chose themselves as unverified', () => {
    vi.mocked(useAgentConnections).mockReturnValue({
      data: [
        connection('c-1', 'Claude', AgentClientRegistration.metadata_document),
        connection('c-2', 'Cursor', AgentClientRegistration.dynamic),
      ],
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useAgentConnections>);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <AgentConnectionsTable workspaceId="ws-1" />
      </QueryClientProvider>,
    );

    const rowOf = (name: string) => within(screen.getByText(name).closest('tr') ?? document.body);
    expect(rowOf('Claude').queryByText('Unverified name')).not.toBeInTheDocument();
    expect(rowOf('Cursor').getByText('Unverified name')).toBeInTheDocument();
  });
});
