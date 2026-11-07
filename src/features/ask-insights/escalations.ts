import { ASK_ESCALATION_COPY, ESCALATION_STATUS_ORDER } from './ask-insights.constants';
import { type AskEscalationRecord, CallbackState } from './ask-insights.types';

export function callbackStateOf(escalation: AskEscalationRecord): CallbackState {
  if (!escalation.callbackUrl) return CallbackState.None;
  if (escalation.callbackDeliveredAt) return CallbackState.Delivered;
  if (escalation.callbackError) return CallbackState.Failed;
  return CallbackState.Pending;
}

/** Open escalations first, each group in the order the API sent it (newest first). */
export function openFirst(escalations: readonly AskEscalationRecord[]): AskEscalationRecord[] {
  return escalations.toSorted(
    (left, right) => ESCALATION_STATUS_ORDER[left.status] - ESCALATION_STATUS_ORDER[right.status],
  );
}

/** Who the reply goes to: the email, else the callback URL. */
export function contactOf(escalation: AskEscalationRecord): string {
  return escalation.contactEmail ?? escalation.callbackUrl ?? ASK_ESCALATION_COPY.noContact;
}
