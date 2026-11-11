import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ListingDisplayState } from '@/api/schema';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { useCatalogStats } from '@/features/catalog/hooks/useCatalogStats';
import { useListingHealth } from '@/features/listing-health/hooks/useListingHealth';
import {
  reportFixture,
  storeHealthFixture,
} from '@/features/listing-health/testing/listing-health.fixture';
import { stubMatchMedia } from '../testing/match-media';
import { AccountChannelMap } from './AccountChannelMap';

vi.mock('@/features/listing-health/hooks/useListingHealth', () => ({
  useListingHealth: vi.fn<typeof useListingHealth>(),
}));
vi.mock('@/features/catalog/hooks/useCatalogStats', () => ({
  useCatalogStats: vi.fn<typeof useCatalogStats>(),
}));

function mockData() {
  const report = reportFixture({
    stores: [storeHealthFixture({ [ListingDisplayState.published]: 3 })],
  });
  vi.mocked(useListingHealth).mockReturnValue({
    data: report,
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useListingHealth>);
  vi.mocked(useCatalogStats).mockReturnValue({
    data: { products: 12 },
  } as unknown as ReturnType<typeof useCatalogStats>);
}

function renderMap(props: Partial<ComponentProps<typeof AccountChannelMap>> = {}) {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <AccountChannelMap workspaceId="ws-1" {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('AccountChannelMap', () => {
  beforeEach(mockData);
  afterEach(() => vi.unstubAllGlobals());

  it('falls back to a list of the same nodes on a narrow screen', () => {
    stubMatchMedia(false);
    renderMap();
    expect(screen.queryByRole('region', { name: /Map of your catalog/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Map' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the products list' })).toHaveTextContent(
      '12 products',
    );
    expect(screen.getByRole('link', { name: 'Open North shop’s listings' })).toBeVisible();
    expect(screen.getByText('Google Merchant Center')).toBeInTheDocument();
    expect(screen.getByText('Etsy')).toBeInTheDocument();
  });

  it('offers the list beside the graph on a wide screen', async () => {
    stubMatchMedia(true);
    renderMap();
    expect(screen.getByRole('region', { name: 'Map of your catalog and stores' })).toBeVisible();
    await userEvent.click(screen.getByRole('radio', { name: 'List' }));
    expect(screen.queryByRole('region', { name: /Map of your catalog/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open North shop’s listings' })).toBeVisible();
  });

  it('offers fit and zoom controls when the map fills a column, and only then', () => {
    stubMatchMedia(true);
    renderMap({ fill: true });
    expect(screen.getByLabelText('Map zoom')).toBeVisible();
    for (const name of [/fit view/i, /zoom in/i, /zoom out/i]) {
      expect(screen.getByRole('button', { name })).toBeVisible();
    }
    expect(screen.queryByRole('button', { name: /toggle interactivity/i })).not.toBeInTheDocument();
  });

  it('keeps a map sized to its graph free of controls', () => {
    stubMatchMedia(true);
    renderMap();
    expect(screen.queryByRole('button', { name: /fit view/i })).not.toBeInTheDocument();
  });

  it('leaves out the channels coming soon when asked, as Crossmart Agent’s map does', () => {
    stubMatchMedia(false);
    renderMap({ showComingSoon: false, fill: true });
    expect(screen.getByRole('link', { name: 'Open North shop’s listings' })).toBeVisible();
    expect(screen.queryByText('Etsy')).not.toBeInTheDocument();
  });
});
