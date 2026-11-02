import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { ImportIssueOutcome } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { IMPORT_ISSUE_OUTCOME_LABELS } from '../imports.constants';
import type { ImportJobIssue } from '../imports.types';
import {
  ALL_OUTCOMES,
  countIssues,
  filterIssues,
  OUTCOME_FILTERS,
  type OutcomeFilter,
  toOutcomeFilter,
} from '../issue-filter';

const OUTCOME_BADGES = {
  [ImportIssueOutcome.FAILED]: 'destructive',
  [ImportIssueOutcome.SKIPPED]: 'outline',
} as const satisfies Record<ImportIssueOutcome, 'destructive' | 'outline'>;

/** The rows an import skipped or could not apply, with a filter by outcome. */
export function ImportJobIssues({ issues }: { issues: ImportJobIssue[] }) {
  const [filter, setFilter] = useState<OutcomeFilter>(ALL_OUTCOMES);

  if (issues.length === 0) return <NoIssues />;
  const counts = countIssues(issues);
  return (
    <section className="flex flex-col gap-3" aria-labelledby="import-issues-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="import-issues-heading" className="font-heading text-lg font-semibold">
          Rows to review
        </h2>
        <ToggleGroup
          type="single"
          variant="outline"
          value={filter}
          onValueChange={(value) => {
            const next = toOutcomeFilter(value);
            if (next) setFilter(next);
          }}
          aria-label="Filter by outcome"
        >
          {OUTCOME_FILTERS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value} className="gap-1.5 px-3">
              {option.label}
              <span className="text-xs text-muted-foreground tabular-nums">
                {counts[option.value].toLocaleString()}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <IssuesTable issues={filterIssues(issues, filter)} />
    </section>
  );
}

function IssuesTable({ issues }: { issues: ImportJobIssue[] }) {
  return (
    <div className="rounded-lg border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Row</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">Outcome</TableHead>
            <TableHead className="hidden w-48 md:table-cell">Record</TableHead>
            <TableHead>Problem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, index) => (
            <IssueRow key={`${index}-${issue.row}-${issue.code}`} issue={issue} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IssueRow({ issue }: { issue: ImportJobIssue }) {
  const record = issue.handle ?? issue.sku;
  return (
    <TableRow>
      <TableCell className="align-top tabular-nums">{issue.row ?? '—'}</TableCell>
      <TableCell className="hidden align-top sm:table-cell">
        <Badge variant={OUTCOME_BADGES[issue.outcome]}>
          {IMPORT_ISSUE_OUTCOME_LABELS[issue.outcome]}
        </Badge>
      </TableCell>
      <TableCell className="hidden truncate align-top font-mono text-xs md:table-cell">
        {record ?? '—'}
      </TableCell>
      <TableCell className="whitespace-normal break-words">
        <span className="flex flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2 md:hidden">
            <Badge variant={OUTCOME_BADGES[issue.outcome]} className="sm:hidden">
              {IMPORT_ISSUE_OUTCOME_LABELS[issue.outcome]}
            </Badge>
            {record && <span className="font-mono text-xs">{record}</span>}
          </span>
          {issue.message}
        </span>
      </TableCell>
    </TableRow>
  );
}

function NoIssues() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleCheck />
        </EmptyMedia>
        <EmptyTitle>Every row went through</EmptyTitle>
        <EmptyDescription>Nothing in this file was skipped or failed.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
