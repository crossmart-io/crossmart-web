import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  ChannelConnectionStatus,
  ListingDisplayState,
  PriceSource,
  PriceStepKind,
  PublishRequirement,
} from '@/api/schema';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import { useAddToStore, useRetryListing } from '../hooks/useProductChannels';
import {
  CHANNEL_CARD_COPY,
  PRICE_EXPLANATION_COPY,
  RETRY_COPY,
  STORE_NOT_CONNECTED_COPY,
} from '../listings.constants';
import type { ProductChannel } from '../listings.types';
import {
  channelVariantFixture,
  listingFixture,
  productChannelFixture,
} from '../testing/listing.fixture';
import { ProductChannelItem } from './ProductChannelItem';

vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useAddToStore: vi.fn<typeof useAddToStore>(),
  useRetryListing: vi.fn<typeof useRetryListing>(),
}));

const NOT_IN_STORE = productChannelFixture({
  selected: false,
  displayState: ListingDisplayState.draft,
  listing: null,
});

interface RenderOptions {
  canEdit?: boolean;
}

function renderItem(channel: ProductChannel, options: RenderOptions = {}) {
  const addToStore = vi.fn<() => void>();
  vi.mocked(useAddToStore).mockReturnValue({
    mutate: addToStore,
    isPending: false,
  } as unknown as ReturnType<typeof useAddToStore>);
  const retry = vi.fn<() => void>();
  vi.mocked(useRetryListing).mockReturnValue({
    mutate: retry,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useRetryListing>);
  const onOpen = vi.fn<() => void>();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ul>
          <ProductChannelItem
            workspaceId="ws-1"
            productId="p-1"
            channel={channel}
            canEdit={options.canEdit ?? true}
            onOpen={onOpen}
          />
        </ul>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { addToStore, retry, onOpen };
}

describe('ProductChannelItem', () => {
  it('shows the store, the state and the price range on one compact card', () => {
    renderItem(
      productChannelFixture({
        variants: [
          channelVariantFixture(),
          channelVariantFixture({
            variantId: 'v-2',
            title: 'Red',
            price: { ...channelVariantFixture().price, price: '72.00' },
          }),
        ],
      }),
    );

    expect(screen.getByText('demo-store')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('$64.00 – $72.00')).toBeInTheDocument();
    expect(screen.queryByText('Blue')).not.toBeInTheDocument();
  });

  it('adds a product the store does not have with an outline button', async () => {
    const { addToStore } = renderItem(NOT_IN_STORE);

    const add = screen.getByRole('button', { name: CHANNEL_CARD_COPY.add });
    expect(add).toHaveAttribute('data-variant', 'outline');
    await userEvent.click(add);

    expect(addToStore).toHaveBeenCalled();
  });

  it('edits a listing in the store, from its action or its name', async () => {
    const { onOpen } = renderItem(productChannelFixture());

    await userEvent.click(screen.getByRole('button', { name: CHANNEL_CARD_COPY.edit }));
    await userEvent.click(
      screen.getByRole('button', { name: `${CHANNEL_CARD_COPY.openListing} demo-store` }),
    );

    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('tries a failed listing again, with the store’s reason', async () => {
    const { retry } = renderItem(
      productChannelFixture({
        displayState: ListingDisplayState.failed,
        displayReason: 'Handle already taken',
      }),
    );

    expect(screen.getByText('Handle already taken')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: RETRY_COPY.action }));

    expect(retry).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: CHANNEL_CARD_COPY.edit })).not.toBeInTheDocument();
  });

  it('opens the listing editor to fill in what the store refused the product for', async () => {
    const { onOpen } = renderItem(
      productChannelFixture({
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Brand is required',
        listing: listingFixture({ missingRequirement: PublishRequirement.item_specifics }),
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Fill in item specifics' }));

    expect(onOpen).toHaveBeenCalled();
  });

  it('points a product waiting on the store’s setup to that setup', () => {
    renderItem(
      productChannelFixture({
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Choose the country and the product page address.',
        displayRequirement: PublishRequirement.listing_setup,
      }),
    );

    expect(screen.getByRole('link', { name: 'Open listing setup' })).toHaveAttribute(
      'href',
      '/stores/c-1/settings#listing-setup',
    );
  });

  it('lists each variant’s price under Details, and how it was worked out on request', async () => {
    renderItem(
      productChannelFixture({
        connection: { ...productChannelFixture().connection, currencyCode: 'EUR' },
        variants: [
          channelVariantFixture({
            price: {
              ...channelVariantFixture().price,
              price: '56.80',
              source: PriceSource.rule,
              steps: [
                {
                  kind: PriceStepKind.conversion,
                  label: '× 0.887548 (USD → EUR)',
                  amount: '56.80',
                },
              ],
              explanation: '$64.00 → × 0.887548 (USD → EUR) = €56.80',
            },
          }),
        ],
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: CHANNEL_CARD_COPY.details }));
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.queryByText(/0\.8875/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: PRICE_EXPLANATION_COPY.toggle }));

    expect(screen.getByText('$64.00 → × 0.8875 (USD → EUR) = €56.80')).toBeInTheDocument();
  });

  it('only shows where the product stands to members who may not change it', () => {
    renderItem(NOT_IN_STORE, { canEdit: false });

    expect(screen.queryByRole('button', { name: CHANNEL_CARD_COPY.add })).not.toBeInTheDocument();
  });

  it('blocks adding to a store that needs reconnecting, and says why', () => {
    const { addToStore } = renderItem({
      ...NOT_IN_STORE,
      connection: { ...NOT_IN_STORE.connection, status: ChannelConnectionStatus.NEEDS_REAUTH },
    });

    const add = screen.getByRole('button', { name: CHANNEL_CARD_COPY.add });
    expect(add).toBeDisabled();
    expect(add).toHaveAccessibleDescription(new RegExp(STORE_NOT_CONNECTED_COPY.reason));
    expect(screen.getByRole('link', { name: STORE_NOT_CONNECTED_COPY.action })).toBeInTheDocument();
    expect(addToStore).not.toHaveBeenCalled();
  });
});
