import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentProposalStatus, AgentWorkerActionRisk } from '@/api/schema';
import { proposalFixture } from '../testing/agent-proposal.fixture';
import { AgentProposalCard, type ProposalDecisionActions } from './AgentProposalCard';

function renderCard(proposal = proposalFixture(), withActions = true) {
  const actions: ProposalDecisionActions = {
    disabled: false,
    onApprove: vi.fn<ProposalDecisionActions['onApprove']>(),
    onReject: vi.fn<ProposalDecisionActions['onReject']>(),
  };
  render(
    <ul>
      <AgentProposalCard proposal={proposal} actions={withActions ? actions : undefined} />
    </ul>,
  );
  return actions;
}

const approveButton = () => screen.getByRole('button', { name: 'Approve' });

describe('AgentProposalCard', () => {
  it('shows what the change does, who proposed it, and the values before and after', () => {
    renderCard();
    expect(screen.getByText('Change the title')).toBeInTheDocument();
    expect(screen.getByText('Claude for Dana')).toBeInTheDocument();
    expect(screen.getByText('Waiting for you')).toBeInTheDocument();
    expect(screen.getByText(/Relaxed Fit/)).toBeInTheDocument();
  });

  it('approves or rejects a waiting proposal', async () => {
    const actions = renderCard();
    await userEvent.click(approveButton());
    expect(actions.onApprove).toHaveBeenCalledWith('pr-1', false);
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(actions.onReject).toHaveBeenCalledWith('pr-1');
  });

  it('requires confirming a risky change before approving it', async () => {
    const actions = renderCard(proposalFixture({ risks: [AgentWorkerActionRisk.price_change] }));
    expect(screen.getByText('Changes prices')).toBeInTheDocument();
    expect(approveButton()).toBeDisabled();
    await userEvent.click(screen.getByLabelText('I understand this changes prices'));
    await userEvent.click(approveButton());
    expect(actions.onApprove).toHaveBeenCalledWith('pr-1', true);
  });

  it('shows how a decided proposal ended, without buttons', () => {
    renderCard(
      proposalFixture({
        status: AgentProposalStatus.failed,
        decidedByName: 'Lee',
        result: 'Crossmart refused (403): no longer connected',
      }),
    );
    expect(screen.getByText('Approved by Lee')).toBeInTheDocument();
    expect(screen.getByText(/no longer connected/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('only shows a waiting proposal to someone who may not decide it', () => {
    renderCard(proposalFixture(), false);
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
  });
});
