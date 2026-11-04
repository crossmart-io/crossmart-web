import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ListingStatus } from '@/api/schema';
import type { InventoryReport } from '../inventory-report.types';
import { InventoryValueTiles } from './InventoryValueTiles';
import { StockLevelBar } from './StockLevelBar';
import { StoreHealthCard } from './StoreHealthCard';

const REPORT: InventoryReport = {
  currencyCode: 'USD',
  value: { atCost: '410.50', atPrice: '1200.00', unitsOnHand: 40, variantsWithoutCost: 2 },
  stockLevels: { inStock: 12, lowStock: 3, outOfStock: 2, untracked: 1 },
  lowStockThreshold: 5,
  stores: [
    {
      connectionId: 'c-1',
      channel: 'shopify',
      displayName: 'North shop',
      status: ChannelConnectionStatus.CONNECTED,
      lastSyncedAt: null,
      listings: Object.values(ListingStatus).map((status) => ({
        status,
        count: status === ListingStatus.ERROR ? 1 : status === ListingStatus.ACTIVE ? 7 : 0,
      })),
    },
  ],
};

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe('InventoryValueTiles', () => {
  it('values stock and says how many variants have no cost', () => {
    renderInRouter(<InventoryValueTiles report={REPORT} />);
    expect(screen.getByText('$410.50')).toBeInTheDocument();
    expect(screen.getByText('2 variants in stock without a cost')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

describe('StockLevelBar', () => {
  it('links each stock level to the filtered inventory', () => {
    renderInRouter(<StockLevelBar report={REPORT} />);
    expect(screen.getByRole('link', { name: /Out of stock\s*2/ })).toHaveAttribute(
      'href',
      '/inventory?stock=out_of_stock',
    );
  });
});

describe('StoreHealthCard', () => {
  it('shows each store’s connection and listings, failures included', () => {
    renderInRouter(<StoreHealthCard report={REPORT} />);
    expect(screen.getByRole('link', { name: 'North shop' })).toBeInTheDocument();
    expect(screen.getByText('7 active')).toBeInTheDocument();
    expect(screen.getByText('1 error')).toHaveClass('text-destructive');
    expect(screen.getByText('Synced never')).toBeInTheDocument();
  });
});
