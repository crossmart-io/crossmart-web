import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { ReviewSource } from '@/config/routes';
import { usePendingProposalCount } from '@/features/agent-proposals';
import { usePendingSuggestionCount } from '@/features/suggestions';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import { REVIEW_COPY } from '../review.constants';
import { ReviewInbox } from './ReviewInbox';

vi.mock('@/features/suggestions', () => ({
  SuggestionsInbox: () => <p>Suggestions inbox</p>,
  usePendingSuggestionCount: vi.fn<typeof usePendingSuggestionCount>(),
}));
vi.mock('@/features/agent-proposals', () => ({
  AgentProposalsInbox: () => <p>Proposals inbox</p>,
  usePendingProposalCount: vi.fn<typeof usePendingProposalCount>(),
}));

function renderInbox(permissions: WorkspacePermission[], entry = '/agent/review') {
  vi.mocked(usePendingSuggestionCount).mockReturnValue(2);
  vi.mocked(usePendingProposalCount).mockReturnValue(3);
  render(
    <MemoryRouter initialEntries={[entry]}>
      <ReviewInbox workspace={workspaceFixture(permissions)} />
    </MemoryRouter>,
  );
}

const PROPOSALS_TAB = new RegExp(REVIEW_COPY.sources[ReviewSource.Proposals]);

describe('ReviewInbox', () => {
  it('opens on AI suggestions, with a count per source', () => {
    renderInbox([WorkspacePermission.suggestions_view]);
    expect(screen.getByText('Suggestions inbox')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: PROPOSALS_TAB })).toHaveTextContent('3');
  });

  it("switches to outside agents' proposals", async () => {
    renderInbox([WorkspacePermission.suggestions_view]);
    await userEvent.click(screen.getByRole('radio', { name: PROPOSALS_TAB }));
    expect(screen.getByText('Proposals inbox')).toBeInTheDocument();
  });

  it('keeps proposals from a role that may not see them, even from a link', () => {
    renderInbox([], `/agent/review?source=${ReviewSource.Proposals}`);
    expect(screen.getByText('Suggestions inbox')).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: PROPOSALS_TAB })).not.toBeInTheDocument();
  });
});
