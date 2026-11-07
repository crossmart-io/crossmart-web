import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchClient } from '@/api/client';
import {
  AskChannel,
  AskConfidence,
  AskEscalationReason,
  AskEscalationStatus,
  AskOutcome,
  WorkspaceRole,
} from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ASK_ENDPOINT, ASK_ESCALATIONS_ENDPOINT } from '../ask.constants';
import type { AskAnswer } from '../ask.types';
import { AskLauncher } from './AskLauncher';

vi.mock('@/api/client', async () =>
  (await import('@/features/webhooks/testing/mock-api-client')).createMockApiClient(),
);

const SUPPORT_EMAIL = 'hello@crossmart.io';
const USER_EMAIL = 'dana@example.com';
const WORKSPACE_ID = 'ws-1';
const CONVERSATION_ID = 'conv_first';
const NO_ESCALATION = { offered: false, reason: null };

const ME = {
  id: 'user-1',
  name: 'Dana',
  email: USER_EMAIL,
  platformAdmin: false,
  workspaces: [
    {
      id: WORKSPACE_ID,
      organizationId: 'org',
      name: 'Main',
      displayName: 'Main',
      slug: 'main',
      currency: 'USD',
      timeZone: null,
      sandbox: null,
      role: WorkspaceRole.OWNER,
      customRole: null,
      permissions: [],
    },
  ],
};

const ANSWERED: AskAnswer = {
  outcome: AskOutcome.answered,
  answer: 'Open Channels, pick Shopify, and approve the app in your store.',
  citations: [
    { title: 'Channels › Shopify', url: 'https://docs.crossmart.io/channels/shopify/' },
    { title: 'Getting started', url: 'https://docs.crossmart.io/getting-started/' },
  ],
  confidence: AskConfidence.high,
  handoff: false,
  supportEmail: SUPPORT_EMAIL,
  conversationId: CONVERSATION_ID,
  turnId: 'turn-1',
  escalation: NO_ESCALATION,
};

const UNKNOWN: AskAnswer = {
  outcome: AskOutcome.unknown,
  answer: `I don’t know the answer from Crossmart’s documentation. Email ${SUPPORT_EMAIL}.`,
  citations: [],
  confidence: AskConfidence.low,
  handoff: true,
  supportEmail: SUPPORT_EMAIL,
  conversationId: CONVERSATION_ID,
  turnId: 'turn-1',
  escalation: NO_ESCALATION,
};

const OFFERED: AskAnswer = {
  ...UNKNOWN,
  escalation: { offered: true, reason: AskEscalationReason.unanswered },
};

type PostResult = Awaited<ReturnType<typeof fetchClient.POST>>;

function reply(status: number, body: unknown): PostResult {
  const ok = status < 400;
  return {
    data: ok ? body : undefined,
    error: ok ? undefined : body,
    response: new Response(null, { status }),
  } as PostResult;
}

function respondWith(result: PostResult) {
  vi.mocked(fetchClient.POST).mockReturnValue(Promise.resolve(result));
}

async function openLauncher() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <AskLauncher />
      </TooltipProvider>
    </QueryClientProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Help' }));
}

async function openAndAsk(question = 'How do I connect Shopify?') {
  await openLauncher();
  await userEvent.type(screen.getByLabelText('Your question'), `${question}{Enter}`);
  return screen.getByRole('log');
}

describe('AskLauncher', () => {
  beforeEach(() => {
    vi.mocked(fetchClient.POST).mockReset();
    vi.mocked(fetchClient.GET).mockResolvedValue(reply(200, ME) as never);
  });

  it('opens a labelled panel with suggested questions', async () => {
    await openLauncher();

    expect(screen.getByRole('dialog', { name: 'Ask Crossmart' })).toHaveAccessibleDescription(
      /answers from the Crossmart docs\. It can be wrong/,
    );
    expect(
      screen.getByRole('button', { name: 'How do I connect my Shopify store?' }),
    ).toBeEnabled();
  });

  it('shows the answer with numbered sources that open the docs', async () => {
    respondWith(reply(200, ANSWERED));
    const log = await openAndAsk();

    expect(await within(log).findByText(ANSWERED.answer)).toBeInTheDocument();
    const [first, ...rest] = within(log).getAllByRole('link');
    expect(rest).toHaveLength(1);
    expect(first).toHaveAccessibleName('Channels › Shopify (opens in a new tab)');
    expect(first).toHaveAttribute('href', 'https://docs.crossmart.io/channels/shopify/');
    expect(first?.closest('ol')).toBeInTheDocument();
    expect(screen.getByLabelText('Your question')).toHaveValue('');
  });

  it('offers to email a person when the docs do not answer', async () => {
    respondWith(reply(200, UNKNOWN));
    const log = await openAndAsk();

    const handoff = await within(log).findByRole('link', { name: /Ask a person/ });
    expect(handoff).toHaveAttribute('href', `mailto:${SUPPORT_EMAIL}`);
  });

  it('shows that it is looking while the answer is on its way', async () => {
    vi.mocked(fetchClient.POST).mockReturnValue(new Promise(() => {}));
    const log = await openAndAsk();

    expect(within(log).getByText('Looking through the docs…')).toBeInTheDocument();
    expect(log).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled();
  });

  it('asks to wait when rate limited', async () => {
    respondWith(reply(429, { statusCode: 429, message: 'Too many questions from you.' }));
    const log = await openAndAsk();

    expect(await within(log).findByText('That’s a lot of questions at once')).toBeInTheDocument();
    expect(within(log).getByText(/Wait a minute, then ask again/)).toBeInTheDocument();
  });

  it('explains when Ask is unavailable and points to the docs', async () => {
    const reason = 'Ask Crossmart has answered all the questions it can today.';
    respondWith(reply(503, { statusCode: 503, message: reason }));
    const log = await openAndAsk();

    expect(await within(log).findByText('Ask Crossmart is not available right now')).toBeVisible();
    expect(within(log).getByText(reason)).toBeInTheDocument();
    expect(within(log).getByRole('link', { name: /Browse the docs/ })).toHaveAttribute(
      'href',
      'https://docs.crossmart.io',
    );
  });

  it('does not send a question that is too short', async () => {
    await openAndAsk('hi');

    expect(fetchClient.POST).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled();
  });

  it('asks from the app widget, in the current workspace, and follows up in the same conversation', async () => {
    respondWith(reply(200, ANSWERED));
    const log = await openAndAsk();
    await within(log).findByText(ANSWERED.answer);

    await userEvent.type(screen.getByLabelText('Your question'), 'And eBay?{Enter}');

    expect(fetchClient.POST).toHaveBeenNthCalledWith(1, ASK_ENDPOINT, {
      body: {
        question: 'How do I connect Shopify?',
        conversationId: undefined,
        workspaceId: WORKSPACE_ID,
        channel: AskChannel.app_widget,
      },
    });
    expect(fetchClient.POST).toHaveBeenNthCalledWith(2, ASK_ENDPOINT, {
      body: {
        question: 'And eBay?',
        conversationId: CONVERSATION_ID,
        workspaceId: WORKSPACE_ID,
        channel: AskChannel.app_widget,
      },
    });
  });

  it('starts a new conversation after starting over', async () => {
    respondWith(reply(200, ANSWERED));
    const log = await openAndAsk();
    await within(log).findByText(ANSWERED.answer);

    await userEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(within(screen.getByRole('log')).queryByText(ANSWERED.answer)).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Your question'), 'How do plans work?{Enter}');

    expect(fetchClient.POST).toHaveBeenLastCalledWith(ASK_ENDPOINT, {
      body: expect.objectContaining({ question: 'How do plans work?', conversationId: undefined }),
    });
  });

  it('hands the conversation to a person when Ask offers one', async () => {
    respondWith(reply(200, OFFERED));
    const log = await openAndAsk();

    vi.mocked(fetchClient.POST).mockResolvedValueOnce(
      reply(201, {
        id: 'ticket-1',
        status: AskEscalationStatus.open,
        reason: AskEscalationReason.unanswered,
        reply: null,
        repliedAt: null,
        createdAt: '2026-11-07T10:00:00Z',
        callbackSecret: null,
      }),
    );
    await userEvent.click(await within(log).findByRole('button', { name: 'Contact a person' }));

    expect(fetchClient.POST).toHaveBeenCalledWith(ASK_ESCALATIONS_ENDPOINT, {
      body: { conversationId: CONVERSATION_ID, contactEmail: USER_EMAIL },
    });
    expect(await within(log).findByRole('status')).toHaveTextContent(
      `A person will reply to ${USER_EMAIL}`,
    );
    expect(within(log).queryByRole('link', { name: /Ask a person/ })).not.toBeInTheDocument();
  });
});
