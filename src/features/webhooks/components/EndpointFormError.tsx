import { Link } from 'react-router';
import { isPlanLimitError } from '@/api/api-error';
import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

/** Why saving failed, as the API said it; a plan limit also links to the plan. */
export function EndpointFormError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <div className="flex flex-col gap-2">
      <FormError error={error} />
      {isPlanLimitError(error) && (
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link to={ROUTES.billing}>See plan & usage</Link>
        </Button>
      )}
    </div>
  );
}
