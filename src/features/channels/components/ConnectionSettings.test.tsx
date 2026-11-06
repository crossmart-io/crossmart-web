import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { ChannelConnectionStatus, EbayMarketplaceId } from '@/api/schema';
import {
  connectionFixture,
  ebayConnectionFixture,
  NO_EBAY_DEFAULTS,
} from '../testing/channel-connection.fixture';
import type { ChannelConnection } from '../channels.types';
import { ConnectionSettings } from './ConnectionSettings';

interface Access {
  canManage?: boolean;
  canImportProducts?: boolean;
}

function renderSettings(connection: ChannelConnection, access: Access = {}) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ConnectionSettings
        workspaceId="ws-1"
        connection={connection}
        canManage={access.canManage ?? true}
        canImportProducts={access.canImportProducts ?? true}
        onDisconnected={() => undefined}
      />
    </QueryClientProvider>,
  );
}

describe('ConnectionSettings', () => {
  it('shows the store’s pricing near the top, before its automatic rule', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ConnectionSettings
          workspaceId="ws-1"
          connection={connectionFixture()}
          canManage
          canImportProducts
          onDisconnected={() => undefined}
          pricing={<section aria-label="Pricing" />}
          automaticRule={<section aria-label="Automatic rule" />}
        />
      </QueryClientProvider>,
    );

    const pricing = screen.getByRole('region', { name: 'Pricing' });
    const rule = screen.getByRole('region', { name: 'Automatic rule' });
    expect(pricing.compareDocumentPosition(rule) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

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
    renderSettings(connectionFixture(), { canManage: false, canImportProducts: false });

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

  it('shows an eBay account’s marketplace and says when business policies are off', () => {
    renderSettings(ebayConnectionFixture());

    expect(screen.getByText('demo_seller')).toBeInTheDocument();
    expect(screen.getByText('eBay UK (GBP)')).toBeInTheDocument();
    expect(screen.getByText('GBP')).toBeInTheDocument();
    expect(screen.getByText('Business policies are off on this eBay account')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Listing defaults' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opt in to business policies' })).toBeInTheDocument();
    expect(screen.queryByText('Domain')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Import products/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
  });

  it('counts an eBay account’s business policies', () => {
    renderSettings(
      ebayConnectionFixture({
        ebay: {
          marketplaceId: EbayMarketplaceId.EBAY_US,
          currencyCode: 'USD',
          username: 'demo_seller',
          userId: 'user-1',
          businessPoliciesEnabled: true,
          policies: {
            fulfillment: [
              { id: '1', name: 'Free shipping' },
              { id: '2', name: 'Express' },
            ],
            payment: [{ id: '3', name: 'Managed payments' }],
            return: [],
          },
          listingDefaults: NO_EBAY_DEFAULTS,
          readyToList: false,
        },
      }),
    );

    expect(screen.getByText('2 shipping · 1 payment · 0 return')).toBeInTheDocument();
  });
});
