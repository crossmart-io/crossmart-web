import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { ChannelConnectionStatus, ChannelType } from '@/api/schema';
import { CHANNELS, type ChannelInfo, type ConnectableChannel } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { ConnectableChannelCard } from './ConnectableChannelCard';

function shopifyChannel(): { channel: ChannelInfo; connect: ConnectableChannel } {
  const channel = CHANNELS.find((info) => info.connect?.type === ChannelType.shopify);
  if (!channel?.connect) throw new Error('Shopify is not connectable');
  return { channel, connect: channel.connect };
}

const { channel: SHOPIFY, connect: CONNECT } = shopifyChannel();

function connection(overrides: Partial<ChannelConnection> = {}): ChannelConnection {
  return {
    id: 'c-1',
    channel: ChannelType.shopify,
    externalAccountId: 'demo-store.myshopify.com',
    displayName: 'Demo Store',
    status: ChannelConnectionStatus.CONNECTED,
    statusReason: null,
    grantedScopes: [],
    shopify: {
      shopName: 'Demo Store',
      currencyCode: 'USD',
      ianaTimezone: null,
      primaryDomainUrl: null,
      primaryLocation: null,
    },
    productSelection: null,
    connectedAt: '2026-11-03T09:00:00Z',
    disconnectedAt: null,
    lastSyncedAt: null,
    createdAt: '2026-11-03T09:00:00Z',
    updatedAt: '2026-11-03T09:00:00Z',
    ...overrides,
  };
}

function renderCard(connections: ChannelConnection[], canManage = true, canEditCatalog = false) {
  const element: ReactElement = (
    <QueryClientProvider client={new QueryClient()}>
      <ConnectableChannelCard
        workspaceId="ws-1"
        channel={SHOPIFY}
        connect={CONNECT}
        connections={connections}
        canManage={canManage}
        canEditCatalog={canEditCatalog}
      />
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

  it('shows a connected store with its status and a disconnect action', () => {
    renderCard([connection()]);

    expect(screen.getByText('demo-store.myshopify.com')).toBeInTheDocument();
    expect(screen.getAllByText('Connected')).not.toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect another store' })).toBeInTheDocument();
  });

  it('asks to reconnect a store that needs re-auth', () => {
    renderCard([
      connection({
        status: ChannelConnectionStatus.NEEDS_REAUTH,
        statusReason: 'Connect the store again.',
      }),
    ]);

    expect(screen.getAllByText('Needs re-auth')).not.toHaveLength(0);
    expect(screen.getByText('Connect the store again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reconnect' })).toBeInTheDocument();
  });

  it('hides management actions from members who cannot manage the workspace', () => {
    renderCard([connection()], false);

    expect(screen.queryByRole('button', { name: 'Disconnect' })).not.toBeInTheDocument();
    expect(screen.getByText('Ask a workspace admin to connect it.')).toBeInTheDocument();
  });

  it('offers catalog editors an import of a connected store, but not of one needing re-auth', () => {
    renderCard(
      [
        connection(),
        connection({ id: 'c-2', status: ChannelConnectionStatus.NEEDS_REAUTH, shopify: null }),
      ],
      false,
      true,
    );

    expect(screen.getAllByRole('button', { name: 'Import products from Shopify' })).toHaveLength(1);
  });
});
