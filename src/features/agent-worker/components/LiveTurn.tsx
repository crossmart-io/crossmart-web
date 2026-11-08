import { AgentWorkerRole } from '@/api/schema';
import { Spinner } from '@/components/ui/spinner';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerAction } from '../agent-worker.types';
import type { LiveTurnState } from '../live-turn';
import { ActionList } from './ActionRow';
import { MessageBubble } from './MessageBubble';

interface LiveTurnProps {
  live: LiveTurnState;
  unattachedActions: readonly AgentWorkerAction[];
  isStreaming: boolean;
}

/** What the running turn has shown so far and not stored yet: the message sent, tools, the answer. */
export function LiveTurn({ live, unattachedActions, isStreaming }: LiveTurnProps) {
  return (
    <>
      {live.pendingUserText && (
        <li>
          <MessageBubble role={AgentWorkerRole.user} text={live.pendingUserText} />
        </li>
      )}
      {unattachedActions.length > 0 && (
        <li>
          <ActionList actions={unattachedActions} />
        </li>
      )}
      {live.streamingText && (
        <li>
          <MessageBubble role={AgentWorkerRole.assistant} text={live.streamingText} streaming />
        </li>
      )}
      {isStreaming && !live.streamingText && (
        <li className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <Spinner className="size-3.5" />
          {AGENT_WORKER_COPY.working}
        </li>
      )}
    </>
  );
}
