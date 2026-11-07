import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelType, WorkspacePermission, WorkspaceRole } from '@/api/schema';
import { channelRequestMailto } from '@/config/links';
import type { Workspace } from '@/features/workspaces';
import {
  CHANNEL_ROADMAP_ACTION_LABELS,
  CHANNEL_STATUS_LABELS,
  CHANNELS,
  ChannelStatus,
} from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import type * as ChannelConnectionHooks from '../hooks/useChannelConnections';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { connectionFixture } from '../testing/channel-connection.fixture';
import { ChannelGrid } from './ChannelGrid';

vi.mock('../hooks/useChannelConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ChannelConnectionHooks>()),
  useChannelConnections: vi.fn<typeof useChannelConnections>(),
}));

const WORKSPACE: Workspace = {
  id: 'ws-1',
  organizationId: 'org-1',
  name: 'Default',
  displayName: 'Demo Seller',
  slug: 'default',
  currency: 'USD',
  timeZone: null,
  sandbox: null,
  role: WorkspaceRole.ADMIN,
  customRole: null,
  permissions: [WorkspacePermission.channels_manage],
};

const CONNECT_ACTION = 'Connect';
const MANAGE_ACTION = 'Manage';

function renderGrid(connections: ChannelConnection[] = []) {
  vi.mocked(useChannelConnections).mockReturnValue({
    data: connections,
  } as unknown as ReturnType<typeof useChannelConnections>);
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ChannelGrid workspace={WORKSPACE} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/** The card of the channel with this name. */
function card(channelName: string): HTMLElement {
  const heading = screen.getByRole('heading', { name: channelName });
  const element = heading.closest<HTMLElement>('[data-slot="card"]');
  if (!element) throw new Error(`${channelName} has no card`);
  return element;
}

function channelNames(status: ChannelStatus): string[] {
  return CHANNELS.filter((channel) => channel.status === status).map((channel) => channel.name);
}

describe('ChannelGrid', () => {
  it('lists Shopify and eBay as live, and Google and Etsy as coming soon', () => {
    expect(channelNames(ChannelStatus.Live)).toEqual(['Shopify', 'eBay']);
    expect(channelNames(ChannelStatus.ComingSoon)).toEqual(['Google Merchant Center', 'Etsy']);
  });

  it('lets merchants connect live channels', () => {
    renderGrid();

    for (const name of channelNames(ChannelStatus.Live)) {
      const liveCard = within(card(name));
      expect(liveCard.getByText(CHANNEL_STATUS_LABELS[ChannelStatus.Live])).toBeInTheDocument();
      expect(liveCard.getByRole('button', { name: CONNECT_ACTION })).toBeInTheDocument();
    }
  });

  it.each([ChannelStatus.ComingSoon, ChannelStatus.Planned, ChannelStatus.Community] as const)(
    'shows %s channels with their status and no way to connect',
    (status) => {
      renderGrid();

      for (const name of channelNames(status)) {
        const roadmapCard = within(card(name));
        expect(roadmapCard.getByText(CHANNEL_STATUS_LABELS[status])).toBeInTheDocument();
        expect(
          roadmapCard.getByRole('link', { name: CHANNEL_ROADMAP_ACTION_LABELS[status] }),
        ).toHaveAttribute('href', channelRequestMailto(name));
        expect(roadmapCard.queryByRole('button', { name: CONNECT_ACTION })).not.toBeInTheDocument();
      }
    },
  );

  it('keeps stores already connected to a channel that is coming soon reachable', () => {
    renderGrid([
      connectionFixture({
        id: 'c-google',
        channel: ChannelType.google_merchant,
        shopify: null,
      }),
    ]);

    const googleCard = within(card('Google Merchant Center'));
    expect(googleCard.getByRole('link', { name: MANAGE_ACTION })).toHaveAttribute(
      'href',
      '/channels/c-google',
    );
    expect(
      googleCard.queryByText(CHANNEL_STATUS_LABELS[ChannelStatus.ComingSoon]),
    ).not.toBeInTheDocument();
  });
});
