import { AgentWorkerRole } from '@/api/schema';
import { cn } from '@/lib/utils';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';

interface MessageBubbleProps {
  role: AgentWorkerRole;
  text: string;
  /** The answer is still streaming in. */
  streaming?: boolean;
}

const ROLE_NAMES: Record<AgentWorkerRole, string> = {
  [AgentWorkerRole.user]: AGENT_WORKER_COPY.you,
  [AgentWorkerRole.assistant]: AGENT_WORKER_COPY.name,
};

/**
 * One message as plain text, line breaks kept, so an answer never renders markup. The person's
 * messages sit on the right, Crossmart Agent's on the left; the role is named for screen readers.
 */
export function MessageBubble({ role, text, streaming = false }: MessageBubbleProps) {
  const isUser = role === AgentWorkerRole.user;
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <p
        dir="auto"
        aria-busy={streaming}
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
          isUser ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted',
        )}
      >
        <span className="sr-only">{ROLE_NAMES[role]}: </span>
        {text}
      </p>
    </div>
  );
}
