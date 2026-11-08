import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspaceEventCategory, WorkspaceEventSeverity, WorkspaceEventType } from '@/api/schema';
import { EventFeedStatus } from '../agent-console.constants';
import { workspaceEventFixture } from '../testing/workspace-event.fixture';
import { EventStreamPanel } from './EventStreamPanel';

const failed = workspaceEventFixture();
const order = workspaceEventFixture({
  id: 'order:1',
  type: WorkspaceEventType.order_received,
  category: WorkspaceEventCategory.orders,
  severity: WorkspaceEventSeverity.success,
  summary: 'Received order #1001 on Outlet',
  detail: '$39.00',
  occurredAt: '2026-11-08T10:01:00.000Z',
  refs: { ...failed.refs, orderId: 'o-1', productId: null },
});
const proposal = workspaceEventFixture({
  id: 'agent:a-1:made',
  type: WorkspaceEventType.agent_change_proposed,
  category: WorkspaceEventCategory.agent,
  severity: WorkspaceEventSeverity.warning,
  summary: 'Proposed: Retry publishing: Mug on eBay',
  detail: null,
  occurredAt: '2026-11-08T10:02:00.000Z',
});

function renderPanel() {
  const onHighlight = vi.fn<(nodeId: string | null) => void>();
  const onOpenProposals = vi.fn<() => void>();
  render(
    <MemoryRouter>
      <EventStreamPanel
        events={[failed, order, proposal]}
        status={EventFeedStatus.Live}
        onHighlight={onHighlight}
        onOpenProposals={onOpenProposals}
      />
    </MemoryRouter>,
  );
  return { onHighlight, onOpenProposals };
}

function summaries(): string[] {
  const list = screen.getByRole('list', { name: 'What happens in the workspace, newest first' });
  return within(list)
    .getAllByRole('listitem')
    .map((item) => item.querySelector('a, button, p')?.textContent ?? '');
}

describe('EventStreamPanel', () => {
  it('lists the newest first, with the store’s error, and filters to errors', async () => {
    renderPanel();
    expect(summaries()).toEqual([proposal.summary, order.summary, failed.summary]);
    expect(screen.getByText('Item specific Brand is missing')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Errors' }));
    expect(summaries()).toEqual([failed.summary]);
    await userEvent.click(screen.getByRole('radio', { name: 'Agent' }));
    expect(summaries()).toEqual([proposal.summary]);
  });

  it('rings the event’s store on the map while pointed at, and opens a proposal in the chat', async () => {
    const { onHighlight, onOpenProposals } = renderPanel();

    await userEvent.hover(screen.getByRole('link', { name: failed.summary }));
    expect(onHighlight).toHaveBeenLastCalledWith('c-ebay');
    await userEvent.unhover(screen.getByRole('link', { name: failed.summary }));
    expect(onHighlight).toHaveBeenLastCalledWith(null);

    await userEvent.click(screen.getByRole('button', { name: proposal.summary }));
    expect(onOpenProposals).toHaveBeenCalledOnce();
  });

  it('keeps a polite status region for screen readers, and says the feed is live', () => {
    renderPanel();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});
