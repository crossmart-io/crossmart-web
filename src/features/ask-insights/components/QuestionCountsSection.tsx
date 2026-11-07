import type { UseQueryResult } from '@tanstack/react-query';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { ASK_INSIGHTS_COPY } from '../ask-insights.constants';
import type { AskQuestionCount, DayRange } from '../ask-insights.types';
import { useDayRangeFilter } from '../hooks/useDayRangeFilter';
import { DayRangeFields } from './DayRangeFields';
import { EmptyNote } from './EmptyNote';
import { QuestionCountsTable } from './QuestionCountsTable';

interface QuestionCountsSectionProps {
  description: string;
  /** Loads the list for the period picked above it. */
  useQuestions: (range: DayRange) => UseQueryResult<AskQuestionCount[], unknown>;
}

/** A ranked list of questions for a period: the top questions, or the unanswered ones. */
export function QuestionCountsSection({ description, useQuestions }: QuestionCountsSectionProps) {
  const dayRange = useDayRangeFilter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-muted-foreground">{description}</p>
        <DayRangeFields {...dayRange} />
      </div>
      <QuestionCountsResults query={useQuestions(dayRange.range)} />
    </div>
  );
}

function QuestionCountsResults({ query }: { query: UseQueryResult<AskQuestionCount[], unknown> }) {
  if (query.isError) {
    return (
      <ErrorState
        title={ASK_INSIGHTS_COPY.questionsLoadFailed}
        error={query.error}
        onRetry={query.refetch}
      />
    );
  }
  if (query.isPending) return <ListSkeleton label={ASK_INSIGHTS_COPY.questionsLoading} />;
  if (query.data.length === 0) return <EmptyNote>{ASK_INSIGHTS_COPY.questionsEmpty}</EmptyNote>;
  return <QuestionCountsTable questions={query.data} />;
}
