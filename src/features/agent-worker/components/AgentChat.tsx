import { Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AGENT_WORKER_COPY, AGENT_WORKER_TEST_IDS } from '../agent-worker.constants';
import type { AgentWorkerSession } from '../hooks/useAgentWorkerSession';
import { Composer } from './Composer';
import { ConversationLog } from './ConversationLog';
import { ConversationSwitcher } from './ConversationSwitcher';

/** The composer takes the focus when the page opens, with the cursor after any prefilled text. */
function useFocusOnOpen() {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const composer = composerRef.current;
    composer?.focus();
    composer?.setSelectionRange(composer.value.length, composer.value.length);
  }, []);
  return composerRef;
}

function ChatHeader({ session }: { session: AgentWorkerSession }) {
  return (
    <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap">
        <Sparkles className="size-4 text-brand" aria-hidden="true" />
        {AGENT_WORKER_COPY.name}
      </h2>
      <ConversationSwitcher
        workspaceId={session.workspaceId}
        conversationId={session.conversationId}
        disabled={session.isStreaming}
        onSelect={session.selectConversation}
      />
    </header>
  );
}

/**
 * The chat with Crossmart Agent, as a column of its page: the conversations, the messages with
 * their tool activity and the changes to approve, and the composer.
 */
export function AgentChat({ session }: { session: AgentWorkerSession }) {
  const composerRef = useFocusOnOpen();
  return (
    <section
      aria-label={AGENT_WORKER_COPY.logLabel}
      data-testid={AGENT_WORKER_TEST_IDS.chat}
      className="flex h-full min-h-0 flex-col"
    >
      <ChatHeader session={session} />
      <ConversationLog session={session} />
      <Composer
        inputRef={composerRef}
        value={session.draft}
        onChange={session.setDraft}
        onSend={session.send}
        onStop={session.stop}
        isBusy={session.isBusy}
      />
    </section>
  );
}
