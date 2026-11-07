import { CircleAlert, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerError, AgentWorkerTurn } from '../agent-worker.types';
import { turnNote } from '../conversation-view';

interface TurnNoticeProps {
  turn: AgentWorkerTurn | null;
  error: AgentWorkerError | null;
}

/** How the last turn went wrong, when it did: the stream's error, or why it stopped early. */
export function TurnNotice({ turn, error }: TurnNoticeProps) {
  const note = turnNote(turn, AGENT_WORKER_COPY.stoppedNote);
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  if (!note) return null;
  return (
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
      <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {note}
    </p>
  );
}
