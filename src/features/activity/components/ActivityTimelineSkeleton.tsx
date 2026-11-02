import { ListSkeleton } from '@/components/lists/ListSkeleton';

const SKELETON_ROWS = 6;

export function ActivityTimelineSkeleton() {
  return <ListSkeleton label="Loading activity" rows={SKELETON_ROWS} withHeading />;
}
