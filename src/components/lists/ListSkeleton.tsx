import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_ROWS = 5;

interface ListSkeletonProps {
  /** Read to screen readers, such as "Loading products". */
  label: string;
  rows?: number;
  /** A short bar above the rows, for lists grouped under headings (such as days). */
  withHeading?: boolean;
}

/** Grey rows in the shape of a list while its first page loads. */
export function ListSkeleton({
  label,
  rows = DEFAULT_ROWS,
  withHeading = false,
}: ListSkeletonProps) {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label={label}>
      {withHeading && <Skeleton className="h-4 w-24" />}
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
