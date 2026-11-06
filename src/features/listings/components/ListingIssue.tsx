import { ListingDisplayState } from '@/api/schema';
import type { RequirementFix } from '@/features/channels/publish-requirements';
import { cn } from '@/lib/utils';
import type { ProductChannelRef } from '../hooks/useProductChannels';
import { hasListingReason } from '../listing-states';
import { ListingFixAction } from './ListingFixAction';
import { RetryListingButton } from './RetryListingButton';

export interface ListingIssueProps {
  state: ListingDisplayState;
  reason: string | null;
  fix: RequirementFix | null;
  listing: ProductChannelRef;
  /** Whether the member may retry and open the overrides panel. */
  canEdit: boolean;
  /** No retry while the store needs reconnecting: the fix says so instead. */
  canRetry: boolean;
  onOpenOverride?: () => void;
}

interface IssueActionsProps extends Pick<ListingIssueProps, 'fix' | 'listing' | 'onOpenOverride'> {
  showRetry: boolean;
}

/** The fix, then "Try again" for a failure; nothing when there is neither. */
function IssueActions({ fix, listing, showRetry, onOpenOverride }: IssueActionsProps) {
  if (!fix && !showRetry) return null;
  return (
    <div className="flex flex-wrap items-start gap-1.5">
      {fix && <ListingFixAction fix={fix} listing={listing} onOpenOverride={onOpenOverride} />}
      {showRetry && <RetryListingButton listing={listing} />}
    </div>
  );
}

/**
 * Beside a listing that needs details or failed: why, in the API's words, the way to fix it,
 * and, for a failure, publishing it again. Renders nothing for the other states.
 */
export function ListingIssue({
  state,
  reason,
  fix,
  listing,
  canEdit,
  canRetry,
  onOpenOverride,
}: ListingIssueProps) {
  if (!hasListingReason(state)) return null;
  const failed = state === ListingDisplayState.failed;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5">
      {reason && (
        <p
          className={cn('text-xs break-words', failed ? 'text-destructive' : 'text-warning')}
          title={reason}
        >
          {reason}
        </p>
      )}
      <IssueActions
        fix={fix}
        listing={listing}
        showRetry={failed && canEdit && canRetry}
        onOpenOverride={canEdit ? onOpenOverride : undefined}
      />
    </div>
  );
}
