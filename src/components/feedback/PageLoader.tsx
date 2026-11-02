import { LoaderCircle } from 'lucide-react';

/** Full-page placeholder while the app works out who is signed in. */
export function PageLoader() {
  return (
    <output className="grid min-h-svh place-items-center" aria-label="Loading">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </output>
  );
}
