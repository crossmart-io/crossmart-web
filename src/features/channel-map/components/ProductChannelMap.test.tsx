import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ListingDisplayState } from '@/api/schema';
import { useProductChannelMap } from '../hooks/useProductChannelMap';
import { listingFixture, productChannelFixture } from '@/features/listings/testing/listing.fixture';
import { stubMatchMedia } from '../testing/match-media';
import { ProductChannelMap } from './ProductChannelMap';

vi.mock('../hooks/useProductChannelMap', () => ({
  useProductChannelMap: vi.fn<typeof useProductChannelMap>(),
}));

type MapState = ReturnType<typeof useProductChannelMap>;

const published = productChannelFixture();
const failed = productChannelFixture({
  connection: {
    id: 'c-2',
    channel: published.connection.channel,
    displayName: 'Outlet',
    status: ChannelConnectionStatus.CONNECTED,
    currencyCode: 'USD',
  },
  displayState: ListingDisplayState.failed,
  displayReason: 'The handle is taken',
  listing: listingFixture({ externalUrl: null }),
});

function mockMap(overrides: Partial<MapState> = {}): MapState {
  const state = {
    channels: { data: [published, failed], isPending: false },
    suggestionsByStore: new Map(),
    suggestionCounts: new Map(),
    openChannel: undefined,
    open: vi.fn<(id: string) => void>(),
    close: vi.fn<() => void>(),
    editOverrides: vi.fn<(id: string) => void>(),
    ...overrides,
  } as unknown as MapState;
  vi.mocked(useProductChannelMap).mockReturnValue(state);
  return state;
}

function renderMap() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ProductChannelMap
          workspaceId="ws-1"
          productId="p-1"
          product={{ title: 'Linen shirt', imageUrl: null }}
          canEdit
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProductChannelMap', () => {
  beforeEach(() => stubMatchMedia(false));
  afterEach(() => vi.unstubAllGlobals());

  it('lists the product and each store on a narrow screen', () => {
    mockMap();
    renderMap();
    expect(screen.getByText('Live in 1 of 2 stores')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'demo-store: Published. Open details' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Outlet: Failed. Open details' })).toBeVisible();
  });

  it('opens a store’s details from its node', async () => {
    const state = mockMap();
    renderMap();
    await userEvent.click(screen.getByRole('button', { name: /Outlet: Failed/ }));
    expect(state.open).toHaveBeenCalledWith('c-2');
  });

  it('offers the existing fixes in a failed store’s panel', async () => {
    const state = mockMap({ openChannel: failed });
    renderMap();
    const panel = await screen.findByRole('dialog');
    expect(panel).toHaveTextContent('The handle is taken');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Edit for this store' }));
    expect(state.editOverrides).toHaveBeenCalledWith('c-2');
  });

  it('links a published listing to the store', async () => {
    mockMap({ openChannel: published });
    renderMap();
    await screen.findByRole('dialog');
    expect(screen.getByRole('link', { name: 'View on the store' })).toHaveAttribute(
      'href',
      'https://demo.example.com/products/linen-shirt',
    );
  });
});
