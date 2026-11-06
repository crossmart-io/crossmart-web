import { render, screen } from '@testing-library/react';
import { AgentClientRegistration } from '@/api/schema';
import type { AgentClient } from '../agent-authorization';
import type * as AuthorizationHooks from '../hooks/useAgentAuthorization';
import { useAgentClient } from '../hooks/useAgentAuthorization';
import { AgentIdentity } from './AgentIdentity';

vi.mock('../hooks/useAgentAuthorization', async (importOriginal) => ({
  ...(await importOriginal<typeof AuthorizationHooks>()),
  useAgentClient: vi.fn<typeof useAgentClient>(),
}));

function renderWith(client: AgentClient | undefined) {
  vi.mocked(useAgentClient).mockReturnValue({ data: client } as ReturnType<typeof useAgentClient>);
  render(<AgentIdentity clientId="client-1" />);
}

describe('AgentIdentity', () => {
  it('shows a metadata document agent with the host that verified its name', () => {
    renderWith({
      clientId: 'https://claude.ai/oauth/client.json',
      name: 'Claude',
      registration: AgentClientRegistration.metadata_document,
      verifiedHost: 'claude.ai',
      claimedHost: null,
    });

    expect(screen.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByText(/Verified by/)).toHaveTextContent('Verified by claude.ai');
    expect(screen.queryByText('Unverified name')).not.toBeInTheDocument();
  });

  it('marks a self-registered agent’s name as unverified, and says why', () => {
    renderWith({
      clientId: 'aBcD1234',
      name: 'Claude',
      registration: AgentClientRegistration.dynamic,
      verifiedHost: null,
      claimedHost: 'claude.ai',
    });

    expect(screen.getByText('Unverified name')).toBeInTheDocument();
    expect(screen.getByText(/registered itself and chose this name/)).toBeInTheDocument();
    expect(screen.getByText(/Says it is from/)).toHaveTextContent(
      'Says it is from claude.ai (not verified)',
    );
    expect(screen.queryByText(/Verified by/)).not.toBeInTheDocument();
  });

  it('names no agent and claims nothing until its details load', () => {
    renderWith(undefined);

    expect(screen.getByText('An AI agent')).toBeInTheDocument();
    expect(screen.queryByText('Unverified name')).not.toBeInTheDocument();
  });
});
