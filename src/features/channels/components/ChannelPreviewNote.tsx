import { FlaskConical } from 'lucide-react';
import { CHANNEL_PREVIEW_COPY } from '../channels.constants';

/** Marks a channel card that only platform admins see, so nobody mistakes it for a live channel. */
export function ChannelPreviewNote() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <FlaskConical className="size-3.5 shrink-0" aria-hidden="true" />
      {CHANNEL_PREVIEW_COPY.note}
    </p>
  );
}
