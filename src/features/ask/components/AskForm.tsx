import { type FormEvent, type KeyboardEvent, useId, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ASK_COPY, ASK_QUESTION_MAX_LENGTH, ASK_QUESTION_MIN_LENGTH } from '../ask.constants';

const SUBMIT_KEY = 'Enter';
const QUESTION_ROWS = 2;

interface AskFormProps {
  isAsking: boolean;
  onAsk: (question: string) => void;
}

/** Enter sends the question unless Shift is held or an input method is composing text. */
function isSubmitKey(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.key === SUBMIT_KEY && !event.shiftKey && !event.nativeEvent.isComposing;
}

/** Where the question is typed. It clears once sent; the panel shows it above the reply. */
export function AskForm({ isAsking, onAsk }: AskFormProps) {
  const [question, setQuestion] = useState('');
  const inputId = useId();
  const hintId = useId();
  const trimmed = question.trim();
  const canAsk = !isAsking && trimmed.length >= ASK_QUESTION_MIN_LENGTH;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canAsk) return;
    onAsk(trimmed);
    setQuestion('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border-t p-4">
      <Label htmlFor={inputId} className="sr-only">
        {ASK_COPY.questionLabel}
      </Label>
      <div className="flex items-end gap-2">
        <Textarea
          id={inputId}
          rows={QUESTION_ROWS}
          dir="auto"
          maxLength={ASK_QUESTION_MAX_LENGTH}
          placeholder={ASK_COPY.questionPlaceholder}
          aria-describedby={hintId}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (!isSubmitKey(event)) return;
            event.preventDefault();
            submit();
          }}
          className="max-h-40 min-h-0 resize-none"
        />
        <Button type="submit" size="icon" disabled={!canAsk} aria-label={ASK_COPY.submit}>
          {isAsking ? <Spinner /> : <SendHorizontal className="rtl:-scale-x-100" />}
        </Button>
      </div>
      <p id={hintId} className="text-xs text-muted-foreground">
        <Kbd>{SUBMIT_KEY}</Kbd> {ASK_COPY.keyboardHint}
      </p>
    </form>
  );
}
