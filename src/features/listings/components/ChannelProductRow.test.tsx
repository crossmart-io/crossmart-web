import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ApiRequestError } from '@/api/api-error';
import {
  ChannelProductState,
  ListingDisplayState,
  ListingSource,
  ListingStatus,
  ProductStatus,
  PublishRequirement,
} from '@/api/schema';
import { Table, TableBody } from '@/components/ui/table';
import type * as ProductChannelHooks from '../hooks/useProductChannels';
import { useRetryListing } from '../hooks/useProductChannels';
import { RETRY_COPY, RetryFailure } from '../listings.constants';
import type { ChannelProduct, ListingStore } from '../listings.types';
import { ChannelProductRow } from './ChannelProductRow';

vi.mock('../hooks/useProductChannels', async (importOriginal) => ({
  ...(await importOriginal<typeof ProductChannelHooks>()),
  useRetryListing: vi.fn<typeof useRetryListing>(),
}));

const STORE: ListingStore = {
  workspaceId: 'ws-1',
  connectionId: 'c-1',
  missing: [],
  connected: true,
};

interface RowOptions {
  displayState?: ListingDisplayState;
  displayReason?: string | null;
  missingRequirement?: PublishRequirement | null;
}

function row(state: ChannelProductState, options: RowOptions = {}): ChannelProduct {
  const inStore =
    state !== ChannelProductState.excluded && state !== ChannelProductState.removed_by_hand;
  return {
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
    state,
    displayState: options.displayState ?? ListingDisplayState.published,
    displayReason: options.displayReason ?? null,
    listing: inStore
      ? {
          id: 'l-1',
          status: ListingStatus.ACTIVE,
          source: ListingSource.MANUAL,
          externalId: 'gid://shopify/Product/1',
          externalUrl: 'https://demo.example.com/products/linen-shirt',
          lastError: options.displayReason ?? null,
          missingRequirement: options.missingRequirement ?? null,
          lastSyncedAt: null,
          category: null,
        }
      : null,
  };
}

interface RenderOptions {
  store?: ListingStore;
  canEdit?: boolean;
  onOpenListing?: (id: string) => void;
  initialEntry?: string;
  onRemove?: (id: string) => Promise<unknown>;
  onAddBack?: (id: string) => void;
}

function mockRetry(state: { isPending?: boolean; error?: Error | null } = {}) {
  const mutate = vi.fn<() => void>();
  vi.mocked(useRetryListing).mockReturnValue({
    mutate,
    isPending: state.isPending ?? false,
    error: state.error ?? null,
  } as unknown as ReturnType<typeof useRetryListing>);
  return mutate;
}

function renderRow(product: ChannelProduct, options: RenderOptions = {}) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[options.initialEntry ?? '/channels/c-1']}>
        <Table>
          <TableBody>
            <ChannelProductRow
              row={product}
              store={options.store ?? STORE}
              canEdit={options.canEdit ?? true}
              onOpenListing={options.onOpenListing ?? vi.fn<(id: string) => void>()}
              onRemove={options.onRemove}
              onAddBack={options.onAddBack}
            />
          </TableBody>
        </Table>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const failedRow = () =>
  row(ChannelProductState.failed, {
    displayState: ListingDisplayState.failed,
    displayReason: 'Handle already taken',
  });

describe('ChannelProductRow', () => {
  beforeEach(() => {
    mockRetry();
  });

  it('shows a published product with a link to it on the channel, and removes it once confirmed', async () => {
    const onRemove = vi.fn<(id: string) => Promise<unknown>>().mockResolvedValue(undefined);
    renderRow(row(ChannelProductState.listed), { onRemove });

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Linen shirt in the store' })).toHaveAttribute(
      'href',
      'https://demo.example.com/products/linen-shirt',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Linen shirt from this store' }),
    );
    expect(onRemove).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledWith('p-1');
  });

  it('says why publishing failed, and tries again in place', async () => {
    const retry = mockRetry();
    renderRow(failedRow());

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Handle already taken')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: RETRY_COPY.action }));

    expect(retry).toHaveBeenCalled();
    expect(useRetryListing).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      connectionId: 'c-1',
      productId: 'p-1',
    });
  });

  it('shows the retry in flight', () => {
    mockRetry({ isPending: true });
    renderRow(failedRow());

    expect(screen.getByRole('button', { name: new RegExp(RETRY_COPY.pending) })).toBeDisabled();
  });

  it.each([
    [409, RetryFailure.Blocked],
    [402, RetryFailure.PlanFull],
    [403, RetryFailure.NotAllowed],
  ] as const)('explains a %i from the retry beside it', (status, failure) => {
    mockRetry({ error: new ApiRequestError('Conflict', status) });
    renderRow(failedRow());

    expect(screen.getByRole('alert')).toHaveTextContent(RETRY_COPY.failures[failure]);
  });

  it('offers no retry to members who may not edit listings, or while the store is disconnected', () => {
    renderRow(failedRow(), { canEdit: false });
    renderRow(failedRow(), { store: { ...STORE, connected: false } });

    expect(screen.queryByRole('button', { name: RETRY_COPY.action })).not.toBeInTheDocument();
  });

  it('sends store setup problems to the store’s settings card', () => {
    renderRow(
      row(ChannelProductState.pending, {
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Choose a shipping policy in this eBay connection’s listing defaults.',
      }),
      { store: { ...STORE, missing: [PublishRequirement.shipping_policy] } },
    );

    expect(screen.getByText('Needs details')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open listing defaults' })).toHaveAttribute(
      'href',
      '/channels/c-1/settings#listing-defaults',
    );
  });

  it('opens the listing editor in place to fill in missing item specifics', async () => {
    const onOpenListing = vi.fn<(id: string) => void>();
    renderRow(
      row(ChannelProductState.failed, {
        displayState: ListingDisplayState.needs_details,
        displayReason: 'Brand is required',
        missingRequirement: PublishRequirement.item_specifics,
      }),
      { onOpenListing },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Fill in item specifics' }));

    expect(onOpenListing).toHaveBeenCalledWith('p-1');
  });

  it('links the product to its listing editor on this page, keeping the list’s filters', () => {
    renderRow(row(ChannelProductState.listed), { initialEntry: '/channels/c-1?state=failed' });

    expect(screen.getByRole('link', { name: 'Linen shirt' })).toHaveAttribute(
      'href',
      '/channels/c-1?state=failed&listing=p-1',
    );
  });

  it('opens the listing editor when the row is clicked, but not from its own controls', async () => {
    const onOpenListing = vi.fn<(id: string) => void>();
    const onRemove = vi.fn<(id: string) => Promise<unknown>>().mockResolvedValue(undefined);
    renderRow(row(ChannelProductState.listed), { onOpenListing, onRemove });

    await userEvent.click(screen.getByText('Added by hand'));
    expect(onOpenListing).toHaveBeenCalledWith('p-1');

    onOpenListing.mockClear();
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Linen shirt from this store' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenListing).not.toHaveBeenCalled();
  });

  it('offers no removal while it is being removed, or to members who may not', () => {
    renderRow(row(ChannelProductState.removing, { displayState: ListingDisplayState.removing }), {
      onRemove: vi.fn<(id: string) => Promise<unknown>>(),
    });
    renderRow(row(ChannelProductState.listed));

    expect(screen.getByText('Removing')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /from this store/ })).not.toBeInTheDocument();
  });

  it('says why the product is in the store', () => {
    renderRow(row(ChannelProductState.listed));

    expect(screen.getByText('Added by hand')).toBeInTheDocument();
  });

  it('adds back a product removed by hand', async () => {
    const onAddBack = vi.fn<(id: string) => void>();
    renderRow(
      row(ChannelProductState.removed_by_hand, { displayState: ListingDisplayState.removed }),
      { onAddBack },
    );

    expect(screen.getByText('Removed')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add back' }));

    expect(onAddBack).toHaveBeenCalledWith('p-1');
  });
});
