import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ListingDisplayState } from '@/api/schema';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import { useProductChannels } from '../hooks/useProductChannels';
import { CHANNEL_CARD_COPY, OverrideSheetMode } from '../listings.constants';
import { LocationDisplay } from '../testing/LocationDisplay';
import { productChannelFixture } from '../testing/listing.fixture';
import type { ListingEditorSheetProps } from './ListingEditorSheet';
import { ProductChannelsCard } from './ProductChannelsCard';

vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useProductChannels: vi.fn<typeof useProductChannels>(),
}));
vi.mock('../hooks/useStoreMissing', () => ({ useStoreMissing: () => undefined }));
vi.mock('./ListingEditorSheet', () => ({
  ListingEditorSheet: ({ listingRef, mode, onClose }: ListingEditorSheetProps) => (
    <dialog open aria-label={`Editor ${listingRef.connectionId} ${mode}`}>
      <button type="button" onClick={onClose}>
        Close editor
      </button>
    </dialog>
  ),
}));

const IN_STORE = productChannelFixture();
const NOT_IN_STORE = productChannelFixture({
  connection: { ...IN_STORE.connection, id: 'c-2', displayName: 'ebaystore' },
  selected: false,
  displayState: ListingDisplayState.draft,
  listing: null,
});

function renderCard(initialEntry = '/products/p-1') {
  vi.mocked(useProductChannels).mockReturnValue({
    data: [IN_STORE, NOT_IN_STORE],
    isPending: false,
  } as unknown as ReturnType<typeof useProductChannels>);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <ProductChannelsCard workspaceId="ws-1" productId="p-1" catalogCurrency="USD" canEdit />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProductChannelsCard', () => {
  it('opens a store’s listing editor from its card, named in the URL', async () => {
    renderCard();

    await userEvent.click(screen.getByRole('button', { name: CHANNEL_CARD_COPY.edit }));

    expect(
      screen.getByRole('dialog', { name: `Editor c-1 ${OverrideSheetMode.Edit}` }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/products/p-1?override=c-1');
    await userEvent.click(screen.getByRole('button', { name: 'Close editor' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/products\/p-1$/);
  });

  it('opens the editor to add the product to a store it is not in', async () => {
    renderCard();

    await userEvent.click(
      screen.getByRole('button', { name: `${CHANNEL_CARD_COPY.openListing} ebaystore` }),
    );

    expect(
      screen.getByRole('dialog', { name: `Editor c-2 ${OverrideSheetMode.Add}` }),
    ).toBeInTheDocument();
  });

  it('opens the editor at once from a link to the store’s listing', () => {
    renderCard('/products/p-1?override=c-1');

    expect(
      screen.getByRole('dialog', { name: `Editor c-1 ${OverrideSheetMode.Edit}` }),
    ).toBeInTheDocument();
  });

  it('opens a link to a store the product is not in ready to add it', () => {
    renderCard('/products/p-1?override=c-2');

    expect(
      screen.getByRole('dialog', { name: `Editor c-2 ${OverrideSheetMode.Add}` }),
    ).toBeInTheDocument();
  });
});
