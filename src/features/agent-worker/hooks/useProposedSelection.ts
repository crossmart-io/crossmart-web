import { useState } from 'react';
import type { AgentWorkerActionRisk } from '@/api/schema';
import type { AgentWorkerAction, AgentWorkerDecision } from '../agent-worker.types';
import { risksOf } from '../conversation-view';

export interface ProposedSelection {
  isSelected: (actionId: string) => boolean;
  toggle: (actionId: string) => void;
  /** The risks of the selected changes; approving them needs `confirmed`. */
  risks: readonly AgentWorkerActionRisk[];
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
  canApprove: boolean;
  /** The decision that approves the selected changes and rejects the rest. */
  approval: () => AgentWorkerDecision;
}

/**
 * Which of the waiting changes the person approves: all of them to begin with. A selection with
 * a risky change also needs the person to confirm they understand what it does.
 */
export function useProposedSelection(actions: readonly AgentWorkerAction[]): ProposedSelection {
  const [selectedIds, setSelectedIds] = useState(() => new Set(actions.map(({ id }) => id)));
  const [confirmed, setConfirmed] = useState(false);
  const selected = actions.filter((action) => selectedIds.has(action.id));
  const risks = risksOf(selected);

  const toggle = (actionId: string) =>
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(actionId)) next.add(actionId);
      return next;
    });

  return {
    isSelected: (actionId) => selectedIds.has(actionId),
    toggle,
    risks,
    confirmed,
    setConfirmed,
    canApprove: selected.length > 0 && (risks.length === 0 || confirmed),
    approval: () => ({
      approvedActionIds: selected.map(({ id }) => id),
      confirmHighRisk: risks.length > 0,
    }),
  };
}
