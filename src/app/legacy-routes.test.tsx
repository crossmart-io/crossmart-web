import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { legacyRoutes } from './legacy-routes';

function Location() {
  const location = useLocation();
  return <p data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</p>;
}

function landingOf(entry: string): string {
  const router = createMemoryRouter([...legacyRoutes, { path: '*', element: <Location /> }], {
    initialEntries: [entry],
  });
  render(<RouterProvider router={router} />);
  return screen.getByTestId('location').textContent ?? '';
}

describe('legacy routes', () => {
  it.each([
    ['/channels?connected=shopify', '/stores?connected=shopify'],
    ['/channels?error=access_denied&channel=ebay', '/stores?error=access_denied&channel=ebay'],
    ['/channels/c-1', '/stores/c-1'],
    ['/channels/c-1/settings#pricing', '/stores/c-1/settings#pricing'],
    ['/channel-map', '/agent'],
    ['/inventory?stock=low_stock', '/products/stock?stock=low_stock'],
    ['/suggestions', '/agent/review?source=ai'],
    ['/agent-proposals', '/agent/review?source=agents'],
    ['/settings/workspace', '/settings/general'],
    ['/settings/members', '/settings/team'],
    ['/settings/roles', '/settings/team/roles'],
    ['/settings/api-keys', '/settings/developers#api-keys'],
    ['/settings/webhooks', '/settings/developers#webhooks'],
    ['/settings/webhooks/we-1', '/settings/developers/webhooks/we-1'],
    ['/settings/agents', '/settings/developers#agents'],
    ['/settings/account', '/account'],
    ['/settings/plan', '/settings/billing'],
  ])('sends %s to %s', (entry, landing) => {
    expect(landingOf(entry)).toBe(landing);
  });
});
