import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ChannelProductState, ListingStatus, ProductStatus } from '@/api/schema';
import { Table, TableBody } from '@/components/ui/table';
import type { ChannelProduct } from '../listings.types';
import { ChannelProductRow } from './ChannelProductRow';

function row(state: ChannelProductState, lastError: string | null = null): ChannelProduct {
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
    listing:
      state === ChannelProductState.excluded
        ? null
        : {
            id: 'l-1',
            status: lastError ? ListingStatus.ERROR : ListingStatus.ACTIVE,
            externalId: 'gid://shopify/Product/1',
            externalUrl: 'https://demo.example.com/products/linen-shirt',
            lastError,
            lastSyncedAt: null,
          },
  };
}

function renderRow(product: ChannelProduct, onRemove?: (id: string) => Promise<unknown>) {
  render(
    <MemoryRouter>
      <Table>
        <TableBody>
          <ChannelProductRow row={product} onRemove={onRemove} />
        </TableBody>
      </Table>
    </MemoryRouter>,
  );
}

describe('ChannelProductRow', () => {
  it('shows a live product with a link to it on the channel, and removes it once confirmed', async () => {
    const onRemove = vi.fn<(id: string) => Promise<unknown>>().mockResolvedValue(undefined);
    renderRow(row(ChannelProductState.listed), onRemove);

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Linen shirt on the channel' })).toHaveAttribute(
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

  it('says why the last sync failed', () => {
    renderRow(row(ChannelProductState.failed, 'Handle already taken'));

    expect(screen.getByText('Handle already taken')).toBeInTheDocument();
  });

  it('offers no removal while it is being removed, or to members who may not', () => {
    renderRow(row(ChannelProductState.removing), vi.fn<(id: string) => Promise<unknown>>());
    renderRow(row(ChannelProductState.listed));

    expect(screen.queryByRole('button', { name: /from this store/ })).not.toBeInTheDocument();
  });
});
