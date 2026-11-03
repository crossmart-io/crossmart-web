import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ChannelType } from '@/api/schema';
import { CHANNELS, type ChannelInfo, type ConnectableChannel } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionFixture as connection } from '../testing/channel-connection.fixture';
import { ConnectableChannelCard } from './ConnectableChannelCard';

function shopifyChannel(): { channel: ChannelInfo; connect: ConnectableChannel } {
  const channel = CHANNELS.find((info) => info.connect?.type === ChannelType.shopify);
  if (!channel?.connect) throw new Error('Shopify is not connectable');
  return { channel, connect: channel.connect };
}

const { channel: SHOPIFY, connect: CONNECT } = shopifyChannel();

function renderCard(connections: ChannelConnection[], canManage = true) {
  const element: ReactElement = (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ConnectableChannelCard
          workspaceId="ws-1"
          channel={SHOPIFY}
          connect={CONNECT}
          connections={connections}
          canManage={canManage}
        />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(element);
}

describe('ConnectableChannelCard', () => {
  it('offers to connect a store, asking for its domain', async () => {
    renderCard([]);

    await userEvent.click(screen.getByRole('button', { name: 'Connect' }));

    expect(screen.getByRole('dialog', { name: 'Connect Shopify' })).toBeInTheDocument();
    expect(screen.getByLabelText('Store domain')).toBeInTheDocument();
    expect(screen.getByText('.myshopify.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue to Shopify' })).toBeDisabled();
  });

  it('shows a connected store at a glance, managed on its own page', () => {
    renderCard([connection()]);

    expect(screen.getByText('1 store connected')).toBeInTheDocument();
    expect(screen.queryByText('demo-store.myshopify.com')).not.toBeInTheDocument();
    expect(screen.getAllByText('Connected')).not.toHaveLength(0);
    expect(screen.getByRole('link', { name: 'Manage' })).toHaveAttribute('href', '/channels/c-1');
    expect(screen.queryByRole('button', { name: 'Disconnect' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Import products/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Connect/ })).not.toBeInTheDocument();
  });

  it('opens the store that needs attention first, and counts it', () => {
    renderCard([
      connection(),
      connection({
        id: 'c-2',
        status: ChannelConnectionStatus.NEEDS_REAUTH,
        statusReason: 'Connect the store again.',
      }),
    ]);

    expect(screen.getByText('2 stores connected · 1 needs re-auth')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Manage' })).toHaveAttribute('href', '/channels/c-2');
  });

  it('asks members who cannot manage the workspace to have an admin connect a store', () => {
    renderCard([], false);

    expect(screen.queryByRole('button', { name: 'Connect' })).not.toBeInTheDocument();
    expect(screen.getByText('Ask a workspace admin to connect it.')).toBeInTheDocument();
  });

  it('lets anyone open a connected store, whoever views it', () => {
    renderCard([connection()], false);

    expect(screen.getByRole('link', { name: 'Manage' })).toHaveAttribute('href', '/channels/c-1');
  });
});
