import { Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@/config/routes';
import { EditorCard } from './EditorCard';

/** Where the product is listed. Listings arrive with the channel connectors. */
export function ChannelsCard() {
  return (
    <EditorCard title="Channels">
      <div className="flex items-start gap-3 text-sm">
        <Share2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          Not listed on any channel yet.{' '}
          <Link to={ROUTES.channels} className="font-medium text-foreground underline">
            Connect a channel
          </Link>{' '}
          to publish it with content written for each marketplace.
        </p>
      </div>
    </EditorCard>
  );
}
