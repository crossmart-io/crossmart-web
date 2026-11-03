import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ChannelType, ListingSource, ListingStatus } from '@/api/schema';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import { useAddToStore, useRemoveFromStore } from '../hooks/useProductChannels';
import type { ProductChannel } from '../listings.types';
import { ProductChannelItem } from './ProductChannelItem';

vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useRemoveFromStore: vi.fn<typeof useRemoveFromStore>(),
  useAddToStore: vi.fn<typeof useAddToStore>(),
}));

const PRODUCT = { id: 'p-1', title: 'Linen shirt', descriptionHtml: '' };

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
    listing: null,
    override: null,
    variants: [],
    ...overrides,
  };
}

function renderItem(productChannel: ProductChannel, canEdit = true) {
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

    expect(screen.getByText('Not in this store')).toBeInTheDocument();
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
        listing: {
          id: 'l-1',
          status: ListingStatus.ACTIVE,
          source: ListingSource.MANUAL,
          externalId: 'gid://shopify/Product/1',
          externalUrl: 'https://demo.example.com/products/linen-shirt',
          lastError: null,
          lastSyncedAt: null,
        },
      }),
    );

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
});
