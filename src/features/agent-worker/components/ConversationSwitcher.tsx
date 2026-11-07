import { History, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { AGENT_WORKER_COPY } from '../agent-worker.constants';
import type { AgentWorkerConversation } from '../agent-worker.types';
import { useAgentWorkerConversations } from '../hooks/useAgentWorkerConversations';

interface ConversationSwitcherProps {
  workspaceId: string;
  conversationId: string | null;
  disabled: boolean;
  onSelect: (conversationId: string | null) => void;
}

function ConversationItem({ conversation }: { conversation: AgentWorkerConversation }) {
  return (
    <DropdownMenuRadioItem value={conversation.id} className="items-start">
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate">{conversation.title}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RelativeTime value={conversation.lastActivityAt} />
          {conversation.pendingActionCount > 0 && (
            <Badge variant="warning">
              {AGENT_WORKER_COPY.pendingCount(conversation.pendingActionCount)}
            </Badge>
          )}
        </span>
      </span>
    </DropdownMenuRadioItem>
  );
}

function ConversationItems({ workspaceId, open }: { workspaceId: string; open: boolean }) {
  const conversations = useAgentWorkerConversations(workspaceId, open);
  if (conversations.isPending) return <Spinner className="mx-auto my-2" />;
  const items = conversations.data?.items ?? [];
  if (!items.length) {
    return (
      <p className="px-2 py-1.5 text-sm text-muted-foreground">{AGENT_WORKER_COPY.historyEmpty}</p>
    );
  }
  return items.map((conversation) => (
    <ConversationItem key={conversation.id} conversation={conversation} />
  ));
}

/** Past conversations to go back to (loaded when the menu opens), and a way to start a new one. */
export function ConversationSwitcher({
  workspaceId,
  conversationId,
  disabled,
  onSelect,
}: ConversationSwitcherProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={disabled}>
            <History data-icon="inline-start" />
            {AGENT_WORKER_COPY.history}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>{AGENT_WORKER_COPY.history}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={conversationId ?? ''} onValueChange={onSelect}>
            <ConversationItems workspaceId={workspaceId} open={open} />
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onSelect(null)}>
            <SquarePen />
            {AGENT_WORKER_COPY.newConversation}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || conversationId === null}
        onClick={() => onSelect(null)}
      >
        <SquarePen data-icon="inline-start" />
        {AGENT_WORKER_COPY.newConversation}
      </Button>
    </div>
  );
}
