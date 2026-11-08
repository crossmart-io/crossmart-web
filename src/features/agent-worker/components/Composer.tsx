import { type FormEvent, type KeyboardEvent, type Ref, useId } from 'react';
import { SendHorizontal, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AGENT_WORKER_COPY,
  AGENT_WORKER_MESSAGE_MAX_LENGTH,
  AGENT_WORKER_TEST_IDS,
} from '../agent-worker.constants';

const SUBMIT_KEY = 'Enter';
const COMPOSER_ROWS = 2;

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isBusy: boolean;
  inputRef?: Ref<HTMLTextAreaElement>;
}

/** Enter sends unless Shift is held or an input method is composing text. */
function isSubmitKey(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.key === SUBMIT_KEY && !event.shiftKey && !event.nativeEvent.isComposing;
}

function StopButton({ onStop }: { onStop: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={AGENT_WORKER_COPY.stop}
      data-testid={AGENT_WORKER_TEST_IDS.stop}
      onClick={onStop}
    >
      <Square className="fill-current" />
    </Button>
  );
}

/** Where the message is typed, with Send, or Stop while Crossmart Agent is working. */
export function Composer({ value, onChange, onSend, onStop, isBusy, inputRef }: ComposerProps) {
  const inputId = useId();
  const hintId = useId();
  const text = value.trim();
  const canSend = !isBusy && text.length > 0;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (canSend) onSend(text);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border-t p-4">
      <Label htmlFor={inputId} className="sr-only">
        {AGENT_WORKER_COPY.composerLabel}
      </Label>
      <div className="flex items-end gap-2">
        <Textarea
          ref={inputRef}
          id={inputId}
          rows={COMPOSER_ROWS}
          dir="auto"
          maxLength={AGENT_WORKER_MESSAGE_MAX_LENGTH}
          placeholder={AGENT_WORKER_COPY.composerPlaceholder}
          aria-describedby={hintId}
          data-testid={AGENT_WORKER_TEST_IDS.composer}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (!isSubmitKey(event)) return;
            event.preventDefault();
            submit();
          }}
          className="max-h-40 min-h-0 resize-none"
        />
        {isBusy ? (
          <StopButton onStop={onStop} />
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            aria-label={AGENT_WORKER_COPY.send}
            data-testid={AGENT_WORKER_TEST_IDS.send}
          >
            <SendHorizontal className="rtl:-scale-x-100" />
          </Button>
        )}
      </div>
      <p id={hintId} className="text-xs text-muted-foreground">
        <Kbd>{SUBMIT_KEY}</Kbd> {AGENT_WORKER_COPY.keyboardHint}
      </p>
    </form>
  );
}
