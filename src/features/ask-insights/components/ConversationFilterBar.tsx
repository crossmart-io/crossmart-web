import type { AskChannel, AskOutcome } from '@/api/schema';
import { FilterSelect } from '@/components/lists/FilterSelect';
import { Button } from '@/components/ui/button';
import { toEnumOptions } from '@/lib/enum';
import {
  ASK_CHANNEL_LABELS,
  ASK_INSIGHTS_COPY,
  ASK_OUTCOME_LABELS,
  ESCALATED_FILTER_LABELS,
} from '../ask-insights.constants';
import type { EscalatedFilter } from '../ask-insights.types';
import type { ConversationFilters } from '../hooks/useConversationFilters';
import { DayRangeFields } from './DayRangeFields';

const OUTCOME_OPTIONS = toEnumOptions<AskOutcome>(ASK_OUTCOME_LABELS);
const CHANNEL_OPTIONS = toEnumOptions<AskChannel>(ASK_CHANNEL_LABELS);
const ESCALATED_OPTIONS = toEnumOptions<EscalatedFilter>(ESCALATED_FILTER_LABELS);

/** Narrows the conversations by outcome, channel, escalation and period. */
export function ConversationFilterBar({ filters }: { filters: ConversationFilters }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <FilterSelect
          options={OUTCOME_OPTIONS}
          value={filters.outcome}
          onChange={filters.setOutcome}
          anyLabel={ASK_INSIGHTS_COPY.anyOutcome}
          label={ASK_INSIGHTS_COPY.outcomeFilter}
        />
        <FilterSelect
          options={CHANNEL_OPTIONS}
          value={filters.channel}
          onChange={filters.setChannel}
          anyLabel={ASK_INSIGHTS_COPY.anyChannel}
          label={ASK_INSIGHTS_COPY.channelFilter}
        />
        <FilterSelect
          options={ESCALATED_OPTIONS}
          value={filters.escalated}
          onChange={filters.setEscalated}
          anyLabel={ASK_INSIGHTS_COPY.anyEscalation}
          label={ASK_INSIGHTS_COPY.escalatedFilter}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DayRangeFields range={filters.range} setFrom={filters.setFrom} setTo={filters.setTo} />
        {filters.isFiltered && (
          <Button variant="ghost" size="sm" className="self-start" onClick={filters.clearAll}>
            {ASK_INSIGHTS_COPY.clearFilters}
          </Button>
        )}
      </div>
    </div>
  );
}
