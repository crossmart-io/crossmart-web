import { FileSpreadsheet, Store } from 'lucide-react';
import { Link } from 'react-router';
import { ImportJobStatus } from '@/api/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toImportJobRoute } from '@/config/routes';
import { formatDateTime } from '@/lib/format';
import { describeActor, describeCounts, describeProgress } from '../import-summary';
import {
  CHANNEL_IMPORT_FORMATS,
  IMPORT_FORMAT_LABELS,
  IMPORT_JOB_STATUS_LABELS,
  IMPORT_MODE_COPY,
} from '../imports.constants';
import type { ImportJob } from '../imports.types';
import { ImportJobStatusBadge } from './ImportJobStatusBadge';

/** The import history. Each source opens its import; narrow screens fold columns into it. */
export function ImportJobsTable({ jobs }: { jobs: ImportJob[] }) {
  return (
    <div className="rounded-lg border">
      <Table stickyHeader className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead className="hidden w-32 sm:table-cell">Status</TableHead>
            <TableHead className="hidden w-56 md:table-cell">Result</TableHead>
            <TableHead className="hidden w-48 lg:table-cell">Imported by</TableHead>
            <TableHead className="hidden w-44 sm:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <ImportJobRow key={job.id} job={job} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ImportJobRow({ job }: { job: ImportJob }) {
  const counts =
    job.status === ImportJobStatus.PROCESSING
      ? `Importing · ${describeProgress(job, IMPORT_MODE_COPY[job.mode].record)}`
      : (job.errorMessage ?? describeCounts(job.counts, job.mode));
  const SourceIcon = CHANNEL_IMPORT_FORMATS.has(job.format) ? Store : FileSpreadsheet;
  return (
    // The source link stretches over the row, so the whole row opens the import.
    <TableRow className="relative">
      <TableCell className="whitespace-normal">
        <div className="flex min-w-0 items-start gap-3">
          <SourceIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <Link
              to={toImportJobRoute(job.id)}
              className="truncate font-medium after:absolute after:inset-0 hover:underline focus-visible:underline"
            >
              {job.fileName}
            </Link>
            <span className="text-xs text-muted-foreground">
              {IMPORT_FORMAT_LABELS[job.format]} · {IMPORT_MODE_COPY[job.mode].label}
            </span>
            <span className="text-xs text-muted-foreground sm:hidden">
              {IMPORT_JOB_STATUS_LABELS[job.status]} · {formatDateTime(job.createdAt)}
            </span>
            <span className="truncate text-xs text-muted-foreground md:hidden">{counts}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <ImportJobStatusBadge status={job.status} />
      </TableCell>
      <TableCell className="hidden truncate text-muted-foreground md:table-cell">
        {counts}
      </TableCell>
      <TableCell className="hidden truncate text-muted-foreground lg:table-cell">
        {describeActor(job.actor)}
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
        {formatDateTime(job.createdAt)}
      </TableCell>
    </TableRow>
  );
}
