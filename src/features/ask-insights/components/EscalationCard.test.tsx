import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { fetchClient } from '@/api/client';
import { AskEscalationStatus } from '@/api/schema';
import { apiError, apiOk } from '@/features/webhooks/testing/mock-api-client';
import { renderWithProviders } from '@/features/webhooks/testing/render';
import { ASK_ESCALATION_FEEDBACK, ASK_ESCALATION_REPLY_ENDPOINT } from '../ask-insights.constants';
import { ESCALATION_ID, escalationFixture } from '../testing/ask-insights.fixture';
import { EscalationCard } from './EscalationCard';

vi.mock('@/api/client', async () =>
  (await import('@/features/webhooks/testing/mock-api-client')).createMockApiClient(),
);
vi.mock('sonner', () => ({
  toast: { warning: vi.fn<typeof toast.warning>(), error: vi.fn<typeof toast.error>() },
}));

const REPLY = 'Hi Dana, open Channels and press Reconnect on your eBay store.';

async function writeReply() {
  await userEvent.type(screen.getByLabelText('Your reply'), REPLY);
  await userEvent.click(screen.getByRole('button', { name: 'Send reply' }));
}

describe('EscalationCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends the reply to an open escalation and clears the form', async () => {
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiOk(escalationFixture({ status: AskEscalationStatus.replied, reply: REPLY })) as never,
    );
    renderWithProviders(<EscalationCard escalation={escalationFixture()} />);

    expect(screen.getByRole('button', { name: 'Send reply' })).toBeDisabled();
    await writeReply();

    expect(fetchClient.POST).toHaveBeenCalledWith(ASK_ESCALATION_REPLY_ENDPOINT, {
      params: { path: { escalationId: ESCALATION_ID } },
      body: { reply: REPLY },
    });
    expect(await screen.findByLabelText('Your reply')).toHaveValue('');
  });

  it('says when another admin replied first', async () => {
    vi.mocked(fetchClient.POST).mockResolvedValue(
      apiError(409, { message: 'Already replied' }) as never,
    );
    renderWithProviders(<EscalationCard escalation={escalationFixture()} />);

    await writeReply();

    await vi.waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(ASK_ESCALATION_FEEDBACK.alreadyReplied),
    );
    expect(toast.error).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Your reply')).toHaveValue(REPLY);
  });

  it('shows the reply, and no form, once replied', () => {
    renderWithProviders(
      <EscalationCard
        escalation={escalationFixture({
          status: AskEscalationStatus.replied,
          reply: REPLY,
          repliedBy: 'yariv@crossmart.io',
          repliedAt: '2026-11-06T12:00:00Z',
          callbackUrl: 'https://agent.example.com/reply',
          callbackError: 'The receiver answered 500',
        })}
      />,
    );

    expect(screen.getByText(REPLY)).toBeInTheDocument();
    expect(screen.queryByLabelText('Your reply')).not.toBeInTheDocument();
    expect(screen.getByText('The receiver answered 500')).toBeInTheDocument();
  });
});
