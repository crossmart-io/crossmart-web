import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type * as Catalog from '@/features/catalog';
import { useCatalogStats } from '@/features/catalog';
import type * as Channels from '@/features/channels';
import { useChannelConnections } from '@/features/channels';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import type { ChannelConnection } from '@/features/channels';
import { CatalogStatsGrid } from './CatalogStatsGrid';

vi.mock('@/features/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof Catalog>()),
  useCatalogStats: vi.fn<typeof useCatalogStats>(),
}));

vi.mock('@/features/channels', async (importOriginal) => ({
  ...(await importOriginal<typeof Channels>()),
  useChannelConnections: vi.fn<typeof useChannelConnections>(),
}));

function renderWithConnections(connections: ChannelConnection[]) {
  vi.mocked(useCatalogStats).mockReturnValue({ data: undefined } as unknown as ReturnType<
    typeof useCatalogStats
  >);
  vi.mocked(useChannelConnections).mockReturnValue({ data: connections } as unknown as ReturnType<
    typeof useChannelConnections
  >);
  render(
    <MemoryRouter>
      <CatalogStatsGrid workspaceId="ws-1" />
    </MemoryRouter>,
  );
}

describe('CatalogStatsGrid', () => {
  it('names every connectable channel when no store is connected', () => {
    renderWithConnections([]);
    expect(
      screen.getByText(
        'Connect Shopify, eBay or Google Merchant Center to sync products and stock',
      ),
    ).toBeInTheDocument();
  });

  it('summarises the connected stores', () => {
    renderWithConnections([connectionFixture()]);
    expect(screen.getByText('1 store connected')).toBeInTheDocument();
  });
});
