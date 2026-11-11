import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  ChannelProductState,
  ChannelProductView,
  ListingDisplayState,
  ProductStatus,
} from '@/api/schema';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import { useChannelProducts } from '../hooks/useChannelProducts';
import type { ChannelProduct, ChannelProductCounts } from '../listings.types';
import { LocationDisplay } from '../testing/LocationDisplay';
import { ChannelProductsCard } from './ChannelProductsCard';
import type { ListingEditorSheetProps } from './ListingEditorSheet';

vi.mock('../hooks/useChannelProducts', () => ({
  useChannelProducts: vi.fn<typeof useChannelProducts>(),
}));
vi.mock('../hooks/useStoreProducts', () => ({
  useAddStoreProducts: () => ({ mutate: vi.fn<() => void>() }),
  useRemoveStoreProducts: () => ({ mutateAsync: vi.fn<() => Promise<void>>() }),
}));
vi.mock('./ListingEditorSheet', () => ({
  ListingEditorSheet: ({ listingRef, onClose }: ListingEditorSheetProps) => (
    <dialog open aria-label={`Editor ${listingRef.productId} in ${listingRef.connectionId}`}>
      <button type="button" onClick={onClose}>
        Close editor
      </button>
    </dialog>
  ),
}));

const ROW: ChannelProduct = {
  product: {
    id: 'p-1',
    handle: 'linen-shirt',
    title: 'Linen shirt',
    status: ProductStatus.ACTIVE,
    vendor: null,
    productType: null,
    condition: null,
    variantCount: 1,
    totalAvailable: 4,
    priceRange: null,
    imageUrl: null,
    stores: [],
    updatedAt: '2026-11-03T09:00:00Z',
  },
  state: ChannelProductState.excluded,
  displayState: ListingDisplayState.draft,
  displayReason: null,
  displayRequirement: null,
  listing: null,
};

const COUNTS: ChannelProductCounts = {
  listed: 2,
  pending: 2,
  failed: 1,
  removing: 2,
  removed_by_hand: 1,
  excluded: 4,
  needsDetails: 2,
  needsAttention: 3,
};

function renderCard(initialEntry = '/stores/c-1', counts?: ChannelProductCounts) {
  vi.mocked(useChannelProducts).mockClear();
  vi.mocked(useChannelProducts).mockReturnValue({
    isSuccess: true,
    items: [ROW],
    total: 1,
    pageCount: 1,
    counts,
    isPending: false,
    isError: false,
    isPlaceholderData: false,
  } as unknown as ReturnType<typeof useChannelProducts>);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <ChannelProductsCard
          workspaceId="ws-1"
          catalogCurrency="USD"
          connection={connectionFixture()}
          canEdit
        />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ChannelProductsCard', () => {
  it('opens a product’s listing editor over the list, without leaving the store', async () => {
    renderCard();

    await userEvent.click(screen.getByRole('link', { name: 'Linen shirt' }));

    expect(screen.getByRole('dialog', { name: 'Editor p-1 in c-1' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/stores/c-1?listing=p-1');
    await userEvent.click(screen.getByRole('button', { name: 'Close editor' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores\/c-1$/);
  });

  it('opens the editor at once from a shared link', () => {
    renderCard('/stores/c-1?listing=p-1');

    expect(screen.getByRole('dialog', { name: 'Editor p-1 in c-1' })).toBeInTheDocument();
  });

  it('lists Needs attention in one request, and counts every tab', () => {
    renderCard('/stores/c-1?state=attention', COUNTS);
    const queried = vi.mocked(useChannelProducts).mock.calls.map(([, query]) => query);

    expect(queried.length).toBeGreaterThan(0);
    expect(queried.every((query) => query.view === ChannelProductView.needs_attention)).toBe(true);
    expect(screen.getByRole('radio', { name: /Needs attention/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: /Needs attention/ })).toHaveTextContent('3');
    expect(screen.getByRole('radio', { name: /All/ })).toHaveTextContent('7');
  });

  it('starts another view on its first page', async () => {
    renderCard('/stores/c-1?state=attention&page=3');

    await userEvent.click(screen.getByRole('radio', { name: /Live/ }));

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores\/c-1\?state=live$/);
  });

  it('keeps an older link to one state precise, under its tab', () => {
    renderCard('/stores/c-1?state=failed');
    const queried = vi.mocked(useChannelProducts).mock.calls.map(([, query]) => query);

    expect(queried.every((query) => query.state === ChannelProductState.failed)).toBe(true);
    expect(queried.every((query) => query.view === undefined)).toBe(true);
    expect(screen.getByRole('radio', { name: /Needs attention/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
