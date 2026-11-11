import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { LegacyRedirect } from './LegacyRedirect';
import type { LegacyTarget } from './legacy-redirect';

function Location() {
  const location = useLocation();
  return <p data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</p>;
}

function renderRedirect(path: string, to: LegacyTarget, entry: string) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path={path} element={<LegacyRedirect to={to} />} />
        <Route path="*" element={<Location />} />
      </Routes>
    </MemoryRouter>,
  );
  return screen.getByTestId('location');
}

describe('LegacyRedirect', () => {
  it('keeps the query an OAuth return adds', () => {
    const location = renderRedirect('/channels', '/stores', '/channels?connected=shopify');
    expect(location).toHaveTextContent('/stores?connected=shopify');
  });

  it('carries the path parameters and the hash over', () => {
    const location = renderRedirect(
      '/channels/:connectionId/:tab',
      (params) => `/stores/${params.connectionId}/${params.tab}`,
      '/channels/c-1/settings#pricing',
    );
    expect(location).toHaveTextContent('/stores/c-1/settings#pricing');
  });

  it("merges the old query into the target's own", () => {
    const location = renderRedirect(
      '/agent-proposals',
      '/agent/review?source=agents',
      '/agent-proposals?status=approved',
    );
    expect(location).toHaveTextContent('/agent/review?source=agents&status=approved');
  });

  it("keeps the target's own section over the old hash", () => {
    const location = renderRedirect(
      '/settings/webhooks',
      '/settings/developers#webhooks',
      '/settings/webhooks',
    );
    expect(location).toHaveTextContent('/settings/developers#webhooks');
  });
});
