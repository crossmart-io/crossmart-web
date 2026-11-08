import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { AgentWorkerActionStatus } from '@/api/schema';
import type { AgentWorkerSession } from '@/features/agent-worker';
import { actionFixture } from '@/features/agent-worker/testing/agent-worker.fixture';
import { useRefreshOnAgentChanges } from './useRefreshOnAgentChanges';

function sessionWith(...statuses: AgentWorkerActionStatus[]): AgentWorkerSession {
  const actions = Object.fromEntries(
    statuses.map((status, index) => [`a-${index}`, actionFixture({ id: `a-${index}`, status })]),
  );
  return { live: { actions } } as unknown as AgentWorkerSession;
}

describe('useRefreshOnAgentChanges', () => {
  it('refetches the map’s counts when the turn reports a change applied', () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { rerender } = renderHook(({ session }) => useRefreshOnAgentChanges(session), {
      wrapper,
      initialProps: { session: sessionWith(AgentWorkerActionStatus.executing) },
    });
    expect(invalidate).not.toHaveBeenCalled();

    rerender({ session: sessionWith(AgentWorkerActionStatus.executed) });
    expect(invalidate).toHaveBeenCalled();
  });
});
