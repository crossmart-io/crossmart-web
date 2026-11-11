import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { LocationDisplay } from '@/features/listings/testing/LocationDisplay';
import { BreadcrumbsProvider } from '@/components/layout/BreadcrumbsProvider';
import { WorkspacePermission } from '@/api/schema';
import type { StoreSetupRequest } from '@/features/store-setup/just-connected';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import type { Workspace } from '@/features/workspaces';
import { StoresPage } from './StoresPage';

const { permissions } = vi.hoisted(() => ({ permissions: { current: [] as string[] } }));

vi.mock('@/components/feedback/WorkspaceGate', () => ({
  WorkspaceGate: ({ children }: { children: (workspace: Workspace) => ReactNode }) =>
    children(workspaceFixture(permissions.current as WorkspacePermission[])),
}));
vi.mock('@/features/channels/components/ChannelGrid', () => ({ ChannelGrid: () => null }));
vi.mock('@/features/store-setup/components/StoreSetupDialog', () => ({
  StoreSetupDialog: ({ request, onDone }: { request: StoreSetupRequest; onDone: () => void }) => (
    <button type="button" onClick={onDone}>
      Setup for {request.channel} {request.connectionId ?? 'newest'}
    </button>
  ),
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <BreadcrumbsProvider>
        <StoresPage />
      </BreadcrumbsProvider>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('StoresPage', () => {
  it('offers the setup of the store an admin just connected, until it is closed', async () => {
    permissions.current = [WorkspacePermission.channels_manage];
    renderAt('/stores?connected=ebay&connectionId=c-1');

    expect(screen.getByTestId('location')).toHaveTextContent('/stores?setup=ebay&setupStore=c-1');
    await userEvent.click(screen.getByRole('button', { name: 'Setup for ebay c-1' }));
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores$/);
  });

  it('falls back to the newest store when the OAuth return names only the channel', () => {
    permissions.current = [WorkspacePermission.channels_manage];
    renderAt('/stores?connected=ebay');

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores\?setup=ebay$/);
    expect(screen.getByRole('button', { name: 'Setup for ebay newest' })).toBeInTheDocument();
  });

  it('offers no setup after reconnecting a store', () => {
    permissions.current = [WorkspacePermission.channels_manage];
    renderAt('/stores?connected=ebay&connectionId=c-1&reconnected=true');

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores$/);
    expect(screen.queryByText(/Setup for/)).not.toBeInTheDocument();
  });

  it('offers no setup to members who cannot manage stores', () => {
    permissions.current = [WorkspacePermission.channels_view];
    renderAt('/stores?connected=ebay');

    expect(screen.queryByText(/Setup for/)).not.toBeInTheDocument();
  });
});
