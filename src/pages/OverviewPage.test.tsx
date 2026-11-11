import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BreadcrumbsProvider } from '@/components/layout/BreadcrumbsProvider';
import { ChannelSetup } from '@/features/channels';
import type * as Orders from '@/features/orders';
import { useHasOrders } from '@/features/orders';
import type * as Overview from '@/features/overview';
import { type OnboardingState, isOnboardingComplete, useOnboarding } from '@/features/overview';
import type * as Workspaces from '@/features/workspaces';
import { useCurrentWorkspace } from '@/features/workspaces';
import { OverviewPage } from './OverviewPage';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
}));
vi.mock('@/features/auth', () => ({ useSession: () => ({ data: undefined }) }));
vi.mock('@/features/orders', async (importOriginal) => ({
  ...(await importOriginal<typeof Orders>()),
  useHasOrders: vi.fn<typeof useHasOrders>(),
}));
vi.mock('@/features/overview', async (importOriginal) => ({
  ...(await importOriginal<typeof Overview>()),
  useOnboarding: vi.fn<typeof useOnboarding>(),
}));
vi.mock('@/features/sales', () => ({ SalesOverview: () => <p>Sales dashboard</p> }));
vi.mock('@/features/attention', () => ({ NeedsAttention: () => <p>Needs attention</p> }));

const NEW_SELLER: OnboardingState = {
  hasProducts: false,
  hasApiKey: false,
  channelSetup: ChannelSetup.NotConnected,
};
const SET_UP_SELLER: OnboardingState = {
  hasProducts: true,
  hasApiKey: true,
  channelSetup: ChannelSetup.Imported,
};

function renderOverview(onboarding: OnboardingState, hasOrders: boolean) {
  vi.mocked(useCurrentWorkspace).mockReturnValue({
    workspace: { id: 'ws-1' },
  } as unknown as ReturnType<typeof useCurrentWorkspace>);
  vi.mocked(useOnboarding).mockReturnValue({
    state: onboarding,
    isComplete: isOnboardingComplete(onboarding),
  });
  vi.mocked(useHasOrders).mockReturnValue(hasOrders);
  render(
    <MemoryRouter>
      <BreadcrumbsProvider>
        <OverviewPage />
      </BreadcrumbsProvider>
    </MemoryRouter>,
  );
}

function isBefore(first: HTMLElement, second: HTMLElement): boolean {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('OverviewPage', () => {
  it('leads a new seller with getting started and one note instead of empty sales', () => {
    renderOverview(NEW_SELLER, false);
    const gettingStarted = screen.getByText('Getting started');
    const noSales = screen.getByText('Your sales will appear here once orders come in.');
    expect(isBefore(gettingStarted, noSales)).toBe(true);
    expect(screen.queryByText('Sales dashboard')).not.toBeInTheDocument();
  });

  it('puts what needs attention above everything else', () => {
    renderOverview(NEW_SELLER, false);
    expect(isBefore(screen.getByText('Needs attention'), screen.getByText('Getting started'))).toBe(
      true,
    );
  });

  it('keeps the sales note while a set-up seller waits for the first order', () => {
    renderOverview(SET_UP_SELLER, false);
    expect(screen.getByText('No sales yet')).toBeInTheDocument();
    expect(screen.queryByText('Getting started')).not.toBeInTheDocument();
  });

  it('reads as a sales dashboard once set up and selling', () => {
    renderOverview(SET_UP_SELLER, true);
    expect(screen.getByText('Sales dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Getting started')).not.toBeInTheDocument();
    expect(screen.queryByText('No sales yet')).not.toBeInTheDocument();
  });
});
