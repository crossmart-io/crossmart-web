import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ROWS = 5;

export function ProductsTableSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
