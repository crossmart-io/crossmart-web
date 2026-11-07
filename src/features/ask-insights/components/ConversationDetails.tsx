import { useId } from 'react';
import { ASK_CONVERSATION_COPY } from '../ask-insights.constants';
import type { AskConversationDetail } from '../ask-insights.types';
import { ConversationOverview } from './ConversationOverview';
import { EscalationCard } from './EscalationCard';
import { TurnCard } from './TurnCard';

/** A conversation's header facts, then its escalations, then every question in order. */
export function ConversationDetails({ conversation }: { conversation: AskConversationDetail }) {
  const escalationsId = useId();
  const turnsId = useId();
  return (
    <div className="flex flex-col gap-6">
      <ConversationOverview conversation={conversation} />
      {conversation.escalations.length > 0 && (
        <section aria-labelledby={escalationsId} className="flex flex-col gap-3">
          <h2 id={escalationsId} className="font-heading text-lg font-semibold">
            {ASK_CONVERSATION_COPY.escalationsHeading}
          </h2>
          {conversation.escalations.map((escalation) => (
            <EscalationCard key={escalation.id} escalation={escalation} />
          ))}
        </section>
      )}
      <section aria-labelledby={turnsId} className="flex flex-col gap-3">
        <h2 id={turnsId} className="font-heading text-lg font-semibold">
          {ASK_CONVERSATION_COPY.turnsHeading}
        </h2>
        <ol className="flex flex-col gap-3">
          {conversation.turns.map((turn) => (
            <li key={turn.id}>
              <TurnCard turn={turn} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
