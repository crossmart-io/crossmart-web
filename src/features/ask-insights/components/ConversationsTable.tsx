import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toAskConversationRoute } from '@/config/routes';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  ASK_CALLER_TYPE_LABELS,
  ASK_CHANNEL_LABELS,
  ASK_INSIGHTS_COPY,
} from '../ask-insights.constants';
import type { AskConversationSummary } from '../ask-insights.types';
import { AskOutcomeBadge } from './AskOutcomeBadge';

interface ConversationsTableProps {
  conversations: readonly AskConversationSummary[];
  isRefreshing: boolean;
}

/** Stored conversations, newest first. Each first question opens the conversation. */
export function ConversationsTable({ conversations, isRefreshing }: ConversationsTableProps) {
  return (
    <div
      className={cn('rounded-lg border transition-opacity', isRefreshing && 'opacity-60')}
      aria-busy={isRefreshing}
    >
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead>First question</TableHead>
            <TableHead className="hidden w-36 md:table-cell">Channel</TableHead>
            <TableHead className="hidden w-24 lg:table-cell">Questions</TableHead>
            <TableHead className="w-36">Outcome</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">Last activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <ConversationRow key={conversation.id} conversation={conversation} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ConversationRow({ conversation }: { conversation: AskConversationSummary }) {
  const caller = conversation.clientName ?? ASK_CALLER_TYPE_LABELS[conversation.callerType];
  return (
    // The question link stretches over the row, so the whole row opens the conversation.
    <TableRow className="relative">
      <TableCell className="max-w-0 whitespace-normal">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            to={toAskConversationRoute(conversation.id)}
            dir="auto"
            className="line-clamp-2 font-medium break-words after:absolute after:inset-0 hover:underline focus-visible:underline"
          >
            {conversation.firstQuestion ?? ASK_INSIGHTS_COPY.noQuestion}
          </Link>
          <span className="text-xs text-muted-foreground">{caller}</span>
        </div>
      </TableCell>
      <TableCell className="hidden text-muted-foreground md:table-cell">
        {ASK_CHANNEL_LABELS[conversation.channel]}
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
        {conversation.turnCount}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {conversation.lastOutcome && <AskOutcomeBadge outcome={conversation.lastOutcome} />}
          {conversation.escalated && (
            <Badge variant="outline">{ASK_INSIGHTS_COPY.escalatedBadge}</Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
        {formatDateTime(conversation.lastActivityAt)}
      </TableCell>
    </TableRow>
  );
}
