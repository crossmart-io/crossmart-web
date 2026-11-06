import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ChannelProductState, ListingDisplayState, ProductStatus } from '@/api/schema';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import { useChannelProducts } from '../hooks/useChannelProducts';
import type { ChannelProduct } from '../listings.types';
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

function renderCard(initialEntry = '/channels/c-1') {
  vi.mocked(useChannelProducts).mockReturnValue({
    items: [ROW],
    total: 1,
    pageCount: 1,
    counts: undefined,
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
    expect(screen.getByTestId('location')).toHaveTextContent('/channels/c-1?listing=p-1');
    await userEvent.click(screen.getByRole('button', { name: 'Close editor' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/channels\/c-1$/);
  });

  it('opens the editor at once from a shared link', () => {
    renderCard('/channels/c-1?listing=p-1');

    expect(screen.getByRole('dialog', { name: 'Editor p-1 in c-1' })).toBeInTheDocument();
  });
});
