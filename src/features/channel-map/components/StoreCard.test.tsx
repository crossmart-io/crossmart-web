import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ListingDisplayState } from '@/api/schema';
import { storeHealthFixture } from '@/features/listing-health/testing/listing-health.fixture';
import { LocationDisplay } from '@/features/listings/testing/LocationDisplay';
import { mapStatusCounts } from '../map-status';
import { StoreCard } from './StoreCard';

function renderStore() {
  const store = storeHealthFixture({
    [ListingDisplayState.published]: 7,
    [ListingDisplayState.publishing]: 1,
    [ListingDisplayState.failed]: 2,
    [ListingDisplayState.draft]: 40,
  });
  render(
    <MemoryRouter>
      <Routes>
        <Route
          path="*"
          element={<StoreCard store={store} counts={mapStatusCounts(store.states)} />}
        />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('StoreCard', () => {
  it('opens the store’s listings from its name', async () => {
    renderStore();
    await userEvent.click(screen.getByRole('link', { name: 'Open North shop’s listings' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/channels/c-1/listings');
  });

  it.each([
    ['7 published', '/channels/c-1/listings?state=listed'],
    ['1 pending', '/channels/c-1/listings?state=pending'],
    ['2 failed', '/channels/c-1/listings?state=failed'],
    ['40 not listed', '/products?stores=not_in_store&store=c-1'],
  ])('opens the products behind "%s"', async (count, route) => {
    renderStore();
    await userEvent.click(screen.getByRole('link', { name: `North shop: ${count}. Show them` }));
    expect(screen.getByTestId('location')).toHaveTextContent(route);
  });
});
