import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { ChannelConnectionStatus } from '@/api/schema';
import { RECONNECT_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionFixture } from '../testing/channel-connection.fixture';
import { ReconnectAlert } from './ReconnectAlert';

function renderAlert(connection: ChannelConnection, canManage = true) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ReconnectAlert workspaceId="ws-1" connection={connection} canManage={canManage} />
    </QueryClientProvider>,
  );
}

const REASON = 'Shopify revoked the access token.';

describe('ReconnectAlert', () => {
  it('says nothing for a connected store', () => {
    renderAlert(connectionFixture());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ChannelConnectionStatus.NEEDS_REAUTH,
    ChannelConnectionStatus.ERROR,
    ChannelConnectionStatus.DISCONNECTED,
  ])('shows the stored reason and Reconnect for a %s store', (status) => {
    renderAlert(connectionFixture({ status, statusReason: REASON }));

    expect(screen.getByText(REASON)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: RECONNECT_COPY.action })).toBeInTheDocument();
  });

  it('explains the problem when the API gave no reason', () => {
    renderAlert(connectionFixture({ status: ChannelConnectionStatus.NEEDS_REAUTH }));
    expect(screen.getByText(RECONNECT_COPY.fallbackReason)).toBeInTheDocument();
  });

  it('asks members who cannot reconnect to get an admin', () => {
    renderAlert(connectionFixture({ status: ChannelConnectionStatus.ERROR }), false);

    expect(screen.queryByRole('button', { name: RECONNECT_COPY.action })).not.toBeInTheDocument();
    expect(screen.getByText(RECONNECT_COPY.askAdmin)).toBeInTheDocument();
  });
});
