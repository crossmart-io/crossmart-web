import { type FormEvent, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  ASK_ESCALATION_COPY,
  ASK_REPLY_MAX_LENGTH,
  ASK_REPLY_ROWS,
} from '../ask-insights.constants';
import { useReplyToAskEscalation } from '../hooks/useAskEscalations';

/** Where an admin writes the one reply an open escalation gets. */
export function EscalationReplyForm({ escalationId }: { escalationId: string }) {
  const [reply, setReply] = useState('');
  const inputId = useId();
  const hintId = useId();
  const { mutate, isPending } = useReplyToAskEscalation(escalationId);
  const trimmed = reply.trim();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed || isPending) return;
    mutate(trimmed, { onSuccess: () => setReply('') });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{ASK_ESCALATION_COPY.replyLabel}</Label>
      <Textarea
        id={inputId}
        rows={ASK_REPLY_ROWS}
        dir="auto"
        maxLength={ASK_REPLY_MAX_LENGTH}
        aria-describedby={hintId}
        value={reply}
        onChange={(event) => setReply(event.target.value)}
      />
      <p id={hintId} className="text-xs text-muted-foreground">
        {ASK_ESCALATION_COPY.replyHint}
      </p>
      <Button type="submit" className="self-start" disabled={!trimmed || isPending}>
        {isPending && <Spinner data-icon="inline-start" />}
        {ASK_ESCALATION_COPY.replySubmit}
      </Button>
    </form>
  );
}
