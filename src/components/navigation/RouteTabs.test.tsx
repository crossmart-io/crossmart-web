import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RouteTabs, type RouteTab } from './RouteTabs';

const TABS: readonly RouteTab[] = [
  { label: 'Products', to: '/products', exact: true },
  { label: 'Stock', to: '/products/stock' },
];

function renderTabs(entry: string) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <RouteTabs tabs={TABS} label="Product views" />
    </MemoryRouter>,
  );
}

describe('RouteTabs', () => {
  it('marks the tab of the current page', () => {
    renderTabs('/products/stock?stock=low_stock');
    expect(screen.getByRole('link', { name: 'Stock' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Products' })).not.toHaveAttribute('aria-current');
  });

  it('links each tab to its own address', () => {
    renderTabs('/products');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Stock' })).toHaveAttribute('href', '/products/stock');
  });
});
