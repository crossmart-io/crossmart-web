import { MapStatus } from './channel-map.constants';
import { storeListingsRoute } from './store-routes';

describe('storeListingsRoute', () => {
  it('opens the store’s listings', () => {
    expect(storeListingsRoute('c-1')).toBe('/stores/c-1/listings');
  });

  it.each([
    [MapStatus.Published, '/stores/c-1/listings?state=listed'],
    [MapStatus.Pending, '/stores/c-1/listings?state=pending'],
    [MapStatus.NeedsDetails, '/stores/c-1/listings?state=needs_details'],
    [MapStatus.Failed, '/stores/c-1/listings?state=failed'],
  ])('filters the store’s listings to %s', (status, route) => {
    expect(storeListingsRoute('c-1', status)).toBe(route);
  });

  it('finds the products not in the store in the catalog', () => {
    expect(storeListingsRoute('c-1', MapStatus.NotListed)).toBe(
      '/products?stores=not_in_store&store=c-1',
    );
  });
});
