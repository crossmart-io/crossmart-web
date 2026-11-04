import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SalesInterval, SalesRange } from '@/api/schema';
import type { SalesReport } from '../sales.types';
import { SalesKpiGrid } from './SalesKpiGrid';
import { StoreSalesCard } from './StoreSalesCard';
import { TopProductsCard } from './TopProductsCard';

const REPORT: SalesReport = {
  range: SalesRange.last_7_days,
  interval: SalesInterval.day,
  timeZone: 'UTC',
  currencyCode: 'USD',
  current: { sales: '150.00', orders: 3, units: 5, averageOrderValue: '50.00' },
  previous: { sales: '100.00', orders: 3, units: 0, averageOrderValue: '40.00' },
  buckets: [],
  stores: [
    {
      connectionId: 'c-old',
      channel: 'shopify',
      displayName: 'Old store',
      sales: '30.00',
      orders: 1,
    },
    {
      connectionId: 'c-new',
      channel: 'shopify',
      displayName: 'New store',
      sales: '120.00',
      orders: 2,
    },
  ],
  topProducts: [{ productId: 'p-1', title: 'Linen shirt', units: 4, sales: '120.00' }],
  otherCurrencyOrders: 0,
};

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe('SalesKpiGrid', () => {
  it('shows each total with its change, in words as well as color', () => {
    renderInRouter(<SalesKpiGrid report={REPORT} comparedTo="previous 7 days" />);
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('+50%')).toBeInTheDocument();
    expect(screen.getByText('+25%')).toBeInTheDocument();
    expect(screen.getByText('No change')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });
});

describe('StoreSalesCard', () => {
  it('ranks stores by sales with their share', () => {
    renderInRouter(<StoreSalesCard report={REPORT} />);
    const rows = screen.getAllByRole('listitem');
    expect(within(rows[0] as HTMLElement).getByRole('link')).toHaveTextContent('New store');
    expect(rows[0]).toHaveTextContent('80%');
  });

  it('asks for a store when there is none', () => {
    renderInRouter(<StoreSalesCard report={{ ...REPORT, stores: [] }} />);
    expect(screen.getByRole('link', { name: 'Connect a store' })).toBeInTheDocument();
  });
});

describe('TopProductsCard', () => {
  it('links each top product', () => {
    renderInRouter(<TopProductsCard report={REPORT} />);
    expect(screen.getByRole('link', { name: 'Linen shirt' })).toHaveAttribute(
      'href',
      '/products/p-1',
    );
    expect(screen.getByText('4 units')).toBeInTheDocument();
  });
});
