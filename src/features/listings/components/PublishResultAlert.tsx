import { CircleAlert, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PUBLISH_STORES_COPY } from '../listings.constants';
import { publishResultFromState } from '../publish-result-state';

/**
 * After "Save & publish", the stores that refused the new product and why, above its page.
 * The product itself was saved; each store can be tried again from the Stores card.
 */
export function PublishResultAlert() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = publishResultFromState(location.state);
  if (!result || result.failures.length === 0) return null;
  const total = result.added + result.failures.length;
  const dismiss = () =>
    void navigate({ pathname: location.pathname, search: location.search }, { replace: true });
  return (
    <Alert variant="destructive" className="mb-6">
      <CircleAlert />
      <AlertTitle>
        {result.added > 0
          ? PUBLISH_STORES_COPY.partialTitle(result.added, total)
          : PUBLISH_STORES_COPY.failedTitle}
      </AlertTitle>
      <AlertDescription>
        <ul className="flex flex-col gap-0.5">
          {result.failures.map((failure) => (
            <li key={failure.storeName}>
              <span className="font-medium">{failure.storeName}:</span> {failure.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
      <AlertAction>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={dismiss}
          aria-label={PUBLISH_STORES_COPY.dismiss}
        >
          <X />
        </Button>
      </AlertAction>
    </Alert>
  );
}
