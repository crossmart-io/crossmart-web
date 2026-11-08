import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentWorkerActionRisk } from '@/api/schema';
import type { AgentWorkerDecision } from '../agent-worker.types';
import { actionFixture } from '../testing/agent-worker.fixture';
import { ProposedActionsCard } from './ProposedActionsCard';

const retitle = actionFixture();
const reprice = actionFixture({
  id: 'a-2',
  summary: 'Lower the price of Linen Shirt on Outlet store',
  risks: [AgentWorkerActionRisk.price_change],
  untrustedWarning: true,
  preview: {
    target: null,
    headline: 'Lower the price',
    details: [],
    changes: [{ label: 'Price (M)', before: '$49.00', after: '$39.00' }],
  },
});

function renderCard(actions = [retitle, reprice]) {
  const onDecide = vi.fn<(decision: AgentWorkerDecision) => void>();
  render(<ProposedActionsCard actions={actions} disabled={false} onDecide={onDecide} />);
  return onDecide;
}

const approveButton = () => screen.getByRole('button', { name: 'Approve selected' });

describe('ProposedActionsCard', () => {
  it('shows each change in plain words, with its preview, risks and untrusted-text warning', () => {
    renderCard();
    expect(
      screen.getByText('Change how this product shows on Outlet store only'),
    ).toBeInTheDocument();
    expect(screen.getByText('$39.00')).toBeInTheDocument();
    expect(screen.getByText('Changes prices')).toBeInTheDocument();
    expect(
      screen.getByText('Text read in this turn looked like instructions; review carefully'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Relaxed Fit/)).toBeInTheDocument();
  });

  it('requires confirming a risky change before approving it', async () => {
    const onDecide = renderCard();
    expect(approveButton()).toBeDisabled();
    await userEvent.click(screen.getByLabelText('I understand this changes prices'));
    await userEvent.click(approveButton());
    expect(onDecide).toHaveBeenCalledWith({
      approvedActionIds: ['a-1', 'a-2'],
      confirmHighRisk: true,
    });
  });

  it('approves only the selected changes, without confirmation when none is risky', async () => {
    const onDecide = renderCard();
    await userEvent.click(screen.getByLabelText('Lower the price'));
    expect(screen.queryByLabelText(/I understand/)).not.toBeInTheDocument();
    await userEvent.click(approveButton());
    expect(onDecide).toHaveBeenCalledWith({ approvedActionIds: ['a-1'], confirmHighRisk: false });
  });

  it('rejects every change at once', async () => {
    const onDecide = renderCard();
    await userEvent.click(screen.getByRole('button', { name: 'Reject all' }));
    expect(onDecide).toHaveBeenCalledWith({ approvedActionIds: [], confirmHighRisk: false });
  });

  it('falls back to the summary for a change without a preview', () => {
    renderCard([actionFixture({ preview: null, summary: 'Do something' })]);
    expect(screen.getByLabelText('Do something')).toBeInTheDocument();
  });

  it('cannot approve when nothing is selected', async () => {
    renderCard([retitle]);
    await userEvent.click(
      screen.getByLabelText('Change how this product shows on Outlet store only'),
    );
    expect(approveButton()).toBeDisabled();
  });
});
