import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import * as staleBuild from '@/lib/stale-build-reload';
import { RouteErrorBoundary } from './RouteErrorBoundary';

function renderFailingRoute(error: Error) {
  const router = createMemoryRouter([
    {
      path: '/',
      errorElement: <RouteErrorBoundary />,
      loader: () => {
        throw error;
      },
      element: <p>never shown</p>,
    },
  ]);
  render(<RouterProvider router={router} />);
}

describe('RouteErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('reloads quietly when a page is missing after a deploy', async () => {
    const reload = vi.spyOn(staleBuild, 'reloadWindowForStaleBuild').mockReturnValue(true);

    renderFailingRoute(
      new TypeError('Failed to fetch dynamically imported module: /assets/MembersPage-old.js'),
    );

    expect(await screen.findByLabelText('Loading')).toBeInTheDocument();
    expect(reload).toHaveBeenCalledOnce();
  });

  it('shows other errors with a way to try again', async () => {
    const reload = vi.spyOn(staleBuild, 'reloadWindowForStaleBuild');

    renderFailingRoute(new Error('boom'));

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });
});
