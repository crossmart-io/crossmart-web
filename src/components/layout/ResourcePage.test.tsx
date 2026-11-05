import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ApiRequestError } from '@/api/api-error';
import { BreadcrumbsProvider } from './BreadcrumbsProvider';
import { type ResourcePageCopy, ResourcePage } from './ResourcePage';

const COPY: ResourcePageCopy = {
  name: 'Order',
  notFoundName: 'Order not found',
  notFound: 'This order does not exist in this workspace.',
  loadFailed: 'This order could not be loaded',
};
const PARENTS = [{ label: 'Orders', to: '/orders' }];

interface Order {
  name: string;
}

function OrderPage({ load }: { load: () => Promise<Order> }) {
  const query = useQuery({ queryKey: ['order'], queryFn: load, retry: false });
  return (
    <ResourcePage query={query} copy={COPY} parents={PARENTS}>
      {(order) => <h1>{order.name}</h1>}
    </ResourcePage>
  );
}

function renderPage(load: () => Promise<Order>) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <BreadcrumbsProvider>
          <OrderPage load={load} />
        </BreadcrumbsProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ResourcePage', () => {
  it('shows a loader, then the record', async () => {
    renderPage(() => Promise.resolve({ name: '#1001' }));

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '#1001' })).toBeInTheDocument();
  });

  it('says the record does not exist, with a link back to its list', async () => {
    renderPage(() => Promise.reject(new ApiRequestError('Not found', 404)));

    expect(await screen.findByText(COPY.notFound)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Orders' })).toHaveAttribute('href', '/orders');
  });

  it('shows why a load failed, with a retry', async () => {
    renderPage(() => Promise.reject(new ApiRequestError('The API is down', 503)));

    expect(await screen.findByText(COPY.loadFailed)).toBeInTheDocument();
    expect(screen.getByText('The API is down')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
