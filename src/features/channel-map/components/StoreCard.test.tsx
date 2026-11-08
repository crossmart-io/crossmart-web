import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ListingDisplayState } from '@/api/schema';
import { storeHealthFixture } from '@/features/listing-health/testing/listing-health.fixture';
import { LocationDisplay } from '@/features/listings/testing/LocationDisplay';
import { AgentWorkerContextView } from '@/api/schema';
import {
  AgentWorkerContext,
  type AgentWorkerContextValue,
} from '@/features/agent-worker/agent-worker-context';
import type { OpenAgentWorkerOptions } from '@/features/agent-worker/agent-worker.types';
import { mapStatusCounts } from '../map-status';
import { StoreCard } from './StoreCard';

const FAILING_COUNTS = {
  [ListingDisplayState.published]: 7,
  [ListingDisplayState.publishing]: 1,
  [ListingDisplayState.failed]: 2,
  [ListingDisplayState.draft]: 40,
};

function renderStore(counts: Partial<Record<ListingDisplayState, number>> = FAILING_COUNTS) {
  const store = storeHealthFixture(counts);
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

function renderWithAgentWorker(counts?: Partial<Record<ListingDisplayState, number>>) {
  const openAgentWorker = vi.fn<(options?: OpenAgentWorkerOptions) => void>();
  const agentWorker: AgentWorkerContextValue = {
    canUse: true,
    session: null,
    openAgentWorker,
  };
  const store = storeHealthFixture(counts);
  render(
    <MemoryRouter>
      <AgentWorkerContext value={agentWorker}>
        <StoreCard store={store} counts={mapStatusCounts(store.states)} />
      </AgentWorkerContext>
    </MemoryRouter>,
  );
  return openAgentWorker;
}

describe('StoreCard', () => {
  it('offers Crossmart Agent, prefilled for the store, when listings failed', async () => {
    const openAgentWorker = renderWithAgentWorker(FAILING_COUNTS);
    await userEvent.click(screen.getByRole('button', { name: 'Fix with Crossmart Agent' }));
    expect(openAgentWorker).toHaveBeenCalledWith({
      context: { view: AgentWorkerContextView.channel_map, connectionId: 'c-1' },
      prefill: 'Fix the failed listings on North shop',
    });
  });

  it('does not offer the fix for a store without failures', () => {
    renderWithAgentWorker({ [ListingDisplayState.published]: 7 });
    expect(
      screen.queryByRole('button', { name: 'Fix with Crossmart Agent' }),
    ).not.toBeInTheDocument();
  });

  it('does not offer the fix to a role without Crossmart Agent', () => {
    renderStore();
    expect(
      screen.queryByRole('button', { name: 'Fix with Crossmart Agent' }),
    ).not.toBeInTheDocument();
  });

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
