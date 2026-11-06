import { render, screen } from '@testing-library/react';
import { ChannelType, ListingDisplayState, ListingSource, ListingStatus } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ProductStore } from '../listings.types';
import { ProductStoreIcons } from './ProductStoreIcons';

function store(
  index: number,
  displayState = ListingDisplayState.published,
  displayReason: string | null = null,
): ProductStore {
  return {
    connectionId: `c-${index}`,
    channel: ChannelType.shopify,
    storeName: `Store ${index}`,
    // The listing status is left as it may be, to show the badge reads the server's state.
    status: ListingStatus.PENDING,
    source: ListingSource.MANUAL,
    displayState,
    displayReason,
    displayRequirement: null,
  };
}

function renderIcons(stores: ProductStore[]) {
  render(
    <TooltipProvider>
      <ProductStoreIcons stores={stores} />
    </TooltipProvider>,
  );
}

describe('ProductStoreIcons', () => {
  it('names each store and the state the server gives it there', () => {
    renderIcons([store(1), store(2, ListingDisplayState.failed)]);

    expect(screen.getByRole('button', { name: 'Store 1 · Published' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Store 2 · Failed' })).toBeInTheDocument();
  });

  it('tells a pending listing that needs details from one being published, with the reason', () => {
    renderIcons([
      store(1, ListingDisplayState.needs_details, 'Choose a shipping policy'),
      store(2, ListingDisplayState.publishing),
    ]);

    expect(
      screen.getByRole('button', { name: 'Store 1 · Needs details: Choose a shipping policy' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Store 2 · Publishing' })).toBeInTheDocument();
  });

  it('says in words when a store refused the product', () => {
    renderIcons([
      store(1),
      store(2, ListingDisplayState.failed),
      store(3, ListingDisplayState.failed),
    ]);

    expect(screen.getByText('Failed in 2')).toBeInTheDocument();
  });

  it('adds no failure text when every store took the product', () => {
    renderIcons([store(1), store(2, ListingDisplayState.publishing)]);

    expect(screen.queryByText(/Failed/)).not.toBeInTheDocument();
  });

  it('shows four icons and counts the rest', () => {
    renderIcons([1, 2, 3, 4, 5, 6].map((index) => store(index)));

    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows a dash for a product in no store', () => {
    renderIcons([]);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
