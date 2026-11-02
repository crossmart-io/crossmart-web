import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IMPORT_MODE_COPY } from '../imports.constants';
import type { ImportJobDetail } from '../imports.types';
import { ImportJobCounts } from './ImportJobCounts';
import { ImportJobIssues } from './ImportJobIssues';

/** One import: why the file was rejected, what it changed and the rows to review. */
export function ImportJobDetails({ job }: { job: ImportJobDetail }) {
  return (
    <>
      {job.errorMessage && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>The file was rejected</AlertTitle>
          <AlertDescription>{job.errorMessage}</AlertDescription>
        </Alert>
      )}
      <ImportJobCounts counts={job.counts} record={IMPORT_MODE_COPY[job.mode].record} />
      <ImportJobIssues issues={job.issues} />
    </>
  );
}
