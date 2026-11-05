import { SuggestionStatus, WorkspacePermission } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FilterTabs } from '@/components/lists/FilterTabs';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { TablePagination } from '@/components/lists/TablePagination';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useUrlPagination } from '@/hooks/usePagination';
import { useSelection } from '@/hooks/useSelection';
import { useAiStatus } from '../hooks/useAiStatus';
import { useSuggestions } from '../hooks/useSuggestions';
import { useSuggestionStatusParam } from '../hooks/useSuggestionStatusParam';
import { SUGGESTION_STATUS_TABS } from '../suggestions.constants';
import { AiNotConfiguredAlert, AiNotConfiguredState } from './AiNotConfiguredState';
import { SuggestionList } from './SuggestionList';
import { SuggestionsBulkBar } from './SuggestionsBulkBar';
import { SuggestionsEmptyState } from './SuggestionsEmptyState';

interface InboxResultsProps {
  workspace: Workspace;
  status: SuggestionStatus;
  aiConfigured: boolean;
}

function InboxResults({ workspace, status, aiConfigured }: InboxResultsProps) {
  const pagination = useUrlPagination();
  const selection = useSelection();
  const list = useSuggestions({ workspaceId: workspace.id, status }, pagination);
  const canReview =
    status === SuggestionStatus.PENDING &&
    hasPermission(workspace, WorkspacePermission.suggestions_approve);

  if (list.isError) {
    return (
      <ErrorState
        title="Suggestions could not be loaded"
        error={list.error}
        onRetry={list.refetch}
      />
    );
  }
  if (list.isPending) return <ListSkeleton label="Loading suggestions" />;
  if (list.suggestions.length === 0) {
    return aiConfigured ? <SuggestionsEmptyState status={status} /> : <AiNotConfiguredState />;
  }
  return (
    <>
      {!aiConfigured && <AiNotConfiguredAlert />}
      <SuggestionList
        workspaceId={workspace.id}
        suggestions={list.suggestions}
        selection={canReview ? selection : undefined}
      />
      <TablePagination
        pagination={pagination}
        total={list.total}
        pageCount={list.pageCount}
        noun="suggestion"
        isFetching={list.isPlaceholderData}
      />
      {selection.ids.size > 0 && (
        <>
          <div className="h-16" aria-hidden="true" />
          <SuggestionsBulkBar workspaceId={workspace.id} selection={selection} />
        </>
      )}
    </>
  );
}

/** The suggestions inbox: tabs by status, then each suggestion with its diff. */
export function SuggestionsInbox({ workspace }: { workspace: Workspace }) {
  const [status, setStatus] = useSuggestionStatusParam();
  const aiStatus = useAiStatus(workspace.id);
  return (
    <div className="flex flex-col gap-4">
      <FilterTabs
        tabs={SUGGESTION_STATUS_TABS}
        value={status}
        onChange={setStatus}
        label="Suggestion status"
      />
      <InboxResults
        key={status}
        workspace={workspace}
        status={status}
        aiConfigured={aiStatus.data?.configured ?? true}
      />
    </div>
  );
}
