import { createContext, useContext } from 'react';
import type { OpenAgentWorkerOptions } from './agent-worker.types';

export interface AgentWorkerContextValue {
  /** Whether the person's role in this workspace may use Agent Worker. */
  canUse: boolean;
  isOpen: boolean;
  openAgentWorker: (options?: OpenAgentWorkerOptions) => void;
  setOpen: (open: boolean) => void;
}

/** Outside the provider (and in tests that do not need it), Agent Worker is simply not offered. */
export const AgentWorkerContext = createContext<AgentWorkerContextValue>({
  canUse: false,
  isOpen: false,
  openAgentWorker: () => undefined,
  setOpen: () => undefined,
});

/** Opens the Agent Worker panel from anywhere in the app. */
export function useAgentWorker(): AgentWorkerContextValue {
  return useContext(AgentWorkerContext);
}
