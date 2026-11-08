import { Sparkles } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { AGENT_WORKER_COPY, AGENT_WORKER_EXAMPLE_PROMPTS } from '../agent-worker.constants';

interface ExamplePromptsProps {
  disabled: boolean;
  onPick: (prompt: string) => void;
}

/** A new conversation: what Crossmart Agent can do, as prompts to send with one click. */
export function ExamplePrompts({ disabled, onPick }: ExamplePromptsProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3 py-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-brand" aria-hidden="true" />
        <h3 className="text-sm font-semibold">{AGENT_WORKER_COPY.emptyTitle}</h3>
      </div>
      <p id={headingId} className="text-xs text-muted-foreground">
        {AGENT_WORKER_COPY.examplesLabel}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {AGENT_WORKER_EXAMPLE_PROMPTS.map((prompt) => (
          <li key={prompt}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-auto rounded-full py-1.5 text-start whitespace-normal"
              disabled={disabled}
              onClick={() => onPick(prompt)}
            >
              {prompt}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
