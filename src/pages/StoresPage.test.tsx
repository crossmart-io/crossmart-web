import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { LocationDisplay } from '@/features/listings/testing/LocationDisplay';
import { BreadcrumbsProvider } from '@/components/layout/BreadcrumbsProvider';
import { ChannelType, WorkspacePermission } from '@/api/schema';
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
  StoreSetupDialog: ({ channel, onDone }: { channel: ChannelType; onDone: () => void }) => (
    <button type="button" onClick={onDone}>
      Setup for {channel}
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
    renderAt('/stores?connected=ebay');

    expect(screen.getByTestId('location')).toHaveTextContent('/stores?setup=ebay');
    await userEvent.click(screen.getByRole('button', { name: `Setup for ${ChannelType.ebay}` }));
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/stores$/);
  });

  it('offers no setup to members who cannot manage stores', () => {
    permissions.current = [WorkspacePermission.channels_view];
    renderAt('/stores?connected=ebay');

    expect(screen.queryByText(/Setup for/)).not.toBeInTheDocument();
  });
});
