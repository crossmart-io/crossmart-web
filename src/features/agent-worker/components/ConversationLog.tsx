import { useEffect, useRef } from 'react';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerSession } from '../hooks/useAgentWorkerSession';
import { ConversationMessage } from './ConversationMessage';
import { ExamplePrompts } from './ExamplePrompts';
import { LiveTurn } from './LiveTurn';
import { ProposedActionsCard } from './ProposedActionsCard';
import { TurnNotice } from './TurnNotice';

function isEmpty({ conversationId, live }: AgentWorkerSession): boolean {
  return conversationId === null && live.pendingUserText === null;
}

/** The messages as a polite live region, so new ones are read out without interrupting. */
function MessageList({ session }: { session: AgentWorkerSession }) {
  const { view, live, isStreaming } = session;
  return (
    <ol
      role="log"
      aria-live="polite"
      aria-busy={isStreaming}
      aria-label={AGENT_WORKER_COPY.logLabel}
      className="flex flex-col gap-3"
    >
      {view.messages.map((message) => (
        <ConversationMessage key={message.id} message={message} />
      ))}
      <LiveTurn live={live} unattachedActions={view.unattachedActions} isStreaming={isStreaming} />
    </ol>
  );
}

/** The conversation, then the changes waiting for review and how the last turn ended. */
function ConversationBody({ session }: { session: AgentWorkerSession }) {
  const { detail, view, live, isBusy, decide } = session;
  if (detail.isError) {
    return (
      <ErrorState
        title={AGENT_WORKER_COPY.loadError}
        error={detail.error}
        onRetry={detail.refetch}
      />
    );
  }
  if (session.conversationId !== null && detail.isPending && !live.pendingUserText) {
    return <ContentLoader />;
  }
  const proposedKey = view.proposedActions.map(({ id }) => id).join();
  return (
    <>
      <MessageList session={session} />
      {view.proposedActions.length > 0 && !session.isStreaming && (
        <ProposedActionsCard
          key={proposedKey}
          actions={view.proposedActions}
          disabled={isBusy}
          onDecide={decide}
        />
      )}
      <TurnNotice turn={live.turn} error={live.error} />
    </>
  );
}

/** The scrolling middle of the panel; it follows the conversation to its newest line. */
export function ConversationLog({ session }: { session: AgentWorkerSession }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { view, live } = session;

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [view, live]);

  return (
    <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
      {isEmpty(session) ? (
        <ExamplePrompts disabled={session.isBusy} onPick={session.send} />
      ) : (
        <ConversationBody session={session} />
      )}
    </div>
  );
}
