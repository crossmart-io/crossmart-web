import { screen } from '@testing-library/react';
import type * as Workspaces from '@/features/workspaces';
import { useMe } from '@/features/workspaces';
import { renderWithProviders } from '@/features/webhooks/testing/render';
import { BreadcrumbsProvider } from '@/components/layout/BreadcrumbsProvider';
import { PlatformAdminGate } from './PlatformAdminGate';
import { PLATFORM_ADMIN_GATE_COPY } from './platform-admin-gate.constants';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useMe: vi.fn<typeof useMe>(),
}));

const ADMIN_CONTENT = 'Ask insights content';

function renderGate(me: Partial<ReturnType<typeof useMe>>) {
  vi.mocked(useMe).mockReturnValue(me as ReturnType<typeof useMe>);
  renderWithProviders(
    <BreadcrumbsProvider>
      <PlatformAdminGate>
        <p>{ADMIN_CONTENT}</p>
      </PlatformAdminGate>
    </BreadcrumbsProvider>,
  );
}

describe('PlatformAdminGate', () => {
  it('shows a platform admin the page', () => {
    renderGate({ isPending: false, isError: false, data: { platformAdmin: true } as never });
    expect(screen.getByText(ADMIN_CONTENT)).toBeInTheDocument();
  });

  it('answers everyone else as if the page did not exist', () => {
    renderGate({ isPending: false, isError: false, data: { platformAdmin: false } as never });
    expect(screen.queryByText(ADMIN_CONTENT)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: PLATFORM_ADMIN_GATE_COPY.notFoundName }),
    ).toBeInTheDocument();
  });

  it('shows nothing of the page while the account loads', () => {
    renderGate({ isPending: true, isError: false, data: undefined });
    expect(screen.queryByText(ADMIN_CONTENT)).not.toBeInTheDocument();
  });
});
