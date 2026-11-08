import {
  AgentWorkerActionRisk,
  AgentWorkerActionStatus,
  AgentWorkerRole,
  AgentWorkerToolKind,
  AgentWorkerTurnStatus,
} from '@/api/schema';
import { buildConversationView, riskConsequences, risksOf, turnNote } from './conversation-view';
import { INITIAL_LIVE_TURN } from './live-turn';
import { actionFixture, messageFixture, turnFixture } from './testing/agent-worker.fixture';

describe('buildConversationView', () => {
  const answer = messageFixture({
    id: 'm-2',
    role: AgentWorkerRole.assistant,
    text: 'I can retitle it.',
    actions: [actionFixture()],
  });

  it('lists the stored messages and their waiting changes', () => {
    const view = buildConversationView([messageFixture(), answer], INITIAL_LIVE_TURN);
    expect(view.messages).toHaveLength(2);
    expect(view.proposedActions.map(({ id }) => id)).toEqual(['a-1']);
  });

  it('lays the stream’s actions over the stored ones and keeps unknown messages’ apart', () => {
    const decided = actionFixture({ status: AgentWorkerActionStatus.executed });
    const reading = actionFixture({
      id: 'a-2',
      messageId: 'm-9',
      kind: AgentWorkerToolKind.read,
      status: AgentWorkerActionStatus.running,
    });
    const view = buildConversationView([answer], {
      ...INITIAL_LIVE_TURN,
      actions: { [decided.id]: decided, [reading.id]: reading },
    });
    expect(view.messages[0]?.actions).toEqual([decided]);
    expect(view.proposedActions).toEqual([]);
    expect(view.unattachedActions).toEqual([reading]);
  });

  it('does not repeat a streamed message once it is stored', () => {
    const view = buildConversationView([answer], { ...INITIAL_LIVE_TURN, messages: [answer] });
    expect(view.messages).toHaveLength(1);
  });
});

describe('risk helpers', () => {
  it('lists each risk once and words them for the confirmation', () => {
    const risks = risksOf([
      actionFixture({ risks: [AgentWorkerActionRisk.bulk, AgentWorkerActionRisk.price_change] }),
      actionFixture({ risks: [AgentWorkerActionRisk.price_change] }),
    ]);
    expect(risks).toEqual([AgentWorkerActionRisk.price_change, AgentWorkerActionRisk.bulk]);
    expect(riskConsequences(risks)).toBe('changes prices and changes many items');
  });
});

describe('turnNote', () => {
  it('says why a turn stopped early, or that it was stopped', () => {
    expect(turnNote(turnFixture({ failureReason: 'Reached the step limit' }), 'Stopped.')).toBe(
      'Reached the step limit',
    );
    expect(turnNote(turnFixture({ status: AgentWorkerTurnStatus.cancelled }), 'Stopped.')).toBe(
      'Stopped.',
    );
    expect(
      turnNote(turnFixture({ status: AgentWorkerTurnStatus.completed }), 'Stopped.'),
    ).toBeNull();
  });
});
