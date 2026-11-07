import { Badge } from '@/components/ui/badge';
import { formatDuration } from '../ask-insights.format';
import {
  ACCOUNT_LOOKUP_LABELS,
  ASK_CONVERSATION_COPY,
  ASK_ESCALATION_REASON_LABELS,
} from '../ask-insights.constants';
import type { AskTurn } from '../ask-insights.types';

/** How a turn was answered: account lookups, a person offered, latency, model and cache. */
export function TurnFacts({ turn }: { turn: AskTurn }) {
  return (
    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
      {turn.accountLookups.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span>{ASK_CONVERSATION_COPY.accountLookups}:</span>
          {turn.accountLookups.map((lookup) => (
            <Badge key={lookup} variant="secondary">
              {ACCOUNT_LOOKUP_LABELS[lookup]}
            </Badge>
          ))}
        </div>
      )}
      {turn.escalationReason && (
        <p>
          {ASK_CONVERSATION_COPY.escalationOffered}:{' '}
          {ASK_ESCALATION_REASON_LABELS[turn.escalationReason]}
        </p>
      )}
      <p className="flex flex-wrap gap-x-3 gap-y-1 tabular-nums">
        <span>
          {ASK_CONVERSATION_COPY.latency} {formatDuration(turn.latencyMs)}
        </span>
        {turn.model && (
          <span>
            {ASK_CONVERSATION_COPY.model} <span className="font-mono">{turn.model}</span>
          </span>
        )}
        {turn.cached && <span>{ASK_CONVERSATION_COPY.cached}</span>}
      </p>
    </div>
  );
}
