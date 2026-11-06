import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, ListingStatus, StockLevel } from '@/api/schema';
import type { InventoryReport } from '../inventory-report.types';
import { InventoryValueTiles } from './InventoryValueTiles';
import { StockLevelBar } from './StockLevelBar';
import { LowestStockCard } from './LowestStockCard';

const REPORT: InventoryReport = {
  currencyCode: 'USD',
  value: { atCost: '410.50', atPrice: '1200.00', unitsOnHand: 40, variantsWithoutCost: 2 },
  stockLevels: { inStock: 12, lowStock: 3, outOfStock: 2, untracked: 1 },
  lowStockThreshold: 5,
  lowestStock: [
    {
      inventoryItemId: 'i-1',
      variantId: 'v-1',
      productId: 'p-1',
      productTitle: 'Blue mug',
      optionValues: ['Large'],
      sku: 'MUG-L',
      imageUrl: null,
      tracked: true,
      onHand: 1,
      reserved: 3,
      available: -2,
      stockLevel: StockLevel.out_of_stock,
      updatedAt: '2026-11-01T00:00:00Z',
    },
  ],
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

describe('InventoryValueTiles without costs', () => {
  it('shows a dash rather than a zero when no variant in stock has a cost', () => {
    renderInRouter(
      <InventoryValueTiles
        report={{ ...REPORT, value: { ...REPORT.value, atCost: '0.00', variantsWithoutCost: 4 } }}
      />,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('4 variants in stock without a cost')).toBeInTheDocument();
  });
});

describe('LowestStockCard', () => {
  it('lists the variants to restock first, linked to their product', () => {
    renderInRouter(<LowestStockCard report={REPORT} />);
    expect(screen.getByRole('link', { name: 'Blue mug' })).toHaveAttribute('href', '/products/p-1');
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('says when nothing is running low', () => {
    renderInRouter(<LowestStockCard report={{ ...REPORT, lowestStock: [] }} />);
    expect(screen.getByText('Nothing is out of stock or running low.')).toBeInTheDocument();
  });
});
