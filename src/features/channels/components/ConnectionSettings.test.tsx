import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { ChannelConnectionStatus } from '@/api/schema';
import { connectionFixture } from '../testing/channel-connection.fixture';
import type { ChannelConnection } from '../channels.types';
import { ConnectionSettings } from './ConnectionSettings';

interface Access {
  canManage?: boolean;
  canEditCatalog?: boolean;
}

function renderSettings(connection: ChannelConnection, access: Access = {}) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ConnectionSettings
        workspaceId="ws-1"
        connection={connection}
        canManage={access.canManage ?? true}
        canEditCatalog={access.canEditCatalog ?? true}
        onDisconnected={() => undefined}
      />
    </QueryClientProvider>,
  );
}

describe('ConnectionSettings', () => {
  it('shows the store, its stock location and the permissions it granted', () => {
    renderSettings(
      connectionFixture({
        grantedScopes: ['write_products', 'read_locations'],
        shopify: {
          shopName: 'Demo Store',
          currencyCode: 'EUR',
          ianaTimezone: null,
          primaryDomainUrl: 'https://demo.example.com',
          primaryLocation: { id: 'gid://shopify/Location/1', name: 'Main warehouse' },
        },
      }),
    );

    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('Main warehouse')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://demo.example.com' })).toHaveAttribute(
      'href',
      'https://demo.example.com',
    );
    expect(screen.getByText('write_products')).toBeInTheDocument();
  });

  it('offers the import and the connection actions to those allowed to use them', () => {
    renderSettings(connectionFixture());

    expect(
      screen.getByRole('button', { name: 'Import products from Shopify' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
  });

  it('hides the import and the connection actions from those who may not use them', () => {
    renderSettings(connectionFixture(), { canManage: false, canEditCatalog: false });

    expect(screen.queryByRole('button', { name: /Import products/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Disconnect' })).not.toBeInTheDocument();
  });

  it('asks to reconnect, and does not import, while the store needs approval again', () => {
    renderSettings(
      connectionFixture({
        status: ChannelConnectionStatus.NEEDS_REAUTH,
        statusReason: 'The store removed Crossmart’s access.',
      }),
    );

    expect(screen.getByText('The store removed Crossmart’s access.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reconnect' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Import products/ })).not.toBeInTheDocument();
  });
});
