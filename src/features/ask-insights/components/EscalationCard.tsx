import { AskEscalationStatus } from '@/api/schema';
import { DetailItem } from '@/components/layout/DetailItem';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import {
  ASK_ESCALATION_COPY,
  ASK_ESCALATION_REASON_LABELS,
  CALLBACK_STATE_LABELS,
} from '../ask-insights.constants';
import { type AskEscalationRecord, CallbackState } from '../ask-insights.types';
import { callbackStateOf } from '../escalations';
import { EscalationReplyForm } from './EscalationReplyForm';
import { EscalationStatusBadge } from './EscalationStatusBadge';

function CallbackStatus({ escalation }: { escalation: AskEscalationRecord }) {
  const state = callbackStateOf(escalation);
  return (
    <div className="flex flex-col gap-0.5">
      <span className={state === CallbackState.Failed ? 'text-destructive' : undefined}>
        {CALLBACK_STATE_LABELS[state]}
      </span>
      {escalation.callbackUrl && (
        <span className="font-mono text-xs break-all text-muted-foreground">
          {escalation.callbackUrl}
        </span>
      )}
      {state === CallbackState.Failed && (
        <span className="text-xs text-destructive">{escalation.callbackError}</span>
      )}
    </div>
  );
}

function EscalationReply({ escalation }: { escalation: AskEscalationRecord }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-muted px-3 py-2">
      <p className="text-xs text-muted-foreground">
        {ASK_ESCALATION_COPY.repliedBy} {escalation.repliedBy ?? '—'} ·{' '}
        {formatDateTime(escalation.repliedAt)}
      </p>
      <p dir="auto" className="text-sm break-words whitespace-pre-line">
        {escalation.reply}
      </p>
    </div>
  );
}

/** One hand-off to a person: who to answer, how, and the reply or a form to write it. */
export function EscalationCard({ escalation }: { escalation: AskEscalationRecord }) {
  const isOpen = escalation.status === AskEscalationStatus.open;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label={ASK_ESCALATION_COPY.status}>
            <EscalationStatusBadge status={escalation.status} />
          </DetailItem>
          <DetailItem label={ASK_ESCALATION_COPY.reason}>
            {ASK_ESCALATION_REASON_LABELS[escalation.reason]}
          </DetailItem>
          <DetailItem label={ASK_ESCALATION_COPY.opened}>
            {formatDateTime(escalation.createdAt)}
          </DetailItem>
          <DetailItem label={ASK_ESCALATION_COPY.contactEmail}>
            {escalation.contactEmail ?? '—'}
          </DetailItem>
          <DetailItem label={ASK_ESCALATION_COPY.callback}>
            <CallbackStatus escalation={escalation} />
          </DetailItem>
        </dl>
        {isOpen ? (
          <EscalationReplyForm escalationId={escalation.id} />
        ) : (
          <EscalationReply escalation={escalation} />
        )}
      </CardContent>
    </Card>
  );
}
