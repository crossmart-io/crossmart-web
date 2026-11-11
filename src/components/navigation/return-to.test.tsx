import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router';
import type { Crumb } from '@/config/navigation';
import { useParentsOrReturnTo, useReturnToState } from './return-to';
import { ReturnToProvider } from './ReturnToProvider';

const FALLBACK: readonly Crumb[] = [{ label: 'Products', to: '/products' }];
const STORES: readonly Crumb[] = [{ label: 'Stores', to: '/stores' }];

function ProductLink() {
  return (
    <Link to="/products/p-1" state={useReturnToState()}>
      Linen shirt
    </Link>
  );
}

function ProductCrumbs() {
  const parents = useParentsOrReturnTo(FALLBACK);
  return <p>{parents.map((crumb) => `${crumb.label}=${crumb.to ?? ''}`).join(' > ')}</p>;
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/stores/:id/:tab"
          element={
            <ReturnToProvider parents={STORES} label="demo-store">
              <ProductLink />
            </ReturnToProvider>
          }
        />
        <Route path="/products" element={<ProductLink />} />
        <Route path="/products/:productId" element={<ProductCrumbs />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('return to', () => {
  it('leads a page opened from a store tab back to that tab', async () => {
    renderAt('/stores/c-1/products');

    await userEvent.click(screen.getByRole('link', { name: 'Linen shirt' }));

    expect(
      screen.getByText('Stores=/stores > demo-store=/stores/c-1/products'),
    ).toBeInTheDocument();
  });

  it('keeps the usual parents when the link did not say where it came from', async () => {
    renderAt('/products');

    await userEvent.click(screen.getByRole('link', { name: 'Linen shirt' }));

    expect(screen.getByText('Products=/products')).toBeInTheDocument();
  });
});
