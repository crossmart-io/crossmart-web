import {
  AgentWorkerActionRisk,
  AgentWorkerActionStatus,
  AgentWorkerTurnStatus,
} from '@/api/schema';
import { AGENT_WORKER_RISK_COPY } from './agent-worker.constants';
import type { AgentWorkerAction, AgentWorkerMessage, AgentWorkerTurn } from './agent-worker.types';
import type { LiveTurnState } from './live-turn';

/** The conversation as the panel draws it: stored messages with the stream's news laid over. */
export interface ConversationView {
  messages: readonly AgentWorkerMessage[];
  /** Actions the stream reported for a message it has not reported yet. */
  unattachedActions: readonly AgentWorkerAction[];
  /** Every change still waiting for a decision, oldest first. */
  proposedActions: readonly AgentWorkerAction[];
}

function mergeMessages(
  stored: readonly AgentWorkerMessage[],
  live: readonly AgentWorkerMessage[],
): AgentWorkerMessage[] {
  const storedIds = new Set(stored.map((message) => message.id));
  return [...stored, ...live.filter((message) => !storedIds.has(message.id))];
}

/** A message's actions in their latest version, plus any the stream added to it. */
function withLiveActions(
  message: AgentWorkerMessage,
  liveActions: readonly AgentWorkerAction[],
): AgentWorkerMessage {
  const latest = new Map(liveActions.map((action) => [action.id, action]));
  const known = new Set(message.actions.map((action) => action.id));
  const added = liveActions.filter(
    (action) => action.messageId === message.id && !known.has(action.id),
  );
  const actions = [...message.actions.map((action) => latest.get(action.id) ?? action), ...added];
  return { ...message, actions };
}

export function buildConversationView(
  stored: readonly AgentWorkerMessage[],
  live: LiveTurnState,
): ConversationView {
  const liveActions = Object.values(live.actions);
  const messages = mergeMessages(stored, live.messages).map((message) =>
    withLiveActions(message, liveActions),
  );
  const messageIds = new Set(messages.map((message) => message.id));
  const allActions = messages.flatMap((message) => message.actions);
  return {
    messages,
    unattachedActions: liveActions.filter((action) => !messageIds.has(action.messageId)),
    proposedActions: allActions.filter(isProposed),
  };
}

export function isProposed(action: AgentWorkerAction): boolean {
  return action.status === AgentWorkerActionStatus.proposed;
}

/** The risks of the given actions, each once, in the order the API lists them. */
export function risksOf(actions: readonly AgentWorkerAction[]): AgentWorkerActionRisk[] {
  const present = new Set(actions.flatMap((action) => action.risks));
  return Object.values(AgentWorkerActionRisk).filter((risk) => present.has(risk));
}

/** "deletes, changes prices and changes many items", for the confirmation checkbox. */
export function riskConsequences(risks: readonly AgentWorkerActionRisk[]): string {
  const phrases = risks.map((risk) => AGENT_WORKER_RISK_COPY[risk].consequence);
  const last = phrases.pop();
  return phrases.length ? `${phrases.join(', ')} and ${last}` : (last ?? '');
}

/** The note under the conversation: why the last turn stopped early, or that it was stopped. */
export function turnNote(turn: AgentWorkerTurn | null, stoppedNote: string): string | null {
  if (!turn) return null;
  if (turn.failureReason) return turn.failureReason;
  return turn.status === AgentWorkerTurnStatus.cancelled ? stoppedNote : null;
}
