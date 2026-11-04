import { render, screen } from '@testing-library/react';
import { ChannelType, ListingSource, ListingStatus } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ProductStore } from '../listings.types';
import { ProductStoreIcons } from './ProductStoreIcons';

function store(index: number, status = ListingStatus.ACTIVE): ProductStore {
  return {
    connectionId: `c-${index}`,
    channel: ChannelType.shopify,
    storeName: `Store ${index}`,
    status,
    source: ListingSource.MANUAL,
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
  it('names each store and its status', () => {
    renderIcons([store(1), store(2, ListingStatus.ERROR)]);

    expect(screen.getByRole('button', { name: 'Store 1 · Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Store 2 · Error' })).toBeInTheDocument();
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
