import { Wrench } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useReturnToState } from '@/components/navigation/return-to';
import { FixTarget, type RequirementFix } from '@/features/channels/publish-requirements';
import { type ListingRef, listingFixRoute } from '../listing-fix';

interface ListingFixActionProps {
  fix: RequirementFix;
  listing: ListingRef;
  /** Opens the store's overrides panel on this page; without it, the product page opens it. */
  onOpenOverride?: () => void;
}

/** The way to where the problem is fixed: the store's settings, the product, or its overrides. */
export function ListingFixAction({ fix, listing, onOpenOverride }: ListingFixActionProps) {
  const returnTo = useReturnToState();
  if (fix.target === FixTarget.StoreOverride && onOpenOverride) {
    return (
      <Button type="button" variant="outline" size="xs" onClick={onOpenOverride}>
        <Wrench data-icon="inline-start" />
        {fix.action}
      </Button>
    );
  }
  return (
    <Button asChild variant="outline" size="xs">
      <Link to={listingFixRoute(fix, listing)} state={returnTo}>
        <Wrench data-icon="inline-start" />
        {fix.action}
      </Link>
    </Button>
  );
}
