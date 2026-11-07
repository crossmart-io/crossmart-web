import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderStatus } from '@/api/schema';
import type { OrderLine, OrderSummary } from '../orders.types';
import { OrderLinesTable } from './OrderLinesTable';
import { OrdersTable } from './OrdersTable';

const ORDER: OrderSummary = {
  id: 'o-1',
  name: '#1001',
  status: OrderStatus.PARTIALLY_FULFILLED,
  currencyCode: 'USD',
  total: '130.00',
  placedAt: '2026-11-04T08:00:00Z',
  connectionId: 'c-1',
  storeName: 'demo-store',
  channel: 'shopify',
  itemCount: 3,
  unmatchedLines: 1,
};

function line(overrides: Partial<OrderLine>): OrderLine {
  return {
    id: 'l-1',
    title: 'Linen shirt - S',
    sku: 'SHIRT-S',
    quantity: 2,
    unitPrice: '45.00',
    reservedQuantity: 1,
    fulfilledQuantity: 1,
    variantId: 'v-1',
    productId: 'p-1',
    ...overrides,
  };
}

describe('OrdersTable', () => {
  it('links each order and says which lines Crossmart cannot track', () => {
    render(
      <MemoryRouter>
        <OrdersTable orders={[ORDER]} isRefreshing={false} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: '#1001' })).toHaveAttribute('href', '/orders/o-1');
    expect(screen.getByText('Partly shipped')).toBeInTheDocument();
    expect(screen.getByText('1 line not in your catalog')).toBeInTheDocument();
    expect(screen.getByText('$130.00')).toBeInTheDocument();
  });
});

describe('OrderLinesTable', () => {
  it('shows the stock each line holds, and lines outside the catalog', () => {
    render(
      <MemoryRouter>
        <OrderLinesTable
          currency="USD"
          lines={[
            line({}),
            line({ id: 'l-2', title: 'Gift wrap', sku: null, variantId: null, productId: null }),
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Linen shirt - S' })).toHaveAttribute(
      'href',
      '/products/p-1',
    );
    expect(screen.getAllByText('1 reserved · 1 shipped').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Not in your catalog; stock not tracked').length).toBeGreaterThan(0);
  });
});
