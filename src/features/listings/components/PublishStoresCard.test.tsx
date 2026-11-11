import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import type { PublishStoresState } from '../hooks/usePublishStores';
import { PUBLISH_STORES_COPY } from '../listings.constants';
import { publishStoreOf } from '../publish-on-create';
import { PublishStoresCard } from './PublishStoresCard';

const STORES = [
  publishStoreOf(connectionFixture({ id: 'c-1', displayName: 'Main shop', shopify: null })),
  publishStoreOf(
    connectionFixture({
      id: 'c-2',
      displayName: 'Old shop',
      shopify: null,
      status: ChannelConnectionStatus.NEEDS_REAUTH,
    }),
  ),
  publishStoreOf(
    connectionFixture({
      id: 'c-3',
      displayName: 'Rule shop',
      shopify: null,
      productSelection: { filter: {}, includeProductIds: [], excludeProductIds: [] },
    }),
  ),
];

function Harness() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set(['c-1']));
  const state = {
    stores: STORES,
    selected,
    toggle: (id: string) => setSelected(selected.has(id) ? new Set() : new Set([id])),
    publish: vi.fn<PublishStoresState['publish']>(),
    publishes: selected.size > 0,
  } satisfies PublishStoresState;
  return <PublishStoresCard state={state} />;
}

describe('PublishStoresCard', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Harness />
      </MemoryRouter>,
    );
  });

  it('ticks the ready stores, and lets the seller untick one', async () => {
    const main = screen.getByRole('checkbox', { name: 'Main shop' });
    expect(main).toBeChecked();
    await userEvent.click(main);
    expect(main).not.toBeChecked();
  });

  it('asks for a reconnect before a store can be ticked', () => {
    expect(screen.getByRole('checkbox', { name: 'Old shop' })).toBeDisabled();
    expect(screen.getByRole('link', { name: PUBLISH_STORES_COPY.reconnect })).toBeInTheDocument();
  });

  it('shows a store whose rule takes every active product as ticked already', () => {
    const rule = screen.getByRole('checkbox', { name: 'Rule shop' });
    expect(rule).toBeChecked();
    expect(rule).toBeDisabled();
    expect(screen.getByText(PUBLISH_STORES_COPY.automatic)).toBeInTheDocument();
  });
});
