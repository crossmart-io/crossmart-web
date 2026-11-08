import {
  AgentWorkerActionStatus,
  AgentWorkerEventType,
  AgentWorkerErrorCode,
  AgentWorkerRole,
  AgentWorkerTurnStatus,
} from '@/api/schema';
import {
  applyStreamEvent,
  INITIAL_LIVE_TURN,
  LiveTurnActionType,
  liveTurnReducer,
  type LiveTurnState,
} from './live-turn';
import { actionFixture, messageFixture, turnFixture } from './testing/agent-worker.fixture';

function started(userText = 'Fix my failed eBay listings'): LiveTurnState {
  return liveTurnReducer(INITIAL_LIVE_TURN, { type: LiveTurnActionType.Start, userText });
}

describe('liveTurnReducer', () => {
  it('shows the sent text until the stream reports the stored user message', () => {
    const state = started();
    expect(state.pendingUserText).toBe('Fix my failed eBay listings');
    const stored = applyStreamEvent(state, {
      type: AgentWorkerEventType.message,
      message: messageFixture(),
    });
    expect(stored.pendingUserText).toBeNull();
    expect(stored.messages).toHaveLength(1);
  });

  it('appends text deltas, and replaces them with the stored assistant message', () => {
    let state = started();
    state = applyStreamEvent(state, { type: AgentWorkerEventType.text_delta, delta: 'Two ' });
    state = applyStreamEvent(state, { type: AgentWorkerEventType.text_delta, delta: 'failed.' });
    expect(state.streamingText).toBe('Two failed.');
    state = applyStreamEvent(state, {
      type: AgentWorkerEventType.message,
      message: messageFixture({ id: 'm-2', role: AgentWorkerRole.assistant, text: 'Two failed.' }),
    });
    expect(state.streamingText).toBe('');
    expect(state.messages.map(({ id }) => id)).toEqual(['m-2']);
  });

  it('keeps the latest version of each action', () => {
    let state = started();
    state = applyStreamEvent(state, {
      type: AgentWorkerEventType.action_proposed,
      action: actionFixture(),
    });
    state = applyStreamEvent(state, {
      type: AgentWorkerEventType.action_decided,
      action: actionFixture({ status: AgentWorkerActionStatus.executed }),
    });
    expect(Object.values(state.actions)).toEqual([
      actionFixture({ status: AgentWorkerActionStatus.executed }),
    ]);
  });

  it('records the turn and an error', () => {
    let state = started();
    state = applyStreamEvent(state, {
      type: AgentWorkerEventType.turn_started,
      turn: turnFixture(),
    });
    const error = { code: AgentWorkerErrorCode.credits_exhausted, message: 'No AI credits left' };
    state = applyStreamEvent(state, { type: AgentWorkerEventType.error, error });
    expect(state.turn?.status).toBe(AgentWorkerTurnStatus.running);
    expect(state.error).toEqual(error);
  });

  it('ignores an event without the field its type promises', () => {
    const state = started();
    expect(applyStreamEvent(state, { type: AgentWorkerEventType.message })).toBe(state);
  });

  it('keeps the turn ending and the error when the stored conversation catches up', () => {
    let state = started();
    const turn = turnFixture({ status: AgentWorkerTurnStatus.failed, failureReason: 'Step limit' });
    state = applyStreamEvent(state, { type: AgentWorkerEventType.turn_finished, turn });
    state = applyStreamEvent(state, {
      type: AgentWorkerEventType.action_proposed,
      action: actionFixture(),
    });
    const settled = liveTurnReducer(state, { type: LiveTurnActionType.Settle });
    expect(settled.turn).toEqual(turn);
    expect(settled.actions).toEqual({});
    expect(liveTurnReducer(settled, { type: LiveTurnActionType.Reset })).toEqual(INITIAL_LIVE_TURN);
  });
});
