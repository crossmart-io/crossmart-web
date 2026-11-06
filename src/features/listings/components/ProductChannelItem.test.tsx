import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  ChannelConnectionStatus,
  ChannelType,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  PublishRequirement,
} from '@/api/schema';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import { useAddToStore, useRemoveFromStore } from '../hooks/useProductChannels';
import { STORE_NOT_CONNECTED_COPY } from '../listings.constants';
import type { ProductChannel } from '../listings.types';
import { ProductChannelItem } from './ProductChannelItem';

vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useRemoveFromStore: vi.fn<typeof useRemoveFromStore>(),
  useAddToStore: vi.fn<typeof useAddToStore>(),
}));

const PRODUCT = {
  id: 'p-1',
  title: 'Linen shirt',
  vendor: null,
  descriptionHtml: '',
  tags: [],
  media: [],
};

const LISTING = {
  id: 'l-1',
  status: ListingStatus.ACTIVE,
  source: ListingSource.MANUAL,
  externalId: 'gid://shopify/Product/1',
  externalUrl: 'https://demo.example.com/products/linen-shirt',
  lastError: null,
  missingRequirement: null,
  lastSyncedAt: null,
  category: null,
};

function channel(overrides: Partial<ProductChannel> = {}): ProductChannel {
  return {
    connection: {
      id: 'c-1',
      channel: ChannelType.shopify,
      displayName: 'crossmartstore',
      status: ChannelConnectionStatus.CONNECTED,
      currencyCode: 'USD',
    },
    selected: false,
    displayState: ListingDisplayState.draft,
    displayReason: null,
    listing: null,
    override: null,
    variants: [],
    ...overrides,
  };
}

function renderItem(
  productChannel: ProductChannel,
  canEdit = true,
  extra: { storeMissing?: PublishRequirement[]; openOverride?: boolean } = {},
) {
  const removeFromStore = vi.fn<() => Promise<ProductChannel>>().mockResolvedValue(productChannel);
  vi.mocked(useRemoveFromStore).mockReturnValue({
    mutateAsync: removeFromStore,
  } as unknown as ReturnType<typeof useRemoveFromStore>);
  const addToStore = vi.fn<() => void>();
  vi.mocked(useAddToStore).mockReturnValue({
    mutate: addToStore,
    mutateAsync: vi.fn<() => Promise<ProductChannel>>().mockResolvedValue(productChannel),
    isPending: false,
  } as unknown as ReturnType<typeof useAddToStore>);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ul>
          <ProductChannelItem
            workspaceId="ws-1"
            product={PRODUCT}
            channel={productChannel}
            canEdit={canEdit}
            storeMissing={extra.storeMissing}
            openOverride={extra.openOverride}
          />
        </ul>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { removeFromStore, addToStore };
}

describe('ProductChannelItem', () => {
  it('adds a product that is not in the store in one click', async () => {
    const { addToStore } = renderItem(channel());

    expect(screen.getByText('Draft')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add to store' }));

    expect(addToStore).toHaveBeenCalled();
  });

  it('adds it with this store’s changes from the overrides panel', async () => {
    renderItem(channel());

    await userEvent.click(screen.getByRole('button', { name: 'Add with changes…' }));

    expect(screen.getByRole('dialog', { name: 'Add to crossmartstore' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to store' })).toHaveAttribute('type', 'submit');
  });

  it('overrides, views or removes a product the store has, after confirming the removal', async () => {
    const { removeFromStore } = renderItem(
      channel({
        selected: true,
        displayState: ListingDisplayState.published,
        listing: LISTING,
      }),
    );

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Override for this store' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(removeFromStore).toHaveBeenCalled();
  });

  it('only shows where the product stands to members who may not change it', () => {
    renderItem(channel(), false);

    expect(screen.queryByRole('button', { name: 'Add to store' })).not.toBeInTheDocument();
  });

  it('blocks adding to a store that needs reconnecting, and says why', () => {
    const base = channel();
    const { addToStore } = renderItem({
      ...base,
      connection: { ...base.connection, status: ChannelConnectionStatus.NEEDS_REAUTH },
    });

    expect(screen.getByRole('button', { name: 'Add to store' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add with changes…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add to store' })).toHaveAccessibleDescription(
      new RegExp(STORE_NOT_CONNECTED_COPY.reason),
    );
    expect(screen.getByRole('link', { name: STORE_NOT_CONNECTED_COPY.action })).toBeInTheDocument();
    expect(addToStore).not.toHaveBeenCalled();
  });

  it('opens the overrides panel to fill in what the store refused the product for', async () => {
    renderItem(
      channel({
        selected: true,
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Brand is required',
        listing: {
          ...LISTING,
          status: ListingStatus.ERROR,
          missingRequirement: PublishRequirement.item_specifics,
        },
      }),
    );

    expect(screen.getByText('Needs details')).toBeInTheDocument();
    expect(screen.getByText('Brand is required')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Fill in item specifics' }));

    expect(screen.getByRole('dialog', { name: /crossmartstore/ })).toBeInTheDocument();
  });

  it('opens the overrides panel at once when a fix link asked for it', () => {
    renderItem(channel({ selected: true, listing: LISTING }), true, { openOverride: true });

    expect(screen.getByRole('dialog', { name: /crossmartstore/ })).toBeInTheDocument();
  });

  it('points a product waiting on the store’s setup to that setup', () => {
    renderItem(
      channel({
        selected: true,
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Choose the country and the product page address.',
      }),
      true,
      { storeMissing: [PublishRequirement.listing_setup] },
    );

    expect(screen.getByRole('link', { name: 'Open listing setup' })).toHaveAttribute(
      'href',
      '/channels/c-1/settings#listing-setup',
    );
  });
});
