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

function renderRow(product: ChannelProduct, onToggle?: (id: string, include: boolean) => void) {
  render(
    <MemoryRouter>
      <Table>
        <TableBody>
          <ChannelProductRow row={product} onToggle={onToggle} isSaving={false} />
        </TableBody>
      </Table>
    </MemoryRouter>,
  );
}

describe('ChannelProductRow', () => {
  it('shows a live product with a link to it on the channel, and removes it', async () => {
    const onToggle = vi.fn<(id: string, include: boolean) => void>();
    renderRow(row(ChannelProductState.listed), onToggle);

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Linen shirt on the channel' })).toHaveAttribute(
      'href',
      'https://demo.example.com/products/linen-shirt',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Linen shirt from this store' }),
    );

    expect(onToggle).toHaveBeenCalledWith('p-1', false);
  });

  it('adds back a product that is not in the store', async () => {
    const onToggle = vi.fn<(id: string, include: boolean) => void>();
    renderRow(row(ChannelProductState.excluded), onToggle);

    await userEvent.click(screen.getByRole('button', { name: 'Add Linen shirt to this store' }));

    expect(onToggle).toHaveBeenCalledWith('p-1', true);
  });

  it('says why the last sync failed', () => {
    renderRow(row(ChannelProductState.failed, 'Handle already taken'));

    expect(screen.getByText('Handle already taken')).toBeInTheDocument();
  });

  it('offers no changes to members who cannot manage the workspace', () => {
    renderRow(row(ChannelProductState.listed));

    expect(screen.queryByRole('button', { name: /this store/ })).not.toBeInTheDocument();
  });
});
