import { useParams } from 'react-router';
import { PlatformAdminGate } from '@/components/feedback/PlatformAdminGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import {
  ASK_CONVERSATION_COPY,
  ASK_INSIGHTS_COPY,
  ConversationDetails,
  useAskConversation,
} from '@/features/ask-insights';

const CONVERSATION_PAGE_COPY: ResourcePageCopy = {
  name: ASK_CONVERSATION_COPY.name,
  notFoundName: ASK_CONVERSATION_COPY.notFoundName,
  notFound: ASK_CONVERSATION_COPY.notFound,
  loadFailed: ASK_CONVERSATION_COPY.loadFailed,
};

function Conversation({ conversationId }: { conversationId: string }) {
  const query = useAskConversation(conversationId);
  return (
    <ResourcePage query={query} copy={CONVERSATION_PAGE_COPY} parents={PAGE_PARENTS.askInsights}>
      {(conversation) => (
        <Page
          name={ASK_CONVERSATION_COPY.name}
          parents={PAGE_PARENTS.askInsights}
          title={
            <span dir="auto" className="min-w-0 break-words">
              {conversation.firstQuestion ?? ASK_INSIGHTS_COPY.noQuestion}
            </span>
          }
        >
          <ConversationDetails conversation={conversation} />
        </Page>
      )}
    </ResourcePage>
  );
}

/** One Ask conversation; the backend's escalation emails link here. */
export function AskConversationPage() {
  const conversationId = useParams()[ROUTE_PARAMS.conversationId] ?? '';
  return (
    <PlatformAdminGate>
      <Conversation conversationId={conversationId} />
    </PlatformAdminGate>
  );
}
