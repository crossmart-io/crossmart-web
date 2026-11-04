import { CircleAlert, CircleCheck, CircleMinus } from 'lucide-react';
import { Link } from 'react-router';
import { CatalogImportMode } from '@/api/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toImportJobRoute } from '@/config/routes';
import { pluralize } from '@/lib/format';
import { describeResult } from '../import-summary';
import { IMPORT_MODE_COPY } from '../imports.constants';
import type { CatalogImportResult } from '../imports.types';
import { ImportIssueList } from './ImportIssueList';

export function ImportResultSummary({ result }: { result: CatalogImportResult }) {
  const { skipped, failed } = result;
  const record = IMPORT_MODE_COPY[result.mode].record;

  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <CircleCheck />
        <AlertTitle>{describeResult(result)}</AlertTitle>
        <AlertDescription>
          <Link to={toImportJobRoute(result.jobId)} className="underline underline-offset-4">
            See it in the import history
          </Link>
        </AlertDescription>
      </Alert>
      {skipped.length > 0 && <SkippedRecords result={result} record={record} />}
      {failed.length > 0 && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{pluralize(failed.length, record)} could not be imported</AlertTitle>
          <AlertDescription>
            <ImportIssueList issues={failed} />
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/** New products that already exist are expected, so a count says enough; other skips need reasons. */
function SkippedRecords({ result, record }: { result: CatalogImportResult; record: string }) {
  const { skipped } = result;
  return (
    <Alert>
      <CircleMinus />
      <AlertTitle>
        {pluralize(skipped.length, `${record} was`, `${record}s were`)} left unchanged
      </AlertTitle>
      <AlertDescription>
        {result.mode === CatalogImportMode.create ? (
          'They are already in your catalog.'
        ) : (
          <ImportIssueList issues={skipped} />
        )}
      </AlertDescription>
    </Alert>
  );
}
