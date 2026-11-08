import { Sparkles } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { AgentChat, type AgentWorkerSession } from '@/features/agent-worker';
import { AGENT_CONSOLE_COPY } from '../agent-console.constants';

/** For a role without Crossmart Agent: the map and events still work, the chat says why it is not here. */
function ChatUnavailable() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Sparkles aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{AGENT_CONSOLE_COPY.chatUnavailableTitle}</EmptyTitle>
        <EmptyDescription>{AGENT_CONSOLE_COPY.chatUnavailable}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function ChatPanel({ session }: { session: AgentWorkerSession | null }) {
  return session ? <AgentChat session={session} /> : <ChatUnavailable />;
}
