import { Spinner } from '@/components/ui/spinner';

/** Placeholder inside the page while its data loads; the app shell stays in place. */
export function ContentLoader() {
  return (
    <div className="grid place-items-center py-24 text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  );
}
