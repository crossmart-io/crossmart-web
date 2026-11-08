import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { useModifierShortcut } from '@/hooks/useModifierShortcut';
import { AgentWorkerContext, type AgentWorkerContextValue } from '../agent-worker-context';
import { AGENT_WORKER_SHORTCUT_KEY } from '../agent-worker.constants';
import type { OpenAgentWorkerOptions } from '../agent-worker.types';
import { useAgentWorkerSession } from '../hooks/useAgentWorkerSession';

const NOT_OFFERED: AgentWorkerContextValue = {
  canUse: false,
  session: null,
  openAgentWorker: () => undefined,
};

/** The session of one workspace, and the ways into the Crossmart Agent page. */
function AgentWorkerSessionProvider({
  workspaceId,
  children,
}: PropsWithChildren<{ workspaceId: string }>) {
  const session = useAgentWorkerSession(workspaceId);
  const navigate = useNavigate();
  const { prepare } = session;
  const openAgentWorker = useCallback(
    (options: OpenAgentWorkerOptions = {}) => {
      prepare(options);
      void navigate(ROUTES.agent);
    },
    [navigate, prepare],
  );
  const openFromShortcut = useCallback(() => openAgentWorker(), [openAgentWorker]);
  useModifierShortcut(AGENT_WORKER_SHORTCUT_KEY, openFromShortcut);

  const value = useMemo<AgentWorkerContextValue>(
    () => ({ canUse: true, session, openAgentWorker }),
    [session, openAgentWorker],
  );
  return <AgentWorkerContext value={value}>{children}</AgentWorkerContext>;
}

/**
 * Makes Crossmart Agent available to the whole app shell: `useAgentWorker().openAgentWorker()`
 * from any page, and Cmd/Ctrl+J, both go to its page. Offered only to a role with
 * `agent_worker:use`; the session starts over in another workspace.
 */
export function AgentWorkerProvider({ children }: PropsWithChildren) {
  const { workspace } = useCurrentWorkspace();
  const canUse =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.agent_worker_use);
  if (!canUse) return <AgentWorkerContext value={NOT_OFFERED}>{children}</AgentWorkerContext>;
  return (
    <AgentWorkerSessionProvider key={workspace.id} workspaceId={workspace.id}>
      {children}
    </AgentWorkerSessionProvider>
  );
}
