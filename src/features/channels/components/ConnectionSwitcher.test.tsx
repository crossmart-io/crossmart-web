import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import type { ChannelConnection } from '../channels.types';
import type * as ConnectionHooks from '../hooks/useChannelConnections';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { connectionFixture } from '../testing/channel-connection.fixture';
import { ConnectionSwitcher } from './ConnectionSwitcher';

vi.mock('../hooks/useChannelConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ConnectionHooks>()),
  useChannelConnections: vi.fn<typeof useChannelConnections>(),
}));

const MAIN = connectionFixture();
const OUTLET = connectionFixture({
  id: 'c-2',
  externalAccountId: 'outlet.myshopify.com',
  displayName: 'Outlet',
  shopify: null,
});
const GONE = connectionFixture({
  id: 'c-3',
  displayName: 'Closed store',
  shopify: null,
  status: ChannelConnectionStatus.DISCONNECTED,
});

function CurrentPath() {
  return <p data-testid="path">{useLocation().pathname}</p>;
}

function renderSwitcher(connections: ChannelConnection[], canManage = true) {
  vi.mocked(useChannelConnections).mockReturnValue({ data: connections } as ReturnType<
    typeof useChannelConnections
  >);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/channels/c-1/settings']}>
        <ConnectionSwitcher
          workspaceId="ws-1"
          connection={MAIN}
          tab="settings"
          canManage={canManage}
        />
        <Routes>
          <Route path={ROUTES.channelConnectionTab} element={<CurrentPath />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ConnectionSwitcher', () => {
  it('lists the channel’s connected stores and switches to one on the same tab', async () => {
    renderSwitcher([MAIN, OUTLET, GONE]);

    await userEvent.click(screen.getByRole('button', { name: /Switch store/ }));
    expect(screen.queryByRole('menuitem', { name: /Closed store/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: /Outlet/ }));

    expect(screen.getByTestId('path')).toHaveTextContent('/channels/c-2/settings');
  });

  it('connects another store from the menu', async () => {
    renderSwitcher([MAIN]);

    await userEvent.click(screen.getByRole('button', { name: /Switch store/ }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Connect another store' }));

    expect(screen.getByRole('dialog', { name: 'Connect Shopify' })).toBeInTheDocument();
  });

  it('does not offer to connect a store to members who cannot manage the workspace', async () => {
    renderSwitcher([MAIN], false);

    await userEvent.click(screen.getByRole('button', { name: /Switch store/ }));

    expect(
      screen.queryByRole('menuitem', { name: 'Connect another store' }),
    ).not.toBeInTheDocument();
  });
});
