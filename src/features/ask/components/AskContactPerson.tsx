import { CircleCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ASK_COPY } from '../ask.constants';
import type { AskEscalation } from '../hooks/useAskEscalation';

/** Hands the conversation to the Crossmart team, then says where their reply will go. */
export function AskContactPerson({ escalation }: { escalation: AskEscalation }) {
  const { request, isPending, isSent, error, contactEmail } = escalation;
  if (isSent && contactEmail) {
    return (
      <output className="flex items-start gap-2 text-sm text-muted-foreground">
        <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
        {ASK_COPY.contactPersonSent(contactEmail)}
      </output>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={isPending || !contactEmail}
        onClick={request}
      >
        {isPending ? <Spinner data-icon="inline-start" /> : <UserRound data-icon="inline-start" />}
        {ASK_COPY.contactPerson}
      </Button>
      <p className="text-xs text-muted-foreground">{ASK_COPY.contactPersonHint}</p>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
