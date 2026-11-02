import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface LoadMoreButtonProps {
  isLoading: boolean;
  onLoadMore: () => void;
}

/** The next page of a cursor-paged list. */
export function LoadMoreButton({ isLoading, onLoadMore }: LoadMoreButtonProps) {
  return (
    <Button variant="outline" className="self-center" disabled={isLoading} onClick={onLoadMore}>
      {isLoading && <Spinner data-icon="inline-start" />}
      {isLoading ? 'Loading…' : 'Load more'}
    </Button>
  );
}
