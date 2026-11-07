import type { AskEscalationStatus } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FilterSelect } from '@/components/lists/FilterSelect';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { toEnumOptions } from '@/lib/enum';
import { ASK_ESCALATION_STATUS_LABELS, ASK_INSIGHTS_COPY } from '../ask-insights.constants';
import { openFirst } from '../escalations';
import { useAskEscalations } from '../hooks/useAskEscalations';
import { useEscalationStatusFilter } from '../hooks/useEscalationStatusFilter';
import { EmptyNote } from './EmptyNote';
import { EscalationsTable } from './EscalationsTable';

const STATUS_OPTIONS = toEnumOptions<AskEscalationStatus>(ASK_ESCALATION_STATUS_LABELS);

/** Escalations, open ones first, narrowed to one status when picked. */
export function EscalationList() {
  const { status, setStatus } = useEscalationStatusFilter();
  return (
    <div className="flex flex-col gap-4">
      <FilterSelect
        options={STATUS_OPTIONS}
        value={status}
        onChange={setStatus}
        anyLabel={ASK_INSIGHTS_COPY.anyStatus}
        label={ASK_INSIGHTS_COPY.statusFilter}
      />
      <EscalationResults status={status} />
    </div>
  );
}

function EscalationResults({ status }: { status: AskEscalationStatus | undefined }) {
  const escalations = useAskEscalations(status);
  if (escalations.isError) {
    return (
      <ErrorState
        title={ASK_INSIGHTS_COPY.escalationsLoadFailed}
        error={escalations.error}
        onRetry={escalations.refetch}
      />
    );
  }
  if (escalations.isPending) return <ListSkeleton label={ASK_INSIGHTS_COPY.escalationsLoading} />;
  if (escalations.data.length === 0) {
    return (
      <EmptyNote>
        {status ? ASK_INSIGHTS_COPY.escalationsEmptyFiltered : ASK_INSIGHTS_COPY.escalationsEmpty}
      </EmptyNote>
    );
  }
  return <EscalationsTable escalations={openFirst(escalations.data)} />;
}
