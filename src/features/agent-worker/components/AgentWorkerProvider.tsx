import { type PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { WorkspacePermission } from '@/api/schema';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';
import { useModifierShortcut } from '@/hooks/useModifierShortcut';
import { AgentWorkerContext, type AgentWorkerContextValue } from '../agent-worker-context';
import { AGENT_WORKER_SHORTCUT_KEY } from '../agent-worker.constants';
import type { OpenAgentWorkerOptions } from '../agent-worker.types';
import { AgentWorkerSheet, type AgentWorkerSheetHandle } from './AgentWorkerSheet';

/**
 * Makes Agent Worker available to the whole app shell: `useAgentWorker().openAgentWorker()` from
 * any page, and Cmd/Ctrl+J. Offered only to a role with `agent_worker:use`; the session starts
 * over in another workspace.
 */
export function AgentWorkerProvider({ children }: PropsWithChildren) {
  const { workspace } = useCurrentWorkspace();
  const canUse =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.agent_worker_use);
  const [isOpen, setOpen] = useState(false);
  const sheet = useRef<AgentWorkerSheetHandle>(null);

  const openAgentWorker = useCallback(
    (options: OpenAgentWorkerOptions = {}) => {
      if (!canUse) return;
      sheet.current?.prepare(options);
      setOpen(true);
    },
    [canUse],
  );
  const toggle = useCallback(() => setOpen((open) => !open), []);
  useModifierShortcut(AGENT_WORKER_SHORTCUT_KEY, toggle, canUse);

  const value = useMemo<AgentWorkerContextValue>(
    () => ({ canUse, isOpen: canUse && isOpen, openAgentWorker, setOpen }),
    [canUse, isOpen, openAgentWorker],
  );

  return (
    <AgentWorkerContext value={value}>
      {children}
      {canUse && (
        <AgentWorkerSheet
          key={workspace.id}
          ref={sheet}
          workspaceId={workspace.id}
          open={isOpen}
          onOpenChange={setOpen}
        />
      )}
    </AgentWorkerContext>
  );
}
