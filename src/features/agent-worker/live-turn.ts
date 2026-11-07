import { AgentWorkerEventType, AgentWorkerRole } from '@/api/schema';
import type {
  AgentWorkerAction,
  AgentWorkerError,
  AgentWorkerMessage,
  AgentWorkerStreamEvent,
  AgentWorkerTurn,
} from './agent-worker.types';

/**
 * What the open stream has told the panel so far, on top of the stored conversation: the turn,
 * the answer being written, the messages and actions it reported, and an error if one came.
 */
export interface LiveTurnState {
  turn: AgentWorkerTurn | null;
  /** The message just sent, shown until the stream reports it stored. */
  pendingUserText: string | null;
  /** The answer as it streams in, until its stored message arrives. */
  streamingText: string;
  messages: readonly AgentWorkerMessage[];
  /** The latest version of each action the stream reported, by id, in the order first seen. */
  actions: Readonly<Record<string, AgentWorkerAction>>;
  error: AgentWorkerError | null;
}

export enum LiveTurnActionType {
  /** A message or decision was sent: a new stream starts. */
  Start = 'start',
  Event = 'event',
  /** The stored conversation has caught up: drop what it now holds, keep the turn's ending. */
  Settle = 'settle',
  /** Another conversation: forget everything. */
  Reset = 'reset',
}

export type LiveTurnAction =
  | { type: LiveTurnActionType.Start; userText?: string }
  | { type: LiveTurnActionType.Event; event: AgentWorkerStreamEvent }
  | { type: LiveTurnActionType.Settle }
  | { type: LiveTurnActionType.Reset };

export const INITIAL_LIVE_TURN: LiveTurnState = {
  turn: null,
  pendingUserText: null,
  streamingText: '',
  messages: [],
  actions: {},
  error: null,
};

function withMessage(state: LiveTurnState, message: AgentWorkerMessage): LiveTurnState {
  const messages = [...state.messages.filter((stored) => stored.id !== message.id), message];
  return message.role === AgentWorkerRole.user
    ? { ...state, messages, pendingUserText: null }
    : { ...state, messages, streamingText: '' };
}

function withAction(state: LiveTurnState, action: AgentWorkerAction): LiveTurnState {
  return { ...state, actions: { ...state.actions, [action.id]: action } };
}

type EventHandler = (state: LiveTurnState, event: AgentWorkerStreamEvent) => LiveTurnState;

const withTurn: EventHandler = (state, { turn }) => (turn ? { ...state, turn } : state);
const withActionEvent: EventHandler = (state, { action }) =>
  action ? withAction(state, action) : state;

/** What each event does; an event missing the field its type promises changes nothing. */
const EVENT_HANDLERS: Record<AgentWorkerEventType, EventHandler> = {
  [AgentWorkerEventType.turn_started]: withTurn,
  [AgentWorkerEventType.turn_finished]: withTurn,
  [AgentWorkerEventType.text_delta]: (state, { delta }) => ({
    ...state,
    streamingText: state.streamingText + (delta ?? ''),
  }),
  [AgentWorkerEventType.message]: (state, { message }) =>
    message ? withMessage(state, message) : state,
  [AgentWorkerEventType.tool_started]: withActionEvent,
  [AgentWorkerEventType.tool_finished]: withActionEvent,
  [AgentWorkerEventType.action_proposed]: withActionEvent,
  [AgentWorkerEventType.action_decided]: withActionEvent,
  [AgentWorkerEventType.error]: (state, { error }) => (error ? { ...state, error } : state),
};

/** Applies one stream event; an event type this app does not know yet is ignored. */
export function applyStreamEvent(
  state: LiveTurnState,
  event: AgentWorkerStreamEvent,
): LiveTurnState {
  const handler = EVENT_HANDLERS[event.type] as EventHandler | undefined;
  return handler ? handler(state, event) : state;
}

export function liveTurnReducer(state: LiveTurnState, action: LiveTurnAction): LiveTurnState {
  switch (action.type) {
    case LiveTurnActionType.Start:
      return { ...INITIAL_LIVE_TURN, pendingUserText: action.userText ?? null };
    case LiveTurnActionType.Event:
      return applyStreamEvent(state, action.event);
    case LiveTurnActionType.Settle:
      return { ...INITIAL_LIVE_TURN, turn: state.turn, error: state.error };
    case LiveTurnActionType.Reset:
      return INITIAL_LIVE_TURN;
    default:
      return state;
  }
}
