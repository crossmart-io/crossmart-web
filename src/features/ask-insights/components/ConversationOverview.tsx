import { DetailItem } from '@/components/layout/DetailItem';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import {
  ASK_CALLER_TYPE_LABELS,
  ASK_CHANNEL_LABELS,
  ASK_CONVERSATION_COPY,
} from '../ask-insights.constants';
import type { AskConversationDetail } from '../ask-insights.types';

/** Where the conversation came from, who had it, and when. */
export function ConversationOverview({ conversation }: { conversation: AskConversationDetail }) {
  const caller = ASK_CALLER_TYPE_LABELS[conversation.callerType];
  return (
    <Card>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label={ASK_CONVERSATION_COPY.channel}>
            {ASK_CHANNEL_LABELS[conversation.channel]}
          </DetailItem>
          <DetailItem label={ASK_CONVERSATION_COPY.caller}>
            {conversation.clientName ? `${conversation.clientName} (${caller})` : caller}
          </DetailItem>
          <DetailItem label={ASK_CONVERSATION_COPY.workspace}>
            <span className="font-mono text-xs">
              {conversation.workspaceId ?? ASK_CONVERSATION_COPY.noWorkspace}
            </span>
          </DetailItem>
          <DetailItem label={ASK_CONVERSATION_COPY.started}>
            {formatDateTime(conversation.createdAt)}
          </DetailItem>
          <DetailItem label={ASK_CONVERSATION_COPY.lastActivity}>
            {formatDateTime(conversation.lastActivityAt)}
          </DetailItem>
          <DetailItem label={ASK_CONVERSATION_COPY.questions}>{conversation.turnCount}</DetailItem>
        </dl>
      </CardContent>
    </Card>
  );
}
