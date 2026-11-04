import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ROWS = 6;

export function ActivityTimelineSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading activity">
      <Skeleton className="h-4 w-24" />
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
