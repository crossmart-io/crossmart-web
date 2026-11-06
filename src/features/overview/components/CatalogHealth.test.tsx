import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CatalogGap } from '@/api/schema';
import type * as Catalog from '@/features/catalog';
import { useCatalogStats } from '@/features/catalog';
import { CatalogHealth } from './CatalogHealth';

vi.mock('@/features/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof Catalog>()),
  useCatalogStats: vi.fn<typeof useCatalogStats>(),
}));

const STATS = {
  products: 3,
  activeProducts: 2,
  draftProducts: 1,
  archivedProducts: 0,
  variants: 8,
  outOfStockVariants: 0,
  gaps: [{ gap: CatalogGap.images, products: 2 }],
};

function renderWithStats(stats: typeof STATS) {
  vi.mocked(useCatalogStats).mockReturnValue({ data: stats } as unknown as ReturnType<
    typeof useCatalogStats
  >);
  render(
    <MemoryRouter>
      <CatalogHealth workspaceId="ws-1" />
    </MemoryRouter>,
  );
}

describe('CatalogHealth', () => {
  it('asks for products instead of passing an empty catalog', () => {
    renderWithStats({ ...STATS, products: 0, gaps: [] });
    expect(screen.getByText('No products yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add product' })).toHaveAttribute(
      'href',
      '/products/new',
    );
    expect(screen.getByRole('link', { name: 'Import' })).toHaveAttribute('href', '/imports');
    expect(screen.queryByText(/^Done:/)).not.toBeInTheDocument();
  });

  it('lists the gaps of a catalog with products', () => {
    renderWithStats(STATS);
    expect(screen.getByRole('link', { name: /2 products/ })).toBeInTheDocument();
    expect(screen.queryByText('No products yet')).not.toBeInTheDocument();
  });
});
