import { useRouteError } from 'react-router';
import { isStaleBuildError, reloadWindowForStaleBuild } from '@/lib/stale-build-reload';
import { ErrorState } from './ErrorState';
import { PageLoader } from './PageLoader';

const ERROR_TITLE = 'Something went wrong';

function reloadPage(): void {
  window.location.reload();
}

/**
 * The app's error page. A page missing after a deploy reloads quietly to pick up the new build;
 * any other error is shown with a way to load the page again.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  if (isStaleBuildError(error) && reloadWindowForStaleBuild()) return <PageLoader />;

  return (
    <main className="mx-auto grid min-h-svh max-w-xl place-items-center p-6">
      <ErrorState title={ERROR_TITLE} error={error} onRetry={reloadPage} />
    </main>
  );
}
