import { type Ref } from 'react';
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerSession } from '../hooks/useAgentWorkerSession';
import { Composer } from './Composer';
import { ConversationLog } from './ConversationLog';
import { ConversationSwitcher } from './ConversationSwitcher';

interface AgentWorkerPanelProps {
  session: AgentWorkerSession;
  composerRef: Ref<HTMLTextAreaElement>;
  /** Moves focus to the composer as the sheet opens, instead of its first button. */
  onOpenAutoFocus: (event: Event) => void;
}

/** The sheet's content: what Agent Worker is, the conversation and the composer. */
export function AgentWorkerPanel({ session, composerRef, onOpenAutoFocus }: AgentWorkerPanelProps) {
  return (
    <SheetContent
      onOpenAutoFocus={onOpenAutoFocus}
      className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
    >
      <SheetHeader className="gap-1 border-b pe-12">
        <SheetTitle>{AGENT_WORKER_COPY.name}</SheetTitle>
        <SheetDescription>{AGENT_WORKER_COPY.description}</SheetDescription>
        <div className="-ms-2">
          <ConversationSwitcher
            workspaceId={session.workspaceId}
            conversationId={session.conversationId}
            disabled={session.isStreaming}
            onSelect={session.selectConversation}
          />
        </div>
      </SheetHeader>
      <ConversationLog session={session} />
      <Composer
        inputRef={composerRef}
        value={session.draft}
        onChange={session.setDraft}
        onSend={session.send}
        onStop={session.stop}
        isBusy={session.isBusy}
      />
    </SheetContent>
  );
}
