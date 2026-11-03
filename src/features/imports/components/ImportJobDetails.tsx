import { CircleAlert } from 'lucide-react';
import { ImportJobStatus } from '@/api/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CHANNEL_IMPORT_FORMATS, IMPORT_MODE_COPY } from '../imports.constants';
import type { ImportJobDetail } from '../imports.types';
import { ImportJobCounts } from './ImportJobCounts';
import { ImportJobIssues } from './ImportJobIssues';
import { ImportJobProgress } from './ImportJobProgress';

/** One import: its progress or why it failed, what it changed and the records to review. */
export function ImportJobDetails({ job }: { job: ImportJobDetail }) {
  const { record } = IMPORT_MODE_COPY[job.mode];
  const fromChannel = CHANNEL_IMPORT_FORMATS.has(job.format);
  return (
    <>
      {job.status === ImportJobStatus.PROCESSING && <ImportJobProgress job={job} record={record} />}
      {job.errorMessage && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{fromChannel ? 'The import stopped' : 'The file was rejected'}</AlertTitle>
          <AlertDescription>{job.errorMessage}</AlertDescription>
        </Alert>
      )}
      <ImportJobCounts counts={job.counts} mode={job.mode} record={record} />
      <ImportJobIssues issues={job.issues} fromChannel={fromChannel} />
    </>
  );
}
