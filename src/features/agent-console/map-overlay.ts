import { AgentWorkerActionStatus } from '@/api/schema';
import type { AgentWorkerAction } from '@/features/agent-worker';
import {
  CATALOG_NODE_ID,
  type MapOverlay,
  type NodeActivity,
  NodeActivityTone,
  type NodeOverlay,
} from '@/features/channel-map';
import { AGENT_CONSOLE_COPY } from './agent-console.constants';

const { activity: COPY } = AGENT_CONSOLE_COPY;

/** When several things happen on one node, the one that matters most is shown. */
const TONE_PRIORITY: Record<NodeActivityTone, number> = {
  [NodeActivityTone.Writing]: 5,
  [NodeActivityTone.Failed]: 4,
  [NodeActivityTone.Reading]: 3,
  [NodeActivityTone.Waiting]: 2,
  [NodeActivityTone.Done]: 1,
};

/** A change in the fewest words: the preview's headline, else the call's summary. */
function changeOf(action: AgentWorkerAction): string {
  return action.preview?.headline ?? action.summary;
}

const ACTIVITY_BY_STATUS: Partial<
  Record<AgentWorkerActionStatus, (action: AgentWorkerAction) => NodeActivity>
> = {
  [AgentWorkerActionStatus.running]: (action) => ({
    label: COPY.reading(action.toolTitle),
    tone: NodeActivityTone.Reading,
  }),
  [AgentWorkerActionStatus.succeeded]: (action) => ({
    label: COPY.read(action.toolTitle, action.outcome),
    tone: NodeActivityTone.Reading,
  }),
  [AgentWorkerActionStatus.failed]: (action) => ({
    label: COPY.failed(action.toolTitle),
    tone: NodeActivityTone.Failed,
  }),
  [AgentWorkerActionStatus.executing]: (action) => ({
    label: COPY.updating(changeOf(action)),
    tone: NodeActivityTone.Writing,
  }),
  [AgentWorkerActionStatus.executed]: (action) => ({
    label: COPY.applied(changeOf(action)),
    tone: NodeActivityTone.Done,
  }),
  [AgentWorkerActionStatus.execution_failed]: (action) => ({
    label: COPY.failed(changeOf(action)),
    tone: NodeActivityTone.Failed,
  }),
};

/** The node a tool call works on: the store it names, else the catalog. */
export function actionNodeId(action: AgentWorkerAction): string {
  return action.targets.connectionIds[0] ?? CATALOG_NODE_ID;
}

function stronger(current: NodeActivity | null, next: NodeActivity): NodeActivity {
  if (!current) return next;
  return TONE_PRIORITY[next.tone] >= TONE_PRIORITY[current.tone] ? next : current;
}

export interface MapOverlayInput {
  /** Tool calls of the running turn, and changes made a moment ago, oldest first. */
  actions: readonly AgentWorkerAction[];
  /** Changes waiting for approval. */
  proposed: readonly AgentWorkerAction[];
  /** Stores whose edge pulses: a change is on its way to them. */
  pulsingStoreIds: ReadonlySet<string>;
  /** The node something else points at, such as a hovered event. */
  highlightedNodeId: string | null;
  onOpenProposals: () => void;
}

function emptyOverlay(input: MapOverlayInput): NodeOverlay {
  return {
    activity: null,
    proposals: 0,
    highlighted: false,
    onOpenProposals: input.onOpenProposals,
  };
}

/**
 * What Crossmart Agent does on the map: each node it reads or changes gets a ring and a few
 * words, the stronger activity winning; proposals add a marker with their count (and words when
 * nothing else happens there); the hovered event's node is ringed.
 */
export function buildMapOverlay(input: MapOverlayInput): MapOverlay {
  const nodes: Record<string, NodeOverlay> = {};
  const nodeFor = (id: string) => (nodes[id] ??= emptyOverlay(input));
  for (const action of input.actions) {
    const activity = ACTIVITY_BY_STATUS[action.status]?.(action);
    if (!activity) continue;
    const node = nodeFor(actionNodeId(action));
    node.activity = stronger(node.activity, activity);
  }
  for (const action of input.proposed) nodeFor(actionNodeId(action)).proposals += 1;
  for (const node of Object.values(nodes)) {
    if (node.proposals > 0) {
      const waiting = { label: COPY.proposed(node.proposals), tone: NodeActivityTone.Waiting };
      node.activity = stronger(node.activity, waiting);
    }
  }
  if (input.highlightedNodeId) nodeFor(input.highlightedNodeId).highlighted = true;
  return { nodes, pulsingStoreIds: input.pulsingStoreIds };
}

/** Whether anything the agent does shows on the map, for the Map tab's dot. */
export function hasActivity(overlay: MapOverlay): boolean {
  return (
    overlay.pulsingStoreIds.size > 0 ||
    Object.values(overlay.nodes).some((node) => node.activity !== null)
  );
}
