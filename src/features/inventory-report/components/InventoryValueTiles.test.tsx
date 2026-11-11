import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { StockLevel } from '@/api/schema';
import { toStockRoute } from '@/config/routes';
import type { InventoryReport } from '../inventory-report.types';
import { InventoryValueTiles } from './InventoryValueTiles';

const REPORT = {
  currencyCode: 'USD',
  value: { atCost: '0', atPrice: '1200.00', unitsOnHand: 40, variantsWithoutCost: 2 },
  stockLevels: { inStock: 12, lowStock: 3, outOfStock: 2, untracked: 1 },
  lowStockThreshold: 5,
  lowestStock: [],
  stores: [],
} as unknown as InventoryReport;

describe('InventoryValueTiles', () => {
  it('shows a dash rather than an invented zero cost, and links the short stock', () => {
    render(
      <MemoryRouter>
        <InventoryValueTiles report={REPORT} />
      </MemoryRouter>,
    );
    expect(screen.getByText('2 variants in stock without a cost')).toBeInTheDocument();
    expect(screen.getByText('$1,200.00')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2 out/ })).toHaveAttribute(
      'href',
      toStockRoute(StockLevel.low_stock),
    );
  });
});
