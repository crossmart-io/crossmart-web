import { type Ref, useImperativeHandle, useRef } from 'react';
import { Sheet } from '@/components/ui/sheet';
import type { OpenAgentWorkerOptions } from '../agent-worker.types';
import { useAgentWorkerSession } from '../hooks/useAgentWorkerSession';
import { AgentWorkerPanel } from './AgentWorkerPanel';

/** What the provider can do to the session from outside: prepare it as a page opens it. */
export interface AgentWorkerSheetHandle {
  prepare: (options: OpenAgentWorkerOptions) => void;
}

interface AgentWorkerSheetProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ref: Ref<AgentWorkerSheetHandle>;
}

/**
 * The panel and its session for one workspace. The session lives here, not in the sheet's
 * content, so a conversation and a running turn survive closing and reopening the panel.
 */
export function AgentWorkerSheet({ workspaceId, open, onOpenChange, ref }: AgentWorkerSheetProps) {
  const session = useAgentWorkerSession(workspaceId);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({ prepare: session.prepare }), [session.prepare]);

  const focusComposer = (event: Event) => {
    event.preventDefault();
    const composer = composerRef.current;
    composer?.focus();
    composer?.setSelectionRange(composer.value.length, composer.value.length);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <AgentWorkerPanel
        session={session}
        composerRef={composerRef}
        onOpenAutoFocus={focusComposer}
      />
    </Sheet>
  );
}
