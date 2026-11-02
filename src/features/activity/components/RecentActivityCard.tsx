import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductActivity } from '../hooks/useProductActivity';
import { ActivityEventItem } from './ActivityEventItem';

interface RecentActivityCardProps {
  workspaceId: string;
  productId: string;
}

/** The latest changes to one product, for its editor page. */
export function RecentActivityCard({ workspaceId, productId }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-sm font-semibold">Recent activity</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RecentActivity workspaceId={workspaceId} productId={productId} />
      </CardContent>
    </Card>
  );
}

function RecentActivity({ workspaceId, productId }: RecentActivityCardProps) {
  const { data, isPending, error, refetch } = useProductActivity(workspaceId, productId);

  if (error) {
    return <ErrorState title="Activity could not be loaded" error={error} onRetry={refetch} />;
  }
  if (isPending) return <Skeleton className="h-24 w-full" />;
  if (data.items.length === 0) {
    return <p className="text-sm text-muted-foreground">No changes recorded yet.</p>;
  }
  return (
    <ul className="-my-2 divide-y">
      {data.items.map((event) => (
        <ActivityEventItem key={event.id} event={event} linkSubject={false} compact />
      ))}
    </ul>
  );
}
