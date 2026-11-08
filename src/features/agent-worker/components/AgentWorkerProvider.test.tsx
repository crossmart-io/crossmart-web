import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
  AgentWorkerActionStatus,
  AgentWorkerEventType,
  AgentWorkerRole,
  AgentWorkerTurnStatus,
  WorkspacePermission,
  WorkspaceRole,
} from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import { fetchClient } from '@/api/client';
import type * as Workspaces from '@/features/workspaces';
import { useCurrentWorkspace, type Workspace } from '@/features/workspaces';
import { apiOk } from '@/features/webhooks/testing/mock-api-client';
import { ROUTES } from '@/config/routes';
import { useAgentWorker } from '../agent-worker-context';
import {
  actionFixture,
  eventStreamText,
  messageFixture,
  turnFixture,
} from '../testing/agent-worker.fixture';
import { AgentChat } from './AgentChat';
import { AgentWorkerLauncher } from './AgentWorkerLauncher';
import { AgentWorkerProvider } from './AgentWorkerProvider';

vi.mock('@/api/client', async () =>
  (await import('@/features/webhooks/testing/mock-api-client')).createMockApiClient(),
);
vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
}));

function workspaceWith(permissions: WorkspacePermission[]): Workspace {
  return {
    id: 'ws-1',
    organizationId: 'org',
    name: 'Main',
    displayName: 'Main',
    slug: 'main',
    currency: 'USD',
    timeZone: null,
    sandbox: null,
    role: WorkspaceRole.CUSTOM,
    customRole: null,
    permissions,
  };
}

/** The Crossmart Agent page, as far as the chat goes. */
function AgentPage() {
  const { session } = useAgentWorker();
  return session ? <AgentChat session={session} /> : null;
}

function FixButton() {
  const { openAgentWorker } = useAgentWorker();
  return (
    <button type="button" onClick={() => openAgentWorker({ prefill: 'Fix North shop' })}>
      Fix
    </button>
  );
}

function renderProvider(permissions = [WorkspacePermission.agent_worker_use]) {
  vi.mocked(useCurrentWorkspace).mockReturnValue({
    workspace: workspaceWith(permissions),
    workspaces: [],
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn<() => void>(),
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TooltipProvider>
          <AgentWorkerProvider>
            <AgentWorkerLauncher />
            <Routes>
              <Route path={ROUTES.home} element={<FixButton />} />
              <Route path={ROUTES.agent} element={<AgentPage />} />
            </Routes>
          </AgentWorkerProvider>
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const conversation = {
  id: 'cv-1',
  title: 'Fix North shop',
  pendingActionCount: 1,
  lastActivityAt: '2026-11-08T10:00:00.000Z',
  createdAt: '2026-11-08T10:00:00.000Z',
};
const proposed = actionFixture({ status: AgentWorkerActionStatus.proposed });
const answer = messageFixture({
  id: 'm-2',
  role: AgentWorkerRole.assistant,
  text: 'I can retitle it.',
  actions: [proposed],
});

describe('AgentWorkerProvider', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('is not offered to a role without agent_worker:use', () => {
    renderProvider([]);
    expect(screen.queryByRole('button', { name: 'Crossmart Agent' })).not.toBeInTheDocument();
  });

  it('opens its page prefilled, sends on Enter, and shows the changes to review', async () => {
    vi.mocked(fetchClient.POST).mockResolvedValue(apiOk(conversation, 201));
    vi.mocked(fetchClient.GET).mockResolvedValue(
      apiOk({
        conversation,
        messages: [messageFixture({ text: 'Fix North shop' }), answer],
        activeTurn: null,
      }),
    );
    const stream = eventStreamText([
      { type: AgentWorkerEventType.turn_started, turn: turnFixture() },
      { type: AgentWorkerEventType.message, message: answer },
      {
        type: AgentWorkerEventType.turn_finished,
        turn: turnFixture({ status: AgentWorkerTurnStatus.awaiting_approval }),
      },
    ]);
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(stream)));
    renderProvider();

    await userEvent.click(screen.getByRole('button', { name: 'Fix' }));
    const composer = await screen.findByLabelText('Message Crossmart Agent');
    expect(composer).toHaveValue('Fix North shop');
    expect(composer).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(await screen.findByText('Review the changes')).toBeInTheDocument();
    expect(screen.getByText('I can retitle it.')).toBeInTheDocument();
    await waitFor(() => expect(composer).toHaveValue(''));
  });

  it('goes to its page from the header button', async () => {
    renderProvider();

    await userEvent.click(screen.getByRole('button', { name: 'Crossmart Agent' }));
    expect(await screen.findByLabelText('Message Crossmart Agent')).toBeInTheDocument();
  });

  it('goes to its page with Cmd or Ctrl+J, from anywhere', async () => {
    renderProvider();

    await userEvent.keyboard('{Control>}j{/Control}');
    expect(await screen.findByLabelText('Message Crossmart Agent')).toBeInTheDocument();
  });
});
