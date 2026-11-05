import { CatalogGap } from '@/api/schema';
import { toProductsRoute } from '@/config/routes';

describe('catalog gaps in the URL', () => {
  it('links to the product list filtered by a gap', () => {
    expect(toProductsRoute({ gap: CatalogGap.out_of_stock })).toBe('/products?gap=out_of_stock');
    expect(toProductsRoute()).toBe('/products');
  });
});
