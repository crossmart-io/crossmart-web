import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { ReviewSource } from '@/config/routes';
import type * as Attention from '@/features/attention';
import { useAttentionCounts } from '@/features/attention';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import { REVIEW_COPY } from '../review.constants';
import { ReviewInbox } from './ReviewInbox';

vi.mock('@/features/suggestions', () => ({
  SuggestionsInbox: () => <p>Suggestions inbox</p>,
}));
vi.mock('@/features/agent-proposals', () => ({
  AgentProposalsInbox: () => <p>Proposals inbox</p>,
}));
vi.mock('@/features/attention', async (importOriginal) => ({
  ...(await importOriginal<typeof Attention>()),
  useAttentionCounts: vi.fn<typeof useAttentionCounts>(),
}));

function renderInbox(permissions: WorkspacePermission[], entry = '/agent/review') {
  vi.mocked(useAttentionCounts).mockReturnValue({
    stores: 0,
    listings: 0,
    suggestions: 2,
    proposals: 3,
    total: 5,
  });
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
