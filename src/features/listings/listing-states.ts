import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleMinus,
  CircleX,
  LoaderCircle,
  type LucideIcon,
} from 'lucide-react';
import { ListingDisplayState } from '@/api/schema';

/** Badge looks a listing state can take; each also has its own icon and words. */
export type ListingStateTone = 'outline' | 'warning' | 'secondary' | 'success' | 'destructive';

export interface ListingStatePresentation {
  label: string;
  /** What the state means, for a row with nothing more specific to say. */
  hint: string;
  icon: LucideIcon;
  tone: ListingStateTone;
  /** The icon turns while the state is in flight. */
  spinning?: boolean;
}

/** How each state a product can have on a store reads: never by colour alone. */
export const LISTING_STATE_PRESENTATION: Record<ListingDisplayState, ListingStatePresentation> = {
  [ListingDisplayState.draft]: {
    label: 'Draft',
    hint: 'Not in this store.',
    icon: CircleDashed,
    tone: 'outline',
  },
  [ListingDisplayState.needs_details]: {
    label: 'Needs details',
    hint: 'Publishing waits for something to be added.',
    icon: CircleAlert,
    tone: 'warning',
  },
  [ListingDisplayState.ready]: {
    label: 'Ready to publish',
    hint: 'Goes to the store with the next sync.',
    icon: CircleDot,
    tone: 'secondary',
  },
  [ListingDisplayState.publishing]: {
    label: 'Publishing',
    hint: 'Being sent to the store now.',
    icon: LoaderCircle,
    tone: 'secondary',
    spinning: true,
  },
  [ListingDisplayState.published]: {
    label: 'Published',
    hint: 'Live in the store.',
    icon: CircleCheck,
    tone: 'success',
  },
  [ListingDisplayState.failed]: {
    label: 'Failed',
    hint: 'The store refused the last publish.',
    icon: CircleX,
    tone: 'destructive',
  },
  [ListingDisplayState.removing]: {
    label: 'Removing',
    hint: 'Being taken off the store.',
    icon: LoaderCircle,
    tone: 'secondary',
    spinning: true,
  },
  [ListingDisplayState.removed]: {
    label: 'Removed',
    hint: 'Off the store until you add it back.',
    icon: CircleMinus,
    tone: 'outline',
  },
};

/** States that change on their own soon, so the screen keeps checking on them. */
const IN_FLIGHT_STATES: readonly ListingDisplayState[] = [
  ListingDisplayState.publishing,
  ListingDisplayState.removing,
];

export function isListingInFlight(state: ListingDisplayState): boolean {
  return IN_FLIGHT_STATES.includes(state);
}

/** States with a reason to read and something to fix. */
const STATES_WITH_REASON: readonly ListingDisplayState[] = [
  ListingDisplayState.needs_details,
  ListingDisplayState.failed,
];

export function hasListingReason(state: ListingDisplayState): boolean {
  return STATES_WITH_REASON.includes(state);
}
