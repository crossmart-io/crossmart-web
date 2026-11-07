import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AskCitations } from '@/features/ask';
import { formatDateTime } from '@/lib/format';
import { ASK_CONVERSATION_COPY } from '../ask-insights.constants';
import type { AskTurn } from '../ask-insights.types';
import { AskConfidenceBadge } from './AskConfidenceBadge';
import { AskOutcomeBadge } from './AskOutcomeBadge';
import { TurnFacts } from './TurnFacts';

/** One question and the answer Ask gave, with its sources and how it was produced. */
export function TurnCard({ turn }: { turn: AskTurn }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          <AskOutcomeBadge outcome={turn.outcome} />
          <AskConfidenceBadge confidence={turn.confidence} />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTime(turn.createdAt)}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <section className="flex flex-col gap-1">
          <h3 className="text-xs font-medium text-muted-foreground">
            {ASK_CONVERSATION_COPY.question}
          </h3>
          <p dir="auto" className="font-medium break-words whitespace-pre-line">
            {turn.question}
          </p>
        </section>
        <section className="flex flex-col gap-1">
          <h3 className="text-xs font-medium text-muted-foreground">
            {ASK_CONVERSATION_COPY.answer}
          </h3>
          <p dir="auto" className="leading-relaxed break-words whitespace-pre-line">
            {turn.answer}
          </p>
        </section>
        <AskCitations citations={turn.citations} />
        <TurnFacts turn={turn} />
      </CardContent>
    </Card>
  );
}
