import { ListingDisplayState } from '@/api/schema';
import type { RequirementFix } from '@/features/channels/publish-requirements';

/** The one thing a store card on the product page offers, after what the listing needs most. */
export enum ChannelItemAction {
  /** The product is not in the store: add it. */
  Add = 'add',
  /** Something must be given before it can publish: go and give it. */
  Fix = 'fix',
  /** The store refused the last publish for no reason to fix: send it again. */
  Retry = 'retry',
  /** It is in the store: change how it shows there. */
  Edit = 'edit',
  /** The member may not change listings. */
  None = 'none',
}

export interface ChannelItemActionInput {
  canEdit: boolean;
  /** Whether the product is in the store, or on its way there. */
  selected: boolean;
  displayState: ListingDisplayState;
  fix: RequirementFix | null;
  /** False while the store needs reconnecting: nothing can be sent there. */
  canRetry: boolean;
}

/** Which action a store card shows: adding, then fixing, then retrying, then editing. */
export function channelItemAction({
  canEdit,
  selected,
  displayState,
  fix,
  canRetry,
}: ChannelItemActionInput): ChannelItemAction {
  if (!canEdit) return ChannelItemAction.None;
  if (!selected) return ChannelItemAction.Add;
  if (fix) return ChannelItemAction.Fix;
  if (displayState === ListingDisplayState.failed && canRetry) return ChannelItemAction.Retry;
  return ChannelItemAction.Edit;
}
