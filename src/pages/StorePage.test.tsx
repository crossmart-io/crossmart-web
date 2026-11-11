import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ROUTES } from '@/config/routes';
import { LocationDisplay } from '@/features/listings/testing/LocationDisplay';
import { StorePage } from './StorePage';

// Only the redirect is under test; the page itself needs a signed-in workspace.
vi.mock('@/components/feedback/WorkspaceGate', () => ({ WorkspaceGate: () => null }));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={ROUTES.store} element={<StorePage />} />
        <Route path={ROUTES.storeTab} element={<StorePage />} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('StorePage', () => {
  it('sends an old link to the Pricing tab to the pricing section of Settings', () => {
    renderAt('/stores/c-1/pricing');

    expect(screen.getByTestId('location')).toHaveTextContent('/stores/c-1/settings#pricing');
  });

  it('stays on a tab the page has', () => {
    renderAt('/stores/c-1/settings');

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores\/c-1\/settings$/);
  });
});
