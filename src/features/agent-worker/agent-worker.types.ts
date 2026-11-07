import type { components } from '@/api/schema';

export type AgentWorkerConversation = components['schemas']['AgentWorkerConversationDto'];
export type AgentWorkerConversationDetail =
  components['schemas']['AgentWorkerConversationDetailDto'];
export type AgentWorkerMessage = components['schemas']['AgentWorkerMessageDto'];
export type AgentWorkerAction = components['schemas']['AgentWorkerActionDto'];
export type AgentWorkerChange = components['schemas']['AgentWorkerChangeDto'];
export type AgentWorkerTurn = components['schemas']['AgentWorkerTurnDto'];
export type AgentWorkerError = components['schemas']['AgentWorkerErrorDto'];
export type AgentWorkerStreamEvent = components['schemas']['AgentWorkerStreamEventDto'];
export type AgentWorkerPageContext = components['schemas']['AgentWorkerPageContextDto'];
export type SendAgentWorkerMessage = components['schemas']['SendAgentWorkerMessageDto'];
export type AgentWorkerDecision = components['schemas']['DecideAgentWorkerActionsDto'];

/** How a page opens the panel: where the person is, and text to start the composer with. */
export interface OpenAgentWorkerOptions {
  context?: AgentWorkerPageContext;
  /** Put in the composer, not sent: the person reads it and presses send. */
  prefill?: string;
}
