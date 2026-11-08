import { createContext, useContext } from 'react';
import type { OpenAgentWorkerOptions } from './agent-worker.types';
import type { AgentWorkerSession } from './hooks/useAgentWorkerSession';

export interface AgentWorkerContextValue {
  /** Whether the person's role in this workspace may use Crossmart Agent. */
  canUse: boolean;
  /**
   * The open conversation and the turn streaming into it. It lives with the app shell, so a turn
   * goes on while the person visits another page. Null when Crossmart Agent is not offered.
   */
  session: AgentWorkerSession | null;
  /** Goes to the Crossmart Agent page, about what was on screen and maybe with text to send. */
  openAgentWorker: (options?: OpenAgentWorkerOptions) => void;
}

/** Outside the provider (and in tests that do not need it), Crossmart Agent is simply not offered. */
export const AgentWorkerContext = createContext<AgentWorkerContextValue>({
  canUse: false,
  session: null,
  openAgentWorker: () => undefined,
});

/** Opens Crossmart Agent from anywhere in the app. */
export function useAgentWorker(): AgentWorkerContextValue {
  return useContext(AgentWorkerContext);
}
