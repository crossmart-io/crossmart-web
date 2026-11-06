import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { StockLevel } from '@/api/schema';
import type { InventoryItem } from '../inventory.types';
import { InventoryTable } from './InventoryTable';

const ITEM: InventoryItem = {
  inventoryItemId: 'ii-1',
  variantId: 'v-1',
  productId: 'p-1',
  productTitle: 'Linen shirt',
  optionValues: [],
  sku: 'LIN-1',
  imageUrl: null,
  tracked: true,
  onHand: 5,
  reserved: 0,
  available: 5,
  stockLevel: StockLevel.in_stock,
  updatedAt: '2026-11-03T09:00:00Z',
};

function renderTable(canAdjust: boolean) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <InventoryTable
          workspaceId="ws-1"
          items={[ITEM]}
          onOpenHistory={vi.fn<(item: InventoryItem) => void>()}
          canAdjust={canAdjust}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('InventoryTable', () => {
  it('offers to adjust stock to members who may', () => {
    renderTable(true);
    expect(screen.getByRole('button', { name: /Adjust/ })).toBeInTheDocument();
  });

  it('only opens the history for members who may not adjust stock', () => {
    renderTable(false);

    expect(screen.queryByRole('button', { name: /Adjust/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stock history of LIN-1' })).toBeInTheDocument();
  });
});
