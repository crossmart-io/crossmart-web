import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { useUrlPagination } from '@/hooks/usePagination';
import { ASK_INSIGHTS_COPY } from '../ask-insights.constants';
import { useAskConversations } from '../hooks/useAskConversations';
import { type ConversationFilters, useConversationFilters } from '../hooks/useConversationFilters';
import { ConversationFilterBar } from './ConversationFilterBar';
import { ConversationsTable } from './ConversationsTable';
import { EmptyNote } from './EmptyNote';

/** The filters and one page of matching conversations. */
export function ConversationList() {
  const filters = useConversationFilters();
  return (
    <div className="flex flex-col gap-4">
      <ConversationFilterBar filters={filters} />
      <ConversationResults filters={filters} />
    </div>
  );
}

function ConversationResults({ filters }: { filters: ConversationFilters }) {
  const pagination = useUrlPagination();
  const conversations = useAskConversations(filters, pagination);
  if (conversations.isError) {
    return (
      <ErrorState
        title={ASK_INSIGHTS_COPY.conversationsLoadFailed}
        error={conversations.error}
        onRetry={conversations.refetch}
      />
    );
  }
  if (conversations.isPending) {
    return <ListSkeleton label={ASK_INSIGHTS_COPY.conversationsLoading} />;
  }
  if (conversations.items.length === 0) {
    return (
      <EmptyNote>
        {filters.isFiltered
          ? ASK_INSIGHTS_COPY.conversationsEmptyFiltered
          : ASK_INSIGHTS_COPY.conversationsEmpty}
      </EmptyNote>
    );
  }
  return (
    <>
      <ConversationsTable
        conversations={conversations.items}
        isRefreshing={conversations.isPlaceholderData}
      />
      <TablePagination
        pagination={pagination}
        total={conversations.total}
        pageCount={conversations.pageCount}
        noun={ASK_INSIGHTS_COPY.conversationNoun}
        isFetching={conversations.isPlaceholderData}
      />
    </>
  );
}
