import './channel-map.css';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { CHANNEL_MAP_COPY, NODE_ACTIVITY_CLASSES } from '../channel-map.constants';
import type { NodeActivity, NodeOverlay } from '../channel-map.types';

const NO_OVERLAY: NodeOverlay = { activity: null, proposals: 0, highlighted: false };

function ActivityPill({ activity }: { activity: NodeActivity }) {
  return (
    <span
      className={cn(
        'absolute -top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate rounded-full px-2.5 py-0.5 text-xs leading-4 font-semibold shadow-sm',
        NODE_ACTIVITY_CLASSES[activity.tone].pill,
      )}
    >
      {activity.label}
    </span>
  );
}

function ProposalMarker({ count, onOpen }: { count: number; onOpen?: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={CHANNEL_MAP_COPY.proposals(count)}
      title={CHANNEL_MAP_COPY.proposals(count)}
      className="absolute -top-3 -right-3 z-10 grid size-7 place-items-center rounded-full border-2 border-background bg-warning text-sm font-semibold text-white tabular-nums shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:text-black"
    >
      {count}
    </button>
  );
}

/**
 * A node's card with what a live view lays over it: a ring and a pill saying what the agent is
 * doing there, a marker for its changes waiting for approval, and a ring when something points
 * at the node (an event hovered). The pill's words are read with the card.
 */
function frameClasses(activity: NodeActivity | null, highlighted: boolean): string {
  return cn(
    'node-activity relative rounded-xl transition-shadow duration-300 motion-reduce:transition-none',
    activity && NODE_ACTIVITY_CLASSES[activity.tone].ring,
    highlighted && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
  );
}

export function NodeOverlayFrame({
  overlay = NO_OVERLAY,
  children,
}: PropsWithChildren<{ overlay?: NodeOverlay }>) {
  const { activity, proposals, highlighted, onOpenProposals } = overlay;
  return (
    <div
      data-tone={activity?.tone}
      data-highlighted={highlighted || undefined}
      className={frameClasses(activity, highlighted)}
    >
      {activity && <ActivityPill activity={activity} />}
      {proposals > 0 && <ProposalMarker count={proposals} onOpen={onOpenProposals} />}
      {children}
    </div>
  );
}
