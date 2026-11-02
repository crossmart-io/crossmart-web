import { ImportIssueOutcome } from '@/api/schema';
import { IMPORT_ISSUE_OUTCOME_LABELS } from './imports.constants';
import type { ImportJobIssue } from './imports.types';

/** The outcome tabs above an import's issues. `All` is no filter. */
export const ALL_OUTCOMES = 'all';
export type OutcomeFilter = ImportIssueOutcome | typeof ALL_OUTCOMES;

/** Failures first: they are the rows that need fixing. */
export const OUTCOME_FILTERS: readonly { value: OutcomeFilter; label: string }[] = [
  { value: ALL_OUTCOMES, label: 'All' },
  {
    value: ImportIssueOutcome.FAILED,
    label: IMPORT_ISSUE_OUTCOME_LABELS[ImportIssueOutcome.FAILED],
  },
  {
    value: ImportIssueOutcome.SKIPPED,
    label: IMPORT_ISSUE_OUTCOME_LABELS[ImportIssueOutcome.SKIPPED],
  },
];

export function toOutcomeFilter(value: string): OutcomeFilter | undefined {
  return OUTCOME_FILTERS.find((filter) => filter.value === value)?.value;
}

export function filterIssues(issues: ImportJobIssue[], filter: OutcomeFilter): ImportJobIssue[] {
  return filter === ALL_OUTCOMES ? issues : issues.filter((issue) => issue.outcome === filter);
}

export function countIssues(issues: ImportJobIssue[]): Record<OutcomeFilter, number> {
  return {
    [ALL_OUTCOMES]: issues.length,
    [ImportIssueOutcome.FAILED]: filterIssues(issues, ImportIssueOutcome.FAILED).length,
    [ImportIssueOutcome.SKIPPED]: filterIssues(issues, ImportIssueOutcome.SKIPPED).length,
  };
}
