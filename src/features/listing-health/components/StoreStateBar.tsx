import { ListingDisplayState } from '@/api/schema';
import { LISTING_STATE_PRESENTATION } from '@/features/listings';
import { cn } from '@/lib/utils';
import {
  STATE_GROUP_FILLS,
  STATE_GROUP_MEMBERS,
  STATE_GROUP_ORDER,
  type StateGroup,
} from '../listing-health.constants';
import type { StoreStateSummary } from '../listing-health';

/** In-store states in the order they are listed: each with the fill of its bar part. */
const LISTED_STATES: readonly { state: ListingDisplayState; group: StateGroup }[] =
  STATE_GROUP_ORDER.flatMap((group) =>
    STATE_GROUP_MEMBERS[group].map((state) => ({ state, group })),
  );

/** Always listed, even at zero, so a healthy store says so; the rest only when present. */
const ALWAYS_LISTED: readonly ListingDisplayState[] = [
  ListingDisplayState.published,
  ListingDisplayState.failed,
];

function StateCount({
  state,
  group,
  count,
}: {
  state: ListingDisplayState;
  group: StateGroup;
  count: number;
}) {
  const { label, icon: Icon } = LISTING_STATE_PRESENTATION[state];
  return (
    <li className="flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', STATE_GROUP_FILLS[group])} aria-hidden="true" />
      <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{count.toLocaleString()}</span>
    </li>
  );
}

/**
 * A store's products by state as one thin bar, with each state's icon, label and count beside
 * it: the list carries the figures, the bar the proportions.
 */
export function StoreStateBar({ summary }: { summary: StoreStateSummary }) {
  const listed = LISTED_STATES.filter(
    ({ state }) => ALWAYS_LISTED.includes(state) || (summary.counts[state] ?? 0) > 0,
  );
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        {STATE_GROUP_ORDER.filter((group) => summary.groups[group] > 0).map((group) => (
          <div
            key={group}
            className={cn('h-full', STATE_GROUP_FILLS[group])}
            style={{ flexGrow: summary.groups[group] }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {listed.map(({ state, group }) => (
          <StateCount key={state} state={state} group={group} count={summary.counts[state] ?? 0} />
        ))}
      </ul>
    </div>
  );
}
