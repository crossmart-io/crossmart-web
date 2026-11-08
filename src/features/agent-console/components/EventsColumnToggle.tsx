import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AGENT_CONSOLE_COPY,
  AGENT_CONSOLE_TEST_IDS,
  EVENTS_COLUMN_ID,
} from '../agent-console.constants';

/** In the Events header: hides the column, so the map takes its width. */
export function HideEventsButton({ onHide }: { onHide: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-expanded="true"
      aria-controls={EVENTS_COLUMN_ID}
      aria-label={AGENT_CONSOLE_COPY.hideEvents}
      title={AGENT_CONSOLE_COPY.hideEvents}
      data-testid={AGENT_CONSOLE_TEST_IDS.hideEvents}
      onClick={onHide}
    >
      <PanelRightClose />
    </Button>
  );
}

/**
 * The slim rail left when the Events column is hidden: it says how many events arrived unseen
 * and shows the column again.
 */
export function EventsRail({ unseen, onShow }: { unseen: number; onShow: () => void }) {
  return (
    <button
      type="button"
      aria-expanded="false"
      aria-controls={EVENTS_COLUMN_ID}
      aria-label={AGENT_CONSOLE_COPY.showEvents(unseen)}
      title={AGENT_CONSOLE_COPY.showEvents(unseen)}
      data-testid={AGENT_CONSOLE_TEST_IDS.showEvents}
      onClick={onShow}
      className="flex h-full w-11 flex-col items-center gap-3 rounded-xl border bg-background py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <PanelRightOpen className="size-4" aria-hidden="true" />
      <span className="[writing-mode:vertical-rl]">{AGENT_CONSOLE_COPY.eventsTitle}</span>
      {unseen > 0 && (
        <span
          aria-hidden="true"
          className="rounded-full bg-brand px-1.5 text-[11px] leading-4 font-semibold text-white tabular-nums"
        >
          {unseen}
        </span>
      )}
    </button>
  );
}
