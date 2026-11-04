import { ArrowRight, Download } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ImportJobStatus } from '@/api/schema';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toImportJobRoute } from '@/config/routes';
import {
  describeCounts,
  IMPORT_MODE_COPY,
  type ImportJobDetail,
  ImportJobProgress,
} from '@/features/imports';
import type { ChannelConnection } from '../channels.types';
import { useChannelImport } from '../hooks/useChannelImport';

interface ChannelImportSectionProps {
  workspaceId: string;
  connection: ChannelConnection;
  channelName: string;
  /** More actions on the connection, shown next to the import button. */
  children?: ReactNode;
}

/** Brings the store's products into the catalog, and shows how the import is going. */
export function ChannelImportSection({
  workspaceId,
  connection,
  channelName,
  children,
}: ChannelImportSectionProps) {
  const { job, start, isStarting, isRunning, error } = useChannelImport(workspaceId, connection.id);

  return (
    <div className="flex flex-col gap-2">
      {job ? <ImportJobStatusLine job={job} /> : <LastImported at={connection.lastSyncedAt} />}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={connection.lastSyncedAt ? 'outline' : 'default'}
          disabled={isStarting || isRunning}
          onClick={start}
        >
          {isStarting || isRunning ? (
            <Spinner data-icon="inline-start" aria-hidden="true" />
          ) : (
            <Download data-icon="inline-start" />
          )}
          {isRunning ? 'Importing…' : `Import products from ${channelName}`}
        </Button>
        {children}
      </div>
    </div>
  );
}

function LastImported({ at }: { at: string | null }) {
  return (
    <p className="text-sm text-muted-foreground">
      {at ? (
        <>
          Products last imported <RelativeTime value={at} />.
        </>
      ) : (
        'Bring your products into Crossmart. Products you already have are linked, not copied.'
      )}
    </p>
  );
}

function ImportJobStatusLine({ job }: { job: ImportJobDetail }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      {job.status === ImportJobStatus.PROCESSING && (
        <ImportJobProgress job={job} record={IMPORT_MODE_COPY[job.mode].record} />
      )}
      {job.status === ImportJobStatus.COMPLETED && (
        <p className="text-success">Import finished · {describeCounts(job.counts, job.mode)}</p>
      )}
      {job.status === ImportJobStatus.FAILED && (
        <p className="text-destructive">Import stopped · {job.errorMessage}</p>
      )}
      <Link
        to={toImportJobRoute(job.id)}
        className="inline-flex items-center gap-1 self-start font-medium text-foreground underline-offset-4 hover:underline"
      >
        View in import history
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
