import type { WorkspaceEvent } from './agent-console.types';

function byPosition(left: WorkspaceEvent, right: WorkspaceEvent): number {
  const byTime = Date.parse(left.occurredAt) - Date.parse(right.occurredAt);
  if (byTime !== 0) return byTime;
  if (left.id === right.id) return 0;
  return left.id < right.id ? -1 : 1;
}

/**
 * The events kept on the page, oldest first: the new ones added, each once (a reconnect or a
 * poll may send one again), and only the newest `max`.
 */
export function mergeEvents(
  kept: readonly WorkspaceEvent[],
  incoming: readonly WorkspaceEvent[],
  max: number,
): WorkspaceEvent[] {
  const known = new Set(kept.map(({ id }) => id));
  const added = incoming.filter(({ id }) => !known.has(id));
  if (added.length === 0) return kept as WorkspaceEvent[];
  return [...kept, ...added].sort(byPosition).slice(-max);
}
