import { screen, within } from '@testing-library/react';
import { fetchClient } from '@/api/client';
import { AskChannel, AskOutcome } from '@/api/schema';
import { toAskConversationRoute } from '@/config/routes';
import { apiOk } from '@/features/webhooks/testing/mock-api-client';
import { renderWithProviders } from '@/features/webhooks/testing/render';
import { ASK_CONVERSATIONS_ENDPOINT } from '../ask-insights.constants';
import { conversationSummaryFixture } from '../testing/ask-insights.fixture';
import { ConversationList } from './ConversationList';

vi.mock('@/api/client', async () =>
  (await import('@/features/webhooks/testing/mock-api-client')).createMockApiClient(),
);

const ANSWERED = conversationSummaryFixture();
const ESCALATED = conversationSummaryFixture({
  id: '9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a',
  channel: AskChannel.mcp,
  clientName: 'Claude',
  firstQuestion: 'Why did my eBay listing fail?',
  lastOutcome: AskOutcome.unknown,
  escalated: true,
});

function stubConversations(items = [ANSWERED, ESCALATED]) {
  vi.mocked(fetchClient.GET).mockResolvedValue(
    apiOk({ items, nextCursor: null, total: items.length }) as never,
  );
}

describe('ConversationList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists each conversation with its outcome, channel and a link to it', async () => {
    stubConversations();
    renderWithProviders(<ConversationList />);

    const link = await screen.findByRole('link', { name: 'Why did my eBay listing fail?' });
    expect(link).toHaveAttribute('href', toAskConversationRoute(ESCALATED.id));
    const row = link.closest('tr');
    expect(row).not.toBeNull();
    const cells = within(row as HTMLElement);
    expect(cells.getByText('Not answered')).toBeInTheDocument();
    expect(cells.getByText('Escalated')).toBeInTheDocument();
    expect(cells.getByText('MCP')).toBeInTheDocument();
    expect(cells.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: ANSWERED.firstQuestion ?? '' })).toBeInTheDocument();
    expect(screen.getByText('1–2 of 2 conversations')).toBeInTheDocument();
  });

  it('sends the filters in the URL to the API', async () => {
    stubConversations();
    renderWithProviders(
      <ConversationList />,
      '/?outcome=unknown&channel=mcp&escalated=true&from=2026-11-01',
    );

    await screen.findByRole('link', { name: 'Why did my eBay listing fail?' });
    expect(fetchClient.GET).toHaveBeenCalledWith(ASK_CONVERSATIONS_ENDPOINT, {
      params: {
        query: {
          outcome: AskOutcome.unknown,
          channel: AskChannel.mcp,
          escalated: true,
          from: new Date(2026, 10, 1).toISOString(),
          to: undefined,
          page: 1,
          limit: 25,
        },
      },
      signal: expect.any(AbortSignal),
    });
  });

  it('says when no conversation matches the filters', async () => {
    stubConversations([]);
    renderWithProviders(<ConversationList />, '/?escalated=false');

    expect(await screen.findByText('No conversations match these filters.')).toBeInTheDocument();
  });
});
