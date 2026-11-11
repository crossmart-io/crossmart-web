import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ChannelType, WorkspacePermission, WorkspaceRole, OutsideAgentChanges } from '@/api/schema';
import { channelRequestMailto } from '@/config/links';
import type * as Workspaces from '@/features/workspaces';
import { useMe, type Workspace } from '@/features/workspaces';
import {
  CHANNEL_PREVIEW_COPY,
  CHANNEL_STATUS_LABELS,
  CHANNELS,
  ChannelStatus,
  REQUEST_CHANNEL_COPY,
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
vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useMe: vi.fn<typeof useMe>(),
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
  outsideAgentChanges: OutsideAgentChanges.require_approval,
  role: WorkspaceRole.ADMIN,
  customRole: null,
  permissions: [WorkspacePermission.channels_manage],
};

const CONNECT_ACTION = 'Connect';
const MANAGE_ACTION = 'Manage';

function renderGrid(connections: ChannelConnection[] = [], platformAdmin = false) {
  vi.mocked(useMe).mockReturnValue({ data: { platformAdmin } } as ReturnType<typeof useMe>);
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

  it('leaves channels that cannot be connected out, with one way to request a marketplace', () => {
    renderGrid();

    for (const status of [
      ChannelStatus.ComingSoon,
      ChannelStatus.Planned,
      ChannelStatus.Community,
    ]) {
      for (const name of channelNames(status)) {
        expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
      }
    }
    expect(screen.getByRole('link', { name: REQUEST_CHANNEL_COPY.action })).toHaveAttribute(
      'href',
      channelRequestMailto(),
    );
  });

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
      '/stores/c-google',
    );
    expect(
      googleCard.queryByText(CHANNEL_STATUS_LABELS[ChannelStatus.ComingSoon]),
    ).not.toBeInTheDocument();
  });

  describe('as a platform admin', () => {
    it('lets them connect channels that are coming soon, as a preview', async () => {
      renderGrid([], true);

      for (const name of channelNames(ChannelStatus.ComingSoon)) {
        const previewCard = within(card(name));
        expect(
          previewCard.getByText(CHANNEL_STATUS_LABELS[ChannelStatus.ComingSoon]),
        ).toBeInTheDocument();
        expect(previewCard.getByText(CHANNEL_PREVIEW_COPY.note)).toBeInTheDocument();
      }

      await userEvent.click(
        within(card('Google Merchant Center')).getByRole('button', {
          name: CHANNEL_PREVIEW_COPY.connect,
        }),
      );
      expect(
        screen.getByRole('dialog', { name: 'Connect Google Merchant Center' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Merchant Center ID')).toBeInTheDocument();
    });

    it('still leaves planned and community channels out', () => {
      renderGrid([], true);

      for (const name of [
        ...channelNames(ChannelStatus.Planned),
        ...channelNames(ChannelStatus.Community),
      ]) {
        expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
      }
    });

    it('marks a previewed channel that already has stores', () => {
      renderGrid(
        [
          connectionFixture({
            id: 'c-google',
            channel: ChannelType.google_merchant,
            shopify: null,
          }),
        ],
        true,
      );

      const googleCard = within(card('Google Merchant Center'));
      expect(googleCard.getByRole('link', { name: MANAGE_ACTION })).toBeInTheDocument();
      expect(googleCard.getByText(CHANNEL_PREVIEW_COPY.note)).toBeInTheDocument();
    });
  });

  it('never shows the preview to people who do not run the instance', () => {
    renderGrid();

    expect(screen.queryByText(CHANNEL_PREVIEW_COPY.note)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: CHANNEL_PREVIEW_COPY.connect }),
    ).not.toBeInTheDocument();
  });
});
