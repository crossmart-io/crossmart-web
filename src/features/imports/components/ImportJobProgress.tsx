import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { describeProgress, processedCount } from '../import-summary';
import type { ImportJob } from '../imports.types';

const PERCENT = 100;

/** How far a running import is: a bar when the source said how many records it has. */
export function ImportJobProgress({ job, record }: { job: ImportJob; record: string }) {
  const processed = processedCount(job.counts);
  const total = job.totalCount;

  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-3.5" aria-hidden="true" />
        <span className="tabular-nums">Importing · {describeProgress(job, record)}</span>
      </div>
      {total !== null && total > 0 && (
        <Progress
          value={Math.min(processed / total, 1) * PERCENT}
          className="h-1.5"
          aria-label="Import progress"
        />
      )}
    </div>
  );
}
